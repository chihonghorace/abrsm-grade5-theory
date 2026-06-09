#!/usr/bin/env node
// Independent music-theory auditor. Re-derives the correct answer for every
// question it understands and flags any mismatch, ambiguity, or bad notation.
// Deliberately re-implements the theory (does NOT import the generator) so it
// catches generator bugs too.  Run:  node scripts/audit.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const DB = join(dirname(fileURLToPath(import.meta.url)), '..', 'src/data/questions')
const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const NPC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const PERF = { 1: 0, 4: 5, 5: 7 }
const MAJ = { 2: 2, 3: 4, 6: 9, 7: 11 }
const ORD = { 1: 'unison', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th' }
const ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F']
const KEYS = {
  C: { s: 0, f: 0 }, G: { s: 1 }, D: { s: 2 }, A: { s: 3 }, E: { s: 4 }, B: { s: 5 },
  'F♯': { s: 6 }, 'C♯': { s: 7 }, F: { f: 1 }, 'B♭': { f: 2 }, 'E♭': { f: 3 },
  'A♭': { f: 4 }, 'D♭': { f: 5 }, 'G♭': { f: 6 }, 'C♭': { f: 7 },
}
const TIME = {
  '2/4': 'simple duple', '3/4': 'simple triple', '4/4': 'simple quadruple', '2/2': 'simple duple',
  '3/2': 'simple triple', '3/8': 'simple triple', '6/8': 'compound duple', '9/8': 'compound triple',
  '12/8': 'compound quadruple', '6/16': 'compound duple', '9/16': 'compound triple', '6/4': 'compound duple',
  '5/4': 'irregular', '5/8': 'irregular', '7/8': 'irregular', '7/4': 'irregular',
}
const REL = {
  C: 'A', G: 'E', D: 'B', A: 'F♯', E: 'C♯', B: 'G♯', 'F♯': 'D♯',
  F: 'D', 'B♭': 'G', 'E♭': 'C', 'A♭': 'F', 'D♭': 'B♭', 'G♭': 'E♭',
}

function parseNote(s) {
  s = (s || '').trim()
  const letter = s[0]?.toUpperCase()
  if (!(letter in NPC)) return null
  let acc = 0
  for (const ch of s.slice(1)) {
    if (ch === '♯') acc++
    else if (ch === '♭') acc--
    else if (ch === '𝄪') acc += 2
    else if (ch === '𝄫') acc -= 2
  }
  return { letter, acc }
}
function interval(lo, hi) {
  const letterDist = ((LET.indexOf(hi.letter) - LET.indexOf(lo.letter)) % 7 + 7) % 7
  const number = letterDist + 1
  const semis = (((NPC[hi.letter] + hi.acc) - (NPC[lo.letter] + lo.acc)) % 12 + 12) % 12
  let q
  if (number in PERF) q = { '-1': 'Diminished', '0': 'Perfect', '1': 'Augmented' }[String(semis - PERF[number])]
  else q = { '-2': 'Diminished', '-1': 'Minor', '0': 'Major', '1': 'Augmented' }[String(semis - MAJ[number])]
  return q ? `${q} ${ORD[number]}` : null
}
function parseAbc(t) {
  let acc = 0, i = 0
  while (i < t.length && (t[i] === '^' || t[i] === '_' || t[i] === '=')) {
    if (t[i] === '^') acc++
    else if (t[i] === '_') acc--
    i++
  }
  const ch = t[i]; i++
  const upper = ch.toUpperCase()
  let oct = ch === upper ? 0 : 1
  while (i < t.length) { if (t[i] === ',') oct--; else if (t[i] === "'") oct++; i++ }
  return { letter: upper, acc, abs: oct * 7 + LET.indexOf(upper) }
}
function pcOf(p) { return ((NPC[p.letter] + p.acc) % 12 + 12) % 12 }
function majorScale(name) {
  const k = KEYS[name]
  if (!k) return null
  const alt = {}
  if (k.s) SHARP_ORDER.slice(0, k.s).forEach((l) => (alt[l] = 1))
  if (k.f) FLAT_ORDER.slice(0, k.f).forEach((l) => (alt[l] = -1))
  const start = LET.indexOf(name[0])
  return Array.from({ length: 7 }, (_, i) => { const l = LET[(start + i) % 7]; return { letter: l, acc: alt[l] || 0 } })
}
function chordTokens(abc) {
  const m = (abc || '').match(/\[([^\]]+)\]/)
  if (!m) return null
  const inner = m[1]
  const toks = []
  let i = 0
  while (i < inner.length) {
    let s = ''
    while (i < inner.length && (inner[i] === '^' || inner[i] === '_' || inner[i] === '=')) s += inner[i++]
    if (i >= inner.length) break
    s += inner[i++]
    while (i < inner.length && (inner[i] === ',' || inner[i] === "'")) s += inner[i++]
    toks.push(s)
  }
  return toks
}

const flags = []
function flag(file, q, msg) { flags.push(`${file} ${q.id}: ${msg}\n      "${q.prompt}"`) }

let total = 0
const files = readdirSync(DB).filter((f) => f.endsWith('.json'))

// First pass: build a term → meaning map from "What does X mean?" questions.
const termMeaning = new Map()
for (const f of files) {
  for (const q of JSON.parse(readFileSync(join(DB, f), 'utf8'))) {
    const m = (q.prompt || '').match(/^What does "(.+)" mean\?$/)
    if (m && Array.isArray(q.choices)) termMeaning.set(m[1].toLowerCase(), q.choices[q.answer])
  }
}
// meaning → list of terms (for reverse-ambiguity detection)
const meaningTerms = new Map()
for (const [term, meaning] of termMeaning) {
  const key = (meaning || '').toLowerCase()
  if (!meaningTerms.has(key)) meaningTerms.set(key, [])
  meaningTerms.get(key).push(term)
}

for (const file of files) {
  const data = JSON.parse(readFileSync(join(DB, file), 'utf8'))
  for (const q of data) {
    total++
    const type = q.type ?? 'mc'
    const correct = Array.isArray(q.choices) ? q.choices[q.answer] : null

    // Generic: a distractor must not duplicate the correct answer's text.
    if (type === 'mc' && Array.isArray(q.choices)) {
      const dupe = q.choices.filter((c, i) => i !== q.answer && c === correct)
      if (dupe.length) flag(file, q, `correct answer "${correct}" also appears as a distractor`)
    }

    // Interval text: "X up to Y is a(n):"  /  "Name this interval (X up to Y)."
    let im = (q.prompt || '').match(/^([A-G][♯♭𝄪𝄫]*) up to ([A-G][♯♭𝄪𝄫]*) is a\(n\)?:$/)
    if (!im) im = (q.prompt || '').match(/\(([A-G][♯♭𝄪𝄫]*) up to ([A-G][♯♭𝄪𝄫]*)\)/)
    if (im && type === 'mc') {
      const lo = parseNote(im[1]), hi = parseNote(im[2])
      const truth = lo && hi ? interval(lo, hi) : null
      if (truth && truth !== correct) flag(file, q, `interval ${im[1]}→${im[2]} should be "${truth}", not "${correct}"`)
    }
    // Interval below: "X down to Y is a(n):"  (X higher, Y lower)
    const dm = (q.prompt || '').match(/^([A-G][♯♭𝄪𝄫]*) down to ([A-G][♯♭𝄪𝄫]*) is a\(n\)?:$/)
    if (dm && type === 'mc') {
      const hi = parseNote(dm[1]), lo = parseNote(dm[2])
      const truth = lo && hi ? interval(lo, hi) : null
      if (truth && truth !== correct) flag(file, q, `${dm[1]} down to ${dm[2]} should be "${truth}", not "${correct}"`)
    }

    // Build: target note must form the named interval above the given note.
    if (type === 'build') {
      const nm = (q.prompt || '').match(/form a (.+?) above/i)
      const lo = parseAbc(q.abc || 'C'), hi = parseAbc(q.answerAbc || 'C')
      const truth = interval({ letter: lo.letter, acc: lo.acc }, { letter: hi.letter, acc: hi.acc })
      if (nm && truth && truth.toLowerCase() !== nm[1].toLowerCase())
        flag(file, q, `build target ${q.answerAbc} is a "${truth}", but prompt asks for "${nm[1]}"`)
    }

    // Key signature counts: "...sharps or flats... of X major?"  &  fill variants
    const km = (q.prompt || '').match(/of ([A-G][♯♭]*) (?:major)\b/)
    if (km && /how many (sharps|flats)/i.test(q.prompt) && KEYS[km[1]]) {
      const k = KEYS[km[1]]
      const expectNum = (k.s || k.f || 0)
      if (type === 'fill') {
        if (String(q.blanks?.[0]?.answer).trim() !== String(expectNum)) flag(file, q, `${km[1]} major has ${expectNum}, answer says ${q.blanks?.[0]?.answer}`)
      } else if (type === 'mc') {
        const c = String(correct).trim()
        if (/^\d+$/.test(c)) {
          // bare-number form ("How many flats…" → "4")
          if (Number(c) !== expectNum) flag(file, q, `${km[1]} major has ${expectNum}, answer says ${c}`)
        } else {
          const want = k.s ? `${k.s} sharp${k.s > 1 ? 's' : ''}` : k.f ? `${k.f} flat${k.f > 1 ? 's' : ''}` : 'none'
          if (c !== want) flag(file, q, `${km[1]} major should be "${want}", not "${c}"`)
        }
      }
    }

    // Chord notation: "In X major, name this chord by its Roman numeral."
    const cm = (q.prompt || '').match(/^In ([A-G][♯♭]*) major, name this chord/)
    if (cm && q.abc) {
      const scale = majorScale(cm[1])
      const toks = chordTokens(q.abc)
      if (scale && toks) {
        const chordPCs = new Set(toks.map((t) => pcOf(parseAbc(t))))
        let found = null
        for (let d = 0; d < 7; d++) {
          const pcs = new Set([scale[d], scale[(d + 2) % 7], scale[(d + 4) % 7]].map(pcOf))
          if (pcs.size === chordPCs.size && [...pcs].every((x) => chordPCs.has(x))) { found = ROMAN[d]; break }
        }
        if (found && found !== correct) flag(file, q, `chord ${q.abc} in ${cm[1]} major is "${found}", not "${correct}"`)
      }
    }

    // Inversion notation: "Which inversion ... (X major)" — bass note decides.
    const vm = (q.prompt || '').match(/inversion.*\(([A-G][♯♭]*) major\)/)
    if (vm && q.abc) {
      const scale = majorScale(vm[1])
      const toks = chordTokens(q.abc)
      if (scale && toks && toks.length === 3) {
        const root = pcOf(scale[0]), third = pcOf(scale[2]), fifth = pcOf(scale[4])
        const bass = pcOf(parseAbc(toks[0]))
        const truth = bass === root ? 'Root position' : bass === third ? 'First inversion' : bass === fifth ? 'Second inversion' : null
        if (truth && truth !== correct) flag(file, q, `bass of ${q.abc} → "${truth}", not "${correct}"`)
      }
    }

    // Time signature classification + quavers-per-bar
    const tm = (q.prompt || '').match(/^(\d+\/\d+) (?:time )?is(?: best described as| an example of)?:$/)
    if (tm && type === 'mc' && TIME[tm[1]]) {
      const norm = (s) => String(s).trim().toLowerCase().replace(/\s+time$/, '')
      if (norm(correct) !== norm(TIME[tm[1]])) flag(file, q, `${tm[1]} is "${TIME[tm[1]]}", not "${correct}"`)
    }
    const qm = (q.prompt || '').match(/bar of (\d+)\/(\d+) contains how many quavers/i)
    if (qm && type === 'fill') {
      const qpb = (Number(qm[1]) * 8) / Number(qm[2])
      if (Number(q.blanks?.[0]?.answer) !== qpb) flag(file, q, `${qm[1]}/${qm[2]} has ${qpb} quavers, answer says ${q.blanks?.[0]?.answer}`)
    }
    // Relative minor
    const relm = (q.prompt || '').match(/relative minor of ([A-G][♯♭]*) major is/i)
    if (relm && type === 'mc' && REL[relm[1]]) {
      const want = `${REL[relm[1]]} minor`
      if (correct !== want) flag(file, q, `relative minor of ${relm[1]} major should be "${want}", not "${correct}"`)
    }

    // Reverse-term ambiguity: "Which term means 'M'?" with M shared by >1 term.
    const rm = (q.prompt || '').match(/^Which term means "(.+)"\?$/)
    if (rm) {
      const terms = meaningTerms.get(rm[1].toLowerCase()) || []
      if (terms.length > 1) flag(file, q, `ambiguous — "${rm[1]}" matches ${terms.length} terms: ${terms.join(', ')}`)
    }
  }
}

console.log(`Audited ${total} questions across ${files.length} files.\n`)
if (flags.length === 0) {
  console.log('✓ No correctness issues found by the independent checks.')
} else {
  console.log(`✖ ${flags.length} issue(s):\n`)
  for (const f of flags) console.log('  - ' + f)
}
