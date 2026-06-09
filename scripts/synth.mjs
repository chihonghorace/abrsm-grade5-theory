#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Deterministic question synthesiser. Generates ORIGINAL Grade 5 questions by
// COMPUTING them from music-theory rules — no external content is read or
// copied. Self-tests (assertions) run first; if any music-theory primitive is
// wrong, the script aborts before generating anything.
//
//   node scripts/synth.mjs [--max 90]
//
// Writes data/proposed/synth-<timestamp>.json. Review, then:
//   npm run questions:import -- data/proposed/synth-<...>.json
//   npm run questions:validate
// ---------------------------------------------------------------------------
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DB = join(ROOT, 'src/data/questions')
const OUT = join(ROOT, 'data/proposed')
const MAX = parseInt((process.argv.includes('--max') && process.argv[process.argv.indexOf('--max') + 1]) || '90', 10)

// ===== Music-theory primitives ============================================
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const NAT_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const SHARP = '♯', FLAT = '♭'

const accStr = (a) => (a > 0 ? SHARP.repeat(a) : a < 0 ? FLAT.repeat(-a) : '')
const noteName = (letter, acc) => letter + accStr(acc)
const pc = (letter, acc) => (((NAT_PC[letter] + acc) % 12) + 12) % 12

const ORD = { 1: 'unison', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th', 8: 'octave' }
const PERFECT = { 1: 0, 4: 5, 5: 7, 8: 12 }
const MAJOR = { 2: 2, 3: 4, 6: 9, 7: 11 }

// Name the ascending interval from a low note to a high note (within an octave).
function intervalName(lo, hi) {
  const li = LETTERS.indexOf(lo.letter)
  const hi_i = LETTERS.indexOf(hi.letter)
  const letterDist = ((hi_i - li) % 7 + 7) % 7
  const number = letterDist + 1
  const semis = ((pc(hi.letter, hi.acc) - pc(lo.letter, lo.acc)) % 12 + 12) % 12
  let quality
  if (number in PERFECT) {
    const d = semis - PERFECT[number]
    quality = { '-1': 'Diminished', '0': 'Perfect', '1': 'Augmented' }[String(d)]
  } else {
    const d = semis - MAJOR[number]
    quality = { '-2': 'Diminished', '-1': 'Minor', '0': 'Major', '1': 'Augmented' }[String(d)]
  }
  if (!quality) return null
  return `${quality} ${ORD[number]}`
}

// Given a low note + (letterDist, semitones), return the high note {letter,acc}.
function makeHigh(lo, letterDist, semis) {
  const li = LETTERS.indexOf(lo.letter)
  const letter = LETTERS[(li + letterDist) % 7]
  let d = (pc(lo.letter, lo.acc) + semis) - NAT_PC[letter]
  d = ((d % 12) + 12) % 12
  if (d > 6) d -= 12
  if (Math.abs(d) > 2) return null
  return { letter, acc: d }
}

// Major key table (sharps/flats + relative minor).
const MAJOR_KEYS = [
  { name: 'C', sharps: 0, flats: 0, rel: 'A' },
  { name: 'G', sharps: 1, flats: 0, rel: 'E' },
  { name: 'D', sharps: 2, flats: 0, rel: 'B' },
  { name: 'A', sharps: 3, flats: 0, rel: 'F♯' },
  { name: 'E', sharps: 4, flats: 0, rel: 'C♯' },
  { name: 'B', sharps: 5, flats: 0, rel: 'G♯' },
  { name: 'F♯', sharps: 6, flats: 0, rel: 'D♯' },
  { name: 'F', sharps: 0, flats: 1, rel: 'D' },
  { name: 'B♭', sharps: 0, flats: 2, rel: 'G' },
  { name: 'E♭', sharps: 0, flats: 3, rel: 'C' },
  { name: 'A♭', sharps: 0, flats: 4, rel: 'F' },
  { name: 'D♭', sharps: 0, flats: 5, rel: 'B♭' },
  { name: 'G♭', sharps: 0, flats: 6, rel: 'E♭' },
]
const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F']

function alteredSet(key) {
  const m = {}
  SHARP_ORDER.slice(0, key.sharps).forEach((l) => (m[l] = 1))
  FLAT_ORDER.slice(0, key.flats).forEach((l) => (m[l] = -1))
  return m
}
// Seven scale notes of a major key (degrees 1..7).
function majorScale(key) {
  const alt = alteredSet(key)
  const start = LETTERS.indexOf(key.name[0])
  return Array.from({ length: 7 }, (_, i) => {
    const l = LETTERS[(start + i) % 7]
    return { letter: l, acc: alt[l] || 0 }
  })
}
// Natural-minor scale of a key's relative minor (shares the signature).
function relMinorScale(key) {
  const alt = alteredSet(key)
  const start = LETTERS.indexOf(key.rel[0])
  return Array.from({ length: 7 }, (_, i) => {
    const l = LETTERS[(start + i) % 7]
    return { letter: l, acc: alt[l] || 0 }
  })
}
// Diatonic triad on `deg` (1-based) of a 7-note scale → "X Y Z".
function triad(scale, deg) {
  const i = deg - 1
  return [scale[i], scale[(i + 2) % 7], scale[(i + 4) % 7]].map((n) => noteName(n.letter, n.acc)).join(' ')
}
function triadNotes(scale, deg) {
  const i = deg - 1
  return [scale[i], scale[(i + 2) % 7], scale[(i + 4) % 7]]
}
// Stack a triad on the staff in a chosen inversion (0 root, 1 first, 2 second).
function chordAbcInv(notes, inv) {
  const base = LETTERS.indexOf(notes[0].letter)
  const idx = [base, base + 2, base + 4]
  const acc = notes.map((n) => n.acc)
  let order
  if (inv === 1) order = [[idx[1], acc[1]], [idx[2], acc[2]], [idx[0] + 7, acc[0]]]
  else if (inv === 2) order = [[idx[2], acc[2]], [idx[0] + 7, acc[0]], [idx[1] + 7, acc[1]]]
  else order = [[idx[0], acc[0]], [idx[1], acc[1]], [idx[2], acc[2]]]
  return `[${order.map(([ix, a]) => abcNote(ix, a)).join('')}]`
}

const DEGREE_NAME = ['tonic', 'supertonic', 'mediant', 'subdominant', 'dominant', 'submediant', 'leading note']
const ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

// ABC token for a note at absolute diatonic index (0 = middle C..6 = B; 7.. = c..b).
function abcNote(absIdx, acc) {
  const within = ((absIdx % 7) + 7) % 7
  const oct = Math.floor(absIdx / 7)
  let letter = LETTERS[within]
  if (oct >= 1) letter = letter.toLowerCase()
  const mark = oct >= 2 ? "'".repeat(oct - 1) : oct <= -1 ? ','.repeat(-oct) : ''
  // No '=' for naturals: every generated stave uses K:C, so a natural sign would
  // just be redundant clutter on a plain note.
  const a = acc > 0 ? '^'.repeat(acc) : acc < 0 ? '_'.repeat(-acc) : ''
  return a + letter + mark
}

// ===== Self-tests (abort on failure) ======================================
function expect(got, want, msg) {
  if (got !== want) throw new Error(`SELF-TEST FAILED: ${msg} — got "${got}", want "${want}"`)
}
expect(intervalName({ letter: 'C', acc: 0 }, { letter: 'E', acc: 0 }), 'Major 3rd', 'C–E')
expect(intervalName({ letter: 'C', acc: 0 }, { letter: 'G', acc: 0 }), 'Perfect 5th', 'C–G')
expect(intervalName({ letter: 'F', acc: 0 }, { letter: 'B', acc: 0 }), 'Augmented 4th', 'F–B')
expect(intervalName({ letter: 'B', acc: 0 }, { letter: 'F', acc: 0 }), 'Diminished 5th', 'B–F')
expect(intervalName({ letter: 'C', acc: 0 }, { letter: 'E', acc: -1 }), 'Minor 3rd', 'C–E♭')
expect(intervalName({ letter: 'C', acc: 0 }, { letter: 'B', acc: -1 }), 'Minor 7th', 'C–B♭')
expect(intervalName({ letter: 'C', acc: 0 }, { letter: 'D', acc: 1 }), 'Augmented 2nd', 'C–D♯')
expect(triad(majorScale(MAJOR_KEYS[0]), 5), 'G B D', 'V of C')
expect(triad(majorScale(MAJOR_KEYS.find((k) => k.name === 'D')), 5), 'A C♯ E', 'V of D')
expect(triad(relMinorScale(MAJOR_KEYS.find((k) => k.name === 'B♭')), 1), 'G B♭ D', 'i of Gm')
expect(noteName(majorScale(MAJOR_KEYS.find((k) => k.name === 'A'))[6].letter, majorScale(MAJOR_KEYS.find((k) => k.name === 'A'))[6].acc), 'G♯', 'A maj 7th')

// ===== Generation helpers =================================================
let SEED = 12345
const rng = () => ((SEED = (SEED * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
function sample(pool, n, exclude) {
  const ex = new Set(exclude)
  const avail = [...new Set(pool)].filter((x) => !ex.has(x))
  const out = []
  while (out.length < n && avail.length) out.push(avail.splice(Math.floor(rng() * avail.length), 1)[0])
  return out
}
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
// MC question: correct first, then distractors drawn from `pool`.
function mc(topic, difficulty, prompt, correct, pool, explanation, extra = {}) {
  const ds = sample(pool, 3, [correct])
  if (ds.length < 3) return null
  return { topic, difficulty, prompt, choices: [correct, ...ds], answer: 0, explanation, ...extra }
}
function tf(topic, difficulty, statement, isTrue, explanation) {
  return {
    topic,
    difficulty,
    prompt: statement + ' — true or false?',
    choices: isTrue ? ['True', 'False'] : ['False', 'True'],
    answer: 0,
    explanation,
  }
}
function fill(topic, difficulty, prompt, blanks, explanation) {
  return { topic, difficulty, type: 'fill', prompt, blanks, explanation }
}

const ALL_INTERVALS = [
  'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Augmented 4th',
  'Diminished 5th', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th',
]
const INTERVAL_SPECS = [
  [1, 1], [1, 2], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6], [4, 7], [5, 8], [5, 9], [6, 10], [6, 11],
]
const SEMIS = { 'Minor 2nd': 1, 'Major 2nd': 2, 'Minor 3rd': 3, 'Major 3rd': 4, 'Perfect 4th': 5, 'Augmented 4th': 6, 'Diminished 5th': 6, 'Perfect 5th': 7, 'Minor 6th': 8, 'Major 6th': 9, 'Minor 7th': 10, 'Major 7th': 11 }

// ===== Generators =========================================================
function genIntervals() {
  const out = []
  const lows = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'B♭', 'E♭', 'A♭', 'F♯', 'C♯', 'G♯', 'D♭'].map((n) => ({
    letter: n[0],
    acc: n.includes('♯') ? 1 : n.includes('♭') ? -1 : 0,
  }))
  // mc: name the interval
  for (const lo of lows) {
    for (const [ld, se] of INTERVAL_SPECS) {
      const hi = makeHigh(lo, ld, se)
      if (!hi) continue
      const name = intervalName(lo, hi)
      if (!name) continue
      const loN = noteName(lo.letter, lo.acc), hiN = noteName(hi.letter, hi.acc)
      const diff = name.includes('Augmented') || name.includes('Diminished') ? 3 : lo.acc || hi.acc ? 2 : 1
      out.push(mc('intervals', diff, `${loN} up to ${hiN} is a(n):`, name, ALL_INTERVALS,
        `${loN}–${hiN} spans ${ld + 1} letter names and ${se} semitones — a ${name.toLowerCase()}.`))
    }
  }
  // mc: name the interval BELOW a note (the syllabus tests above AND below)
  for (const lo of lows) {
    for (const [ld, se] of INTERVAL_SPECS) {
      const hi = makeHigh(lo, ld, se)
      if (!hi) continue
      const name = intervalName(lo, hi)
      if (!name) continue
      const loN = noteName(lo.letter, lo.acc), hiN = noteName(hi.letter, hi.acc)
      const diff = name.includes('Augmented') || name.includes('Diminished') ? 3 : 2
      out.push(mc('intervals', diff, `${hiN} down to ${loN} is a(n):`, name, ALL_INTERVALS,
        `Measured downwards, ${hiN}–${loN} is the same ${name.toLowerCase()} (${ld + 1} letter names, ${se} semitones).`))
    }
  }
  // notebuild: choose the accidental that forms the interval above a natural note
  const buildLows = ['C', 'D', 'E', 'F', 'G', 'A']
  for (const L of buildLows) {
    for (const [ld, se] of INTERVAL_SPECS) {
      const lo = { letter: L, acc: 0 }
      const hi = makeHigh(lo, ld, se)
      if (!hi) continue
      const name = intervalName(lo, hi)
      if (!name) continue
      const lowAbs = LETTERS.indexOf(L)
      const hiAbs = lowAbs + ld
      const variants = [hi.acc, ...[-2, -1, 0, 1, 2].filter((a) => a !== hi.acc)]
      const choices = variants.map((a) => noteName(LETTERS[hiAbs % 7], a))
      const choicesAbc = variants.map((a) => abcNote(hiAbs, a))
      out.push({
        topic: 'intervals',
        difficulty: name.includes('Augmented') || name.includes('Diminished') ? 3 : 2,
        prompt: `Choose the note a ${name.toLowerCase()} above the given note.`,
        abc: abcNote(lowAbs, 0),
        choices,
        choicesAbc,
        answer: 0,
        explanation: `A ${name.toLowerCase()} above ${noteName(L, 0)} is ${noteName(LETTERS[hiAbs % 7], hi.acc)} (${se} semitones, ${ld + 1} letter names).`,
      })
    }
  }
  // fill: semitones in an interval
  for (const name of ALL_INTERVALS) {
    out.push(fill('intervals', 2, `How many semitones are there in a ${name.toLowerCase()}?`,
      [{ answer: String(SEMIS[name]) }], `A ${name.toLowerCase()} contains ${SEMIS[name]} semitones.`))
  }
  // true/false inversions
  const inv = [['Major 3rd', 'Minor 6th'], ['Perfect 5th', 'Perfect 4th'], ['Minor 3rd', 'Major 6th'], ['Major 2nd', 'Minor 7th'], ['Augmented 4th', 'Diminished 5th']]
  for (const [a, b] of inv) {
    out.push(tf('intervals', 2, `A ${a.toLowerCase()} inverts to a ${b.toLowerCase()}`, true, `Inverting a ${a.toLowerCase()} gives a ${b.toLowerCase()} (the numbers add to 9 and the quality flips).`))
    out.push(tf('intervals', 2, `A ${a.toLowerCase()} inverts to a ${a.toLowerCase()}`, false, `A ${a.toLowerCase()} inverts to a ${b.toLowerCase()}, not to itself.`))
  }
  return out
}

function genKeys() {
  const out = []
  const noteNames = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭']
  const countWord = (k) => (k.sharps ? `${k.sharps} sharp${k.sharps > 1 ? 's' : ''}` : k.flats ? `${k.flats} flat${k.flats > 1 ? 's' : ''}` : 'none')
  const countPool = ['none', '1 sharp', '2 sharps', '3 sharps', '4 sharps', '5 sharps', '6 sharps', '1 flat', '2 flats', '3 flats', '4 flats', '5 flats', '6 flats']
  for (const k of MAJOR_KEYS) {
    const diff = (k.sharps || k.flats) >= 5 ? 3 : (k.sharps || k.flats) >= 3 ? 2 : 1
    out.push(mc('keys-and-scales', diff, `How many sharps or flats are in the key signature of ${k.name} major?`, countWord(k), countPool,
      `${k.name} major has ${countWord(k)}.`))
    out.push(mc('keys-and-scales', diff, `The relative minor of ${k.name} major is:`, `${k.rel} minor`, noteNames.map((n) => `${n} minor`),
      `The relative minor starts a minor 3rd below the tonic: ${k.rel} minor.`))
    out.push(fill('keys-and-scales', diff, `How many ${k.flats ? 'flats' : 'sharps'} are in the key signature of ${k.name} major?`,
      [{ answer: String(k.sharps || k.flats || 0) }], `${k.name} major has ${countWord(k)}.`))
    // degree notes
    const scale = majorScale(k)
    for (const deg of [5, 4, 7]) {
      out.push(mc('keys-and-scales', diff + 0, `The ${DEGREE_NAME[deg - 1]} of ${k.name} major is the note:`,
        noteName(scale[deg - 1].letter, scale[deg - 1].acc), noteNames,
        `The ${DEGREE_NAME[deg - 1]} is degree ${deg} of the scale: ${noteName(scale[deg - 1].letter, scale[deg - 1].acc)}.`))
    }
  }
  // enharmonic true/false + mc
  const enh = [['C♯', 'D♭'], ['F♯', 'G♭'], ['G♯', 'A♭'], ['A♯', 'B♭'], ['D♯', 'E♭'], ['E', 'F♭'], ['B', 'C♭']]
  for (const [a, b] of enh) {
    out.push(tf('keys-and-scales', 2, `${a} and ${b} are enharmonic equivalents (the same pitch)`, true, `${a} and ${b} are the same pitch written differently — enharmonic equivalents.`))
  }
  // degree technical names
  for (let d = 1; d <= 7; d++) {
    out.push(mc('keys-and-scales', 1, `What is the technical name for degree ${d} of a scale?`, DEGREE_NAME[d - 1], DEGREE_NAME,
      `Degree ${d} is the ${DEGREE_NAME[d - 1]}.`))
  }
  return out
}

function genChords() {
  const out = []
  for (const k of MAJOR_KEYS) {
    const scale = majorScale(k)
    const diff = (k.sharps || k.flats) >= 4 ? 3 : (k.sharps || k.flats) >= 1 ? 2 : 1
    const triadPool = MAJOR_KEYS.flatMap((kk) => [1, 4, 5].map((d) => triad(majorScale(kk), d)))
    for (const [deg, rom] of [[1, 'I'], [4, 'IV'], [5, 'V'], [2, 'ii']]) {
      out.push(mc('chords-and-cadences', diff, `In ${k.name} major, chord ${rom} is made of which notes?`,
        triad(scale, deg), triadPool, `Chord ${rom} is the triad on degree ${deg}: ${triad(scale, deg)}.`))
    }
    // dominant 7th
    const d7 = [scale[4], scale[6], scale[1], scale[3]].map((n) => noteName(n.letter, n.acc)).join(' ')
    out.push(mc('chords-and-cadences', diff + 0, `The dominant 7th chord in ${k.name} major contains:`, d7,
      MAJOR_KEYS.map((kk) => { const s = majorScale(kk); return [s[4], s[6], s[1], s[3]].map((n) => noteName(n.letter, n.acc)).join(' ') }),
      `Chord V plus a minor 7th above the root: ${d7}.`))
    // multi: name three diatonic chords by Roman numeral
    const degs = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3)
    out.push({
      topic: 'chords-and-cadences',
      difficulty: diff,
      type: 'multi',
      prompt: `Key of ${k.name} major — choose the Roman numeral for each chord.`,
      options: ROMAN,
      items: degs.map((d, idx) => ({ label: String.fromCharCode(65 + idx) + ': ' + triad(scale, d), answer: ROMAN[d - 1] })),
      explanation: `Build each triad from the ${k.name} major scale and match it to its degree.`,
    })
    // notation-based: name the chord shown by its Roman numeral
    const ndeg = shuffle([1, 4, 5, 2, 6])[0]
    out.push(mc('chords-and-cadences', diff, `In ${k.name} major, name this chord by its Roman numeral.`,
      ROMAN[ndeg - 1], ROMAN, `The triad shown is ${triad(scale, ndeg)} — chord ${ROMAN[ndeg - 1]} of ${k.name} major.`,
      { abc: chordAbcInv(triadNotes(scale, ndeg), 0) }))
    // notation-based: identify the inversion (shows the tonic triad in a random inversion)
    const inv = Math.floor(rng() * 3)
    const POS = ['Root position', 'First inversion', 'Second inversion']
    out.push(mc('chords-and-cadences', 2, `Which position (inversion) is this triad in? (${k.name} major)`,
      POS[inv], POS,
      'Look at the lowest note: root → root position (a), 3rd → first inversion (b), 5th → second inversion (c).',
      { abc: chordAbcInv(triadNotes(scale, 1), inv) }))
  }
  // cadence true/false + mc
  const cad = [['Perfect', 'V–I'], ['Plagal', 'IV–I'], ['Imperfect', 'ends on V'], ['Interrupted', 'V–vi']]
  for (const [name, prog] of cad) {
    out.push(mc('chords-and-cadences', 2, `Which cadence is ${prog}?`, name, cad.map((c) => c[0]), `${prog} is a ${name.toLowerCase()} cadence.`))
  }
  return out
}

// Term dictionary (standard musical vocabulary — facts, original phrasing).
const TERMS = [
  ['adagio', 'slow', 'It.'], ['allegro', 'quick, lively', 'It.'], ['allegretto', 'fairly quick', 'It.'],
  ['andante', 'at a walking pace', 'It.'], ['andantino', 'slightly faster than andante', 'It.'], ['moderato', 'at a moderate speed', 'It.'],
  ['largo', 'slow and broad', 'It.'], ['larghetto', 'rather slow', 'It.'], ['lento', 'slow', 'It.'], ['grave', 'very slow and solemn', 'It.'],
  ['presto', 'very fast', 'It.'], ['prestissimo', 'as fast as possible', 'It.'], ['vivace', 'lively and fast', 'It.'],
  ['accelerando', 'gradually getting faster', 'It.'], ['rallentando', 'gradually getting slower', 'It.'], ['ritenuto', 'held back at once', 'It.'],
  ['allargando', 'broadening, getting slower', 'It.'], ['rubato', 'with flexible time', 'It.'], ['a tempo', 'return to the original speed', 'It.'],
  ['meno mosso', 'less movement, slower', 'It.'], ['più mosso', 'more movement, faster', 'It.'],
  ['pianissimo', 'very soft', 'It.'], ['piano', 'soft', 'It.'], ['mezzo-piano', 'moderately soft', 'It.'],
  ['mezzo-forte', 'moderately loud', 'It.'], ['forte', 'loud', 'It.'], ['fortissimo', 'very loud', 'It.'],
  ['crescendo', 'getting gradually louder', 'It.'], ['diminuendo', 'getting gradually softer', 'It.'], ['sforzando', 'forced, strongly accented', 'It.'],
  ['calando', 'getting softer and slower', 'It.'], ['morendo', 'dying away', 'It.'], ['rinforzando', 'a sudden reinforcing accent', 'It.'],
  ['legato', 'smoothly', 'It.'], ['staccato', 'detached, short', 'It.'], ['staccatissimo', 'very detached', 'It.'], ['tenuto', 'held for full value', 'It.'],
  ['marcato', 'marked, emphatic', 'It.'], ['cantabile', 'in a singing style', 'It.'], ['dolce', 'sweetly', 'It.'], ['espressivo', 'expressively', 'It.'],
  ['grazioso', 'gracefully', 'It.'], ['leggiero', 'lightly', 'It.'], ['pesante', 'heavily', 'It.'], ['sostenuto', 'sustained', 'It.'],
  ['tranquillo', 'calmly', 'It.'], ['agitato', 'agitated', 'It.'], ['animato', 'animated, lively', 'It.'], ['maestoso', 'majestically', 'It.'],
  ['risoluto', 'bold, resolute', 'It.'], ['scherzando', 'playfully', 'It.'], ['semplice', 'simply', 'It.'], ['sotto voce', 'in an undertone', 'It.'],
  ['giocoso', 'merry, playful', 'It.'], ['affettuoso', 'tenderly', 'It.'], ['energico', 'energetically', 'It.'], ['deciso', 'decisively', 'It.'],
  ['assai', 'very', 'It.'], ['molto', 'very, much', 'It.'], ['poco', 'a little', 'It.'], ['poco a poco', 'little by little', 'It.'],
  ['più', 'more', 'It.'], ['meno', 'less', 'It.'], ['ma non troppo', 'but not too much', 'It.'], ['sempre', 'always', 'It.'],
  ['subito', 'suddenly', 'It.'], ['simile', 'in the same way', 'It.'], ['con', 'with', 'It.'], ['senza', 'without', 'It.'],
  ['quasi', 'almost, as if', 'It.'], ['fine', 'the end', 'It.'], ['da capo', 'from the beginning', 'It.'], ['dal segno', 'from the sign', 'It.'],
  ['coda', 'a closing section', 'It.'], ['attacca', 'go straight on', 'It.'], ['con brio', 'with vigour', 'It.'], ['con moto', 'with movement', 'It.'],
  ['arco', 'with the bow', 'It.'], ['pizzicato', 'plucked', 'It.'], ['con sordino', 'with the mute', 'It.'], ['senza sordino', 'without the mute', 'It.'],
  ['lent', 'slow', 'Fr.'], ['modéré', 'at a moderate speed', 'Fr.'], ['vif', 'lively', 'Fr.'], ['doux', 'sweet, soft', 'Fr.'],
  ['retenu', 'held back', 'Fr.'], ['cédez', 'slow down, yield', 'Fr.'], ['léger', 'light', 'Fr.'], ['animé', 'animated', 'Fr.'],
  ['langsam', 'slow', 'Ger.'], ['mässig', 'at a moderate speed', 'Ger.'], ['schnell', 'fast', 'Ger.'], ['lebhaft', 'lively', 'Ger.'],
  ['bewegt', 'with movement', 'Ger.'], ['ruhig', 'calm, peaceful', 'Ger.'], ['zart', 'tender', 'Ger.'], ['mit', 'with', 'Ger.'],
]
function genTerms() {
  const out = []
  const meanings = TERMS.map((t) => t[1])
  const freq = {}
  for (const m of meanings) freq[m] = (freq[m] || 0) + 1
  for (const [term, meaning, lang] of TERMS) {
    out.push(mc('terms-and-signs', meaning.length > 14 ? 2 : 1, `What does "${term}" mean?`, meaning, meanings.filter((m) => m !== meaning),
      `${term} (${lang}) = ${meaning}.`))
    // reverse only when the meaning is unique (avoids ambiguous answers)
    if (freq[meaning] === 1) {
      out.push(mc('terms-and-signs', 2, `Which term means "${meaning}"?`, term, TERMS.map((t) => t[0]), `${term} (${lang}) = ${meaning}.`))
    }
    // a false true/false pairing with a different meaning
    const other = meanings.find((m) => m !== meaning)
    out.push(tf('terms-and-signs', 1, `"${term}" means "${other}"`, false, `${term} (${lang}) means "${meaning}", not "${other}".`))
  }
  return out
}

const TIME = [
  ['2/4', 2, 4, 'simple duple', 'crotchet'], ['3/4', 3, 4, 'simple triple', 'crotchet'], ['4/4', 4, 4, 'simple quadruple', 'crotchet'],
  ['2/2', 2, 2, 'simple duple', 'minim'], ['3/2', 3, 2, 'simple triple', 'minim'], ['3/8', 3, 8, 'simple triple', 'quaver'],
  ['6/8', 6, 8, 'compound duple', 'dotted crotchet'], ['9/8', 9, 8, 'compound triple', 'dotted crotchet'], ['12/8', 12, 8, 'compound quadruple', 'dotted crotchet'],
  ['6/16', 6, 16, 'compound duple', 'dotted quaver'], ['9/16', 9, 16, 'compound triple', 'dotted quaver'], ['6/4', 6, 4, 'compound duple', 'dotted minim'],
  ['5/4', 5, 4, 'irregular', null], ['5/8', 5, 8, 'irregular', null], ['7/8', 7, 8, 'irregular', null], ['7/4', 7, 4, 'irregular', null],
]
function genTime() {
  const out = []
  const classes = ['simple duple', 'simple triple', 'simple quadruple', 'compound duple', 'compound triple', 'compound quadruple', 'irregular']
  const beats = ['crotchet', 'minim', 'quaver', 'dotted crotchet', 'dotted quaver', 'dotted minim']
  for (const [sig, top, bottom, cls, beat] of TIME) {
    const qpb = (top * 8) / bottom
    const diff = cls === 'irregular' ? 3 : top >= 9 ? 2 : 1
    out.push(mc('time-and-rhythm', diff, `${sig} time is best described as:`, cls === 'irregular' ? 'irregular time' : cls, classes.map((c) => (c === 'irregular' ? 'irregular time' : c)), cls === 'irregular' ? `${sig} cannot be grouped into even duple/triple/quadruple beats — it is irregular.` : `${sig} is ${cls} time.`))
    if (Number.isInteger(qpb)) out.push(fill('time-and-rhythm', diff, `A complete bar of ${sig} contains how many quavers?`, [{ answer: String(qpb) }], `${sig} = ${qpb} quavers per bar (top × 8 ÷ bottom).`))
    if (beat) out.push(mc('time-and-rhythm', diff, `In ${sig} time, the beat is a:`, beat, beats, `In ${sig} the beat is a ${beat}.`))
    out.push(tf('time-and-rhythm', diff, `${sig} is in compound time`, cls.startsWith('compound'), `${sig} is ${cls} time.`))
  }
  // note-value fills
  out.push(fill('time-and-rhythm', 2, 'How many semiquavers equal one crotchet?', [{ answer: '4' }], 'A crotchet = 4 semiquavers.'))
  out.push(fill('time-and-rhythm', 2, 'How many quavers equal one dotted crotchet?', [{ answer: '3' }], 'A dotted crotchet = 3 quavers.'))
  out.push(fill('time-and-rhythm', 3, 'A double-dotted crotchet equals how many semiquavers?', [{ answer: '7' }], 'Crotchet 4 + dot 2 + dot 1 = 7 semiquavers.'))
  out.push(fill('time-and-rhythm', 2, 'How many demisemiquavers equal one quaver?', [{ answer: '4' }], 'A quaver = 4 demisemiquavers.'))
  return out
}

const TRANSPOSING = [
  ['clarinet in B♭', 'a major 2nd', 'lower'], ['clarinet in A', 'a minor 3rd', 'lower'], ['trumpet in B♭', 'a major 2nd', 'lower'],
  ['horn in F', 'a perfect 5th', 'lower'], ['cor anglais', 'a perfect 5th', 'lower'], ['piccolo', 'an octave', 'higher'],
  ['double bass', 'an octave', 'lower'], ['guitar', 'an octave', 'lower'],
]
function genTransposition() {
  const out = []
  const pool = []
  for (const iv of ['a major 2nd', 'a minor 3rd', 'a perfect 5th', 'an octave', 'a major 3rd'])
    for (const dir of ['lower', 'higher']) pool.push(`${iv} ${dir} than written`)
  pool.push('at the same pitch as written')
  for (const [name, iv, dir] of TRANSPOSING) {
    const correct = `${iv} ${dir} than written`
    out.push(mc('transposition', name.includes('A') || name.includes('horn') ? 3 : 2, `The ${name} sounds:`, correct, pool, `The ${name} sounds ${iv} ${dir} than the written note.`))
    out.push(tf('transposition', 2, `The ${name} sounds ${iv} ${dir} than written`, true, `Correct — the ${name} sounds ${iv} ${dir}.`))
  }
  // key transposition up/down a major 2nd
  const upM2 = { C: 'D', G: 'A', F: 'G', 'B♭': 'C', 'E♭': 'F', D: 'E', A: 'B', 'A♭': 'B♭' }
  for (const [from, to] of Object.entries(upM2)) {
    out.push(mc('transposition', 2, `Transpose a melody in ${from} major UP a major 2nd. The new key is:`, `${to} major`, MAJOR_KEYS.map((k) => `${k.name} major`), `A major 2nd above ${from} is ${to}, so the new key is ${to} major.`))
  }
  return out
}

const CLEF_LINES = {
  treble: ['E', 'G', 'B', 'D', 'F'], bass: ['G', 'B', 'D', 'F', 'A'],
  alto: ['F', 'A', 'C', 'E', 'G'], tenor: ['D', 'F', 'A', 'C', 'E'],
}
const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th']
// Diatonic indices (middle C = 0) for each clef's 5 lines and 4 spaces.
const CLEF_POS = {
  treble: { lines: [2, 4, 6, 8, 10], spaces: [3, 5, 7, 9] },
  bass: { lines: [-10, -8, -6, -4, -2], spaces: [-9, -7, -5, -3] },
  alto: { lines: [-4, -2, 0, 2, 4], spaces: [-3, -1, 1, 3] },
  tenor: { lines: [-6, -4, -2, 0, 2], spaces: [-5, -3, -1, 1] },
}
function genClefs() {
  const out = []
  for (const [clef, lines] of Object.entries(CLEF_LINES)) {
    lines.forEach((note, i) => {
      out.push(mc('clefs', clef === 'treble' || clef === 'bass' ? 1 : 2,
        `On the ${clef} clef, the note on the ${ORDINALS[i]} line (counting up from the bottom) is:`, note, LETTERS,
        `${clef} clef lines spell ${lines.join(' ')} from the bottom, so the ${ORDINALS[i]} line is ${note}.`))
    })
  }
  // Notation: name the note shown on the staff — the Pitch module, all 4 clefs.
  for (const [clef, pos] of Object.entries(CLEF_POS)) {
    for (const abs of [...pos.lines, ...pos.spaces]) {
      const letter = LETTERS[((abs % 7) + 7) % 7]
      out.push(mc('clefs', clef === 'treble' ? 1 : clef === 'bass' ? 2 : 3,
        `Name this note (${clef} clef).`, letter, LETTERS,
        `Read from the ${clef} clef: this note is ${letter}.`,
        { abc: `K:C clef=${clef}\n${abcNote(abs, 0)}` }))
    }
  }
  return out
}

const INSTRUMENTS = [
  ['violin', 'Strings'], ['viola', 'Strings'], ['cello', 'Strings'], ['double bass', 'Strings'], ['harp', 'Strings'],
  ['flute', 'Woodwind'], ['oboe', 'Woodwind'], ['clarinet', 'Woodwind'], ['bassoon', 'Woodwind'], ['piccolo', 'Woodwind'], ['cor anglais', 'Woodwind'],
  ['horn', 'Brass'], ['trumpet', 'Brass'], ['trombone', 'Brass'], ['tuba', 'Brass'],
  ['timpani', 'Percussion'], ['snare drum', 'Percussion'], ['xylophone', 'Percussion'], ['cymbals', 'Percussion'],
]
function genInstruments() {
  const out = []
  const families = ['Strings', 'Woodwind', 'Brass', 'Percussion']
  for (const [inst, fam] of INSTRUMENTS) {
    out.push(mc('instruments-and-voices', 1, `To which family does the ${inst} belong?`, fam, families, `The ${inst} is a ${fam.toLowerCase()} instrument.`))
  }
  return out
}

// Interactive "build a note" interval questions (drag on the staff).
function genBuild() {
  const out = []
  for (const L of ['C', 'D', 'E', 'F', 'G', 'A']) {
    for (const [ld, se] of INTERVAL_SPECS) {
      const lo = { letter: L, acc: 0 }
      const hi = makeHigh(lo, ld, se)
      if (!hi) continue
      const name = intervalName(lo, hi)
      if (!name) continue
      const lowAbs = LETTERS.indexOf(L)
      const hiAbs = lowAbs + ld
      const answerName = noteName(hi.letter, hi.acc)
      out.push({
        topic: 'intervals',
        type: 'build',
        difficulty: name.includes('Augmented') || name.includes('Diminished') ? 3 : 2,
        prompt: `Drag the note up/down (and set the accidental) to form a ${name.toLowerCase()} above the given note.`,
        abc: abcNote(lowAbs, 0),
        startAbc: abcNote(lowAbs + 7, 0),
        answerAbc: abcNote(hiAbs, hi.acc),
        answerName,
        explanation: `A ${name.toLowerCase()} above ${noteName(L, 0)} is ${answerName}.`,
      })
    }
  }
  return out
}

// ===== Assemble, dedup, cap ===============================================
const GENERATORS = {
  intervals: genIntervals, 'keys-and-scales': genKeys, 'chords-and-cadences': genChords,
  'terms-and-signs': genTerms, 'time-and-rhythm': genTime, transposition: genTransposition,
  clefs: genClefs, 'instruments-and-voices': genInstruments, 'score-analysis': genScoreAnalysis,
}

// ----- Score analysis: original short phrases + sub-questions --------------
function genScoreAnalysis() {
  const out = []
  const keys = ['C', 'G', 'F', 'D', 'B♭', 'A', 'E♭', 'E']
  const PATTERNS = [
    [0, 2, 3, 4, 3, 2, 1, 0],
    [0, 3, 2, 4, 3, 2, 1, 0],
    [0, 4, 3, 2, 3, 2, 1, 0],
  ]
  const MARKS = [
    ['Andante', 'at a walking pace'], ['Allegro', 'quick, lively'], ['Adagio', 'slow'],
    ['Moderato', 'at a moderate speed'], ['Cantabile', 'in a singing style'], ['Dolce', 'sweetly'],
    ['Legato', 'smoothly'], ['Vivace', 'lively and fast'],
  ]
  keys.forEach((kn, ki) => {
    const k = MAJOR_KEYS.find((x) => x.name === kn)
    if (!k) return
    const scale = majorScale(k)
    const tonicAbs = LETTERS.indexOf(kn[0])
    const pat = PATTERNS[ki % PATTERNS.length]
    const [term, meaning] = MARKS[ki % MARKS.length]
    const t = pat.map((d) => abcNote(tonicAbs + d, 0)) // bare tokens — key signature supplies accidentals
    const abc = `K:${kn}\nM:4/4\nL:1/4\n"^${term}"${t[0]} ${t[1]} ${t[2]} ${t[3]} | ${t[4]} ${t[5]} ${t[6]} ${t[7]} |`
    const diff = (k.sharps || k.flats) >= 3 ? 3 : 2
    const sig = k.sharps ? `${k.sharps} sharp(s)` : k.flats ? `${k.flats} flat(s)` : 'no sharps or flats'
    out.push(mc('score-analysis', diff, 'This melody is in a major key. Which key is it in?', `${kn} major`,
      MAJOR_KEYS.map((x) => `${x.name} major`),
      `The key signature shows ${sig} and the melody centres on ${kn}, so it is ${kn} major.`, { abc }))
    const iv = intervalName(scale[0], scale[pat[1]])
    out.push(mc('score-analysis', diff, 'In this melody, name the interval between the 1st and 2nd notes.', iv,
      ALL_INTERVALS, `The first two notes form a ${iv.toLowerCase()}.`, { abc }))
    out.push(mc('score-analysis', diff > 1 ? diff - 1 : 1, 'What does the term marked above this melody mean?', meaning,
      MARKS.map((m) => m[1]).concat(['detached', 'getting louder', 'in unison']),
      `"${term}" means ${meaning}.`, { abc }))
  })
  return out
}

// ----- Cadence shown on the staff (V–I etc.) -------------------------------
function genCadenceNotation() {
  const out = []
  const CAD = [['Perfect', 5, 1], ['Plagal', 4, 1], ['Imperfect', 1, 5], ['Interrupted', 5, 6]]
  for (const k of MAJOR_KEYS) {
    const scale = majorScale(k)
    const diff = (k.sharps || k.flats) >= 4 ? 3 : 2
    for (const [name, d1, d2] of CAD) {
      const c1 = chordAbcInv(triadNotes(scale, d1), 0)
      const c2 = chordAbcInv(triadNotes(scale, d2), 0)
      out.push(mc('chords-and-cadences', diff, `Name the cadence shown (key of ${k.name} major).`, name,
        ['Perfect', 'Plagal', 'Imperfect', 'Interrupted'],
        `The chords are ${ROMAN[d1 - 1]}–${ROMAN[d2 - 1]} — a ${name.toLowerCase()} cadence.`,
        { abc: `${c1} ${c2}` }))
    }
  }
  return out
}

// ----- Chord with full label (Ib, Vc …) ------------------------------------
function genChordLabels() {
  const out = []
  const INVL = ['', 'b', 'c']
  const POS = ['root position', 'first inversion (b)', 'second inversion (c)']
  const pool = []
  for (const d of [1, 4, 5, 2]) for (const iv of [0, 1, 2]) pool.push(ROMAN[d - 1] + INVL[iv])
  for (const k of MAJOR_KEYS) {
    const scale = majorScale(k)
    const diff = (k.sharps || k.flats) >= 3 ? 3 : 2
    const deg = shuffle([1, 4, 5])[0]
    const inv = Math.floor(rng() * 3)
    out.push(mc('chords-and-cadences', diff,
      `Name this chord in full — Roman numeral and inversion (e.g. Vb). Key: ${k.name} major.`,
      ROMAN[deg - 1] + INVL[inv], pool,
      `It is chord ${ROMAN[deg - 1]} in ${POS[inv]} → ${ROMAN[deg - 1] + INVL[inv]}.`,
      { abc: chordAbcInv(triadNotes(scale, deg), inv) }))
  }
  return out
}

// ----- Compound intervals --------------------------------------------------
function genCompound() {
  const C = [
    ['Major 2nd', 'Major 9th'], ['Major 3rd', 'Major 10th'], ['Minor 3rd', 'Minor 10th'],
    ['Perfect 4th', 'Perfect 11th'], ['Perfect 5th', 'Perfect 12th'], ['Major 6th', 'Major 13th'],
  ]
  const pool = C.map((x) => x[1]).concat(['Minor 9th', 'Perfect 10th', 'Major 11th'])
  return C.map(([simple, comp]) =>
    mc('intervals', 2, `A ${simple.toLowerCase()} plus an octave is called a:`, comp, pool,
      `Add 7 to the number, keep the quality: a ${simple.toLowerCase()} + an octave = a ${comp.toLowerCase()}.`),
  )
}

// ----- Articulation / expression signs -------------------------------------
function genSigns() {
  const out = []
  const pool = ['detached (short)', 'accented (stressed)', 'paused — held longer than written',
    'held for its full value', 'play smoothly (legato)']
  const SIGNS = [
    ['!staccato!', 'detached (short)', 'a staccato dot'],
    ['!accent!', 'accented (stressed)', 'an accent'],
    ['!fermata!', 'paused — held longer than written', 'a pause (fermata)'],
    ['!tenuto!', 'held for its full value', 'a tenuto line'],
  ]
  for (const [deco, meaning, nameOf] of SIGNS) {
    out.push(mc('terms-and-signs', 1, 'What does the sign on this note mean?', meaning, pool,
      `This is ${nameOf} — it means "${meaning}".`, { abc: `K:C\n${deco}G2` }))
  }
  out.push(mc('terms-and-signs', 1, 'What does the curved line over these two (different) notes mean?',
    'play smoothly (legato)', pool, 'A slur over different pitches means play them smoothly (legato).',
    { abc: 'K:C\n(G2 A2)' }))
  return out
}

// ----- Rests & beaming -----------------------------------------------------
function genRests() {
  return [
    fill('time-and-rhythm', 1, 'A minim rest is worth how many crotchet beats?', [{ answer: '2' }], 'A minim rest lasts two crotchet beats.'),
    fill('time-and-rhythm', 2, 'How many crotchet rests equal a semibreve rest?', [{ answer: '4' }], 'A semibreve rest = four crotchet rests.'),
    fill('time-and-rhythm', 2, 'How many quaver rests equal a minim rest?', [{ answer: '4' }], 'A minim = four quavers, so four quaver rests.'),
    mc('time-and-rhythm', 1, 'Which rest hangs DOWN from the 4th line of the staff?', 'semibreve rest',
      ['semibreve rest', 'minim rest', 'crotchet rest', 'quaver rest'],
      'The semibreve rest hangs below the 4th line; the minim rest sits on the 3rd line.'),
    mc('time-and-rhythm', 2, 'When beaming in 4/4, you should NOT beam across:', 'the middle of the bar (beats 2–3)',
      ['the middle of the bar (beats 2–3)', 'beats 1–2', 'beats 3–4', 'any two quavers'],
      'Keep the half-bar visible — group beats 1–2 and 3–4 separately in 4/4.'),
  ]
}

// ----- Double-sharp leading notes (sharp minors) ---------------------------
function genDoubleSharp() {
  const DS = [['G♯ minor', 'F double sharp'], ['D♯ minor', 'C double sharp'], ['A♯ minor', 'G double sharp']]
  const pool = ['F double sharp', 'C double sharp', 'G double sharp', 'F♯', 'C♯', 'G♯']
  return DS.map(([key, ln]) =>
    mc('keys-and-scales', 3, `In the harmonic minor of ${key}, the raised 7th (leading note) is written as:`, ln, pool,
      `The 7th degree of ${key} is raised a semitone for the harmonic minor, giving ${ln}.`),
  )
}

// De-dup on prompt + notation, so notation questions that share a prompt but
// show a different stave (e.g. "Name this note." in many positions) are kept.
const keyOf = (q) => (q.prompt + '||' + (q.abc || '')).trim().toLowerCase()

// existing questions (avoid duplicating the hand-written / already-imported bank)
const existing = new Set()
for (const f of readdirSync(DB).filter((f) => f.endsWith('.json'))) {
  for (const q of JSON.parse(readFileSync(join(DB, f), 'utf8'))) existing.add(keyOf(q))
}

const all = []
const summary = {}
for (const [topic, gen] of Object.entries(GENERATORS)) {
  const seen = new Set()
  const items = gen()
    .filter(Boolean)
    .filter((q) => {
      const key = keyOf(q)
      if (existing.has(key) || seen.has(key)) return false
      seen.add(key)
      return true
    })
  const capped = shuffle(items).slice(0, MAX)
  summary[topic] = capped.length
  all.push(...capped)
}

// "Build a note" interval questions — capped separately so they always appear.
{
  const seen = new Set()
  const items = genBuild().filter((q) => {
    const k = keyOf(q)
    if (existing.has(k) || seen.has(k)) return false
    seen.add(k)
    return true
  })
  const capped = shuffle(items).slice(0, 36)
  summary['intervals (build)'] = capped.length
  all.push(...capped)
}

// Standalone gap-fillers — appended uncapped so they always appear.
for (const gen of [genCadenceNotation, genChordLabels, genCompound, genSigns, genRests, genDoubleSharp]) {
  const seen = new Set()
  for (const q of gen()) {
    const k = keyOf(q)
    if (existing.has(k) || seen.has(k)) continue
    seen.add(k)
    all.push(q)
    summary[`+ ${q.topic}`] = (summary[`+ ${q.topic}`] || 0) + 1
  }
}

mkdirSync(OUT, { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const outFile = join(OUT, `synth-${stamp}.json`)
writeFileSync(outFile, JSON.stringify(all, null, 2) + '\n')

console.log('Self-tests passed. Generated per topic:')
for (const [t, n] of Object.entries(summary)) console.log(`  ${t}: ${n}`)
console.log(`\n✓ ${all.length} questions → ${outFile.replace(ROOT + '/', '')}`)
console.log('\nSample:')
for (const q of all.slice(0, 4)) console.log(`  • [${q.type ?? 'mc'}] ${q.prompt}`)
console.log(`\nNext: npm run questions:import -- ${outFile.replace(ROOT + '/', '')}`)
