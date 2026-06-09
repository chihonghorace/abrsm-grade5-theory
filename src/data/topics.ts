import type { Topic } from '../types'

// ---------------------------------------------------------------------------
// Grade 5 study notes. Concise, exam-focused revision cards — not a textbook.
// Each note may carry an `abc` example that renders as a real stave.
// ---------------------------------------------------------------------------

export const TOPICS: Topic[] = [
  {
    id: 'keys-and-scales',
    title: 'Keys, Scales & Degrees',
    blurb: 'Key signatures up to 6 sharps/flats, major & minor scales, degree names.',
    icon: '🎼',
    notes: [
      {
        heading: 'Key signatures (up to 6 #/♭)',
        body:
          'Sharps appear in the order F C G D A E B. Flats are the reverse: B E A D G C F.\n' +
          '- Major sharp keys: the last sharp is the leading note, so the key is a semitone above it (e.g. last sharp A♯ → B major).\n' +
          '- Major flat keys: the second-to-last flat names the key (e.g. flats up to A♭ → A♭ major). Exception: 1 flat = F major.',
      },
      {
        heading: 'Relative & tonic minors',
        body:
          'A major key and its relative minor share a key signature. The relative minor starts on the 6th degree of the major — a minor 3rd below the tonic.\n' +
          '- C major ↔ A minor, G major ↔ E minor, F major ↔ D minor.\n' +
          'The tonic minor (e.g. C minor vs C major) starts on the same note but has a different key signature.',
      },
      {
        heading: 'Harmonic vs melodic minor',
        body:
          'Both are built from the natural minor (the relative-minor key signature), then altered:\n' +
          '- Harmonic minor: raise the 7th degree (up and down).\n' +
          '- Melodic minor: raise the 6th AND 7th going up; cancel both (back to the key signature) coming down.',
        abc: 'X:1\nL:1/4\nK:Am\nA B c d e ^f ^g a a g f e d c B A|',
      },
      {
        heading: 'Scale degree names',
        body:
          '1 Tonic · 2 Supertonic · 3 Mediant · 4 Subdominant · 5 Dominant · 6 Submediant · 7 Leading note.\n' +
          'Know these by name — many Grade 5 chord questions refer to "the dominant" or "the submediant" rather than to a letter.',
      },
      {
        heading: 'Chromatic & diatonic semitones',
        body:
          '- Diatonic semitone: two different letter names (e.g. C → D♭).\n' +
          '- Chromatic semitone: the same letter name (e.g. C → C♯).\n' +
          'A chromatic scale is usually written with sharps going up and flats coming down.',
      },
    ],
  },
  {
    id: 'intervals',
    title: 'Intervals',
    blurb: 'Number + quality for every simple interval, plus compound intervals and inversions.',
    icon: '📏',
    notes: [
      {
        heading: 'Number then quality',
        body:
          'First count the letter names inclusively for the NUMBER (C up to G = C-D-E-F-G = a 5th). Then decide the QUALITY by counting semitones.\n' +
          '- Perfect intervals: unison, 4th, 5th, octave.\n' +
          '- Major/minor intervals: 2nd, 3rd, 6th, 7th.',
      },
      {
        heading: 'Quality from a major scale',
        body:
          'Compare the top note to the major scale of the bottom note:\n' +
          '- In the major scale → the 2/3/6/7 are MAJOR; the 4/5/8 are PERFECT.\n' +
          '- One semitone smaller than major = minor; smaller than perfect/minor = diminished.\n' +
          '- One semitone larger than major/perfect = augmented.',
        abc: '[CE] [CG] [CB]',
      },
      {
        heading: 'Augmented 4th = tritone',
        body:
          'F up to B spans four letter names (a 4th) and six semitones — an augmented 4th, also called the tritone. Its inversion B–F is a diminished 5th.',
        abc: '[FB]',
      },
      {
        heading: 'Inverting intervals',
        body:
          'Move the lower note up an octave. The numbers add up to 9 and the quality flips:\n' +
          '- major ↔ minor, augmented ↔ diminished, perfect ↔ perfect.\n' +
          'So a major 3rd inverts to a minor 6th; a perfect 5th inverts to a perfect 4th.',
      },
      {
        heading: 'Compound intervals',
        body:
          'Anything larger than an octave is compound. An octave + a 3rd = a 10th. To name the quality, take the simple interval inside it (a major 10th has the quality of a major 3rd).',
      },
    ],
  },
  {
    id: 'chords-and-cadences',
    title: 'Chords & Cadences',
    blurb: 'Triads & inversions, chords I/IV/V, the dominant 7th, and the four cadences.',
    icon: '🎹',
    notes: [
      {
        heading: 'Triads & inversions',
        body:
          'A triad = root + 3rd + 5th. Which note is in the BASS names the inversion:\n' +
          '- Root position: root in the bass (a).\n' +
          '- First inversion (b): the 3rd in the bass.\n' +
          '- Second inversion (c): the 5th in the bass.',
        abc: '[CEG] [EGc] [Gce]',
      },
      {
        heading: 'Primary triads I, IV, V',
        body:
          'Built on the tonic, subdominant and dominant. In C major:\n' +
          '- I = C E G, IV = F A C, V = G B D.\n' +
          'Roman numerals are key-relative, so the same numerals work in every key.',
      },
      {
        heading: 'The dominant 7th',
        body:
          'Chord V with an added minor 7th above the root — a four-note chord. In C major: G B D F. It strongly pulls toward the tonic and is common at perfect cadences.',
        abc: '[GBdf]',
      },
      {
        heading: 'The four cadences',
        body:
          'A cadence is the pair of chords at the end of a phrase:\n' +
          '- Perfect: V → I (sounds finished).\n' +
          '- Plagal: IV → I (the "Amen" cadence).\n' +
          '- Imperfect: ends ON chord V (sounds unfinished).\n' +
          '- Interrupted: V → vi (the surprise).',
      },
    ],
  },
  {
    id: 'time-and-rhythm',
    title: 'Time, Rhythm & Grouping',
    blurb: 'Simple vs compound time, the breve, triplets/duplets, and correct beaming.',
    icon: '⏱️',
    notes: [
      {
        heading: 'Simple vs compound time',
        body:
          '- Simple time: each beat divides into TWO. Top number 2, 3 or 4 (e.g. 3/4).\n' +
          '- Compound time: each beat divides into THREE; the beat is a dotted note. Top number 6, 9 or 12 (e.g. 6/8 = compound duple, beat = dotted crotchet).',
      },
      {
        heading: 'Naming a time signature',
        body:
          'Two words: how many beats (duple/triple/quadruple) + simple/compound.\n' +
          '- 2/4 simple duple · 3/4 simple triple · 4/4 simple quadruple.\n' +
          '- 6/8 compound duple · 9/8 compound triple · 12/8 compound quadruple.',
      },
      {
        heading: 'Note values & the breve',
        body:
          'breve (2 semibreves) → semibreve → minim → crotchet → quaver → semiquaver. Each step halves the value. A dot adds half the note’s value again.',
      },
      {
        heading: 'Triplets & duplets',
        body:
          '- A triplet plays 3 notes in the time of 2 of the same kind (used to borrow compound feel into simple time).\n' +
          '- A duplet plays 2 in the time of 3 (used in compound time).',
        abc: 'X:1\nL:1/8\nM:2/4\nK:C\n(3CCC (3DDD|',
      },
      {
        heading: 'Grouping / beaming',
        body:
          'Beam notes to show the beat. In simple time group per beat; in compound time group per dotted-note beat. Never beam across the middle of a 4/4 bar — show beats 1–2 and 3–4 separately so the half-bar is visible.',
      },
    ],
  },
  {
    id: 'clefs',
    title: 'The Four Clefs',
    blurb: 'Treble, bass, alto and tenor C-clefs — reading and rewriting middle C.',
    icon: '🔑',
    notes: [
      {
        heading: 'Treble & bass',
        body:
          'Treble (G clef) curls around the G above middle C. Bass (F clef) dots sit around the F below middle C. Middle C is one ledger line below the treble staff and one ledger line above the bass staff.',
      },
      {
        heading: 'Alto clef (viola)',
        body:
          'A C-clef centred on the MIDDLE line — so the middle line is middle C. Used by the viola. Lines bottom-up: F A C E G.',
        abc: 'X:1\nL:1/4\nK:C clef=alto\nC|',
      },
      {
        heading: 'Tenor clef',
        body:
          'A C-clef centred on the SECOND line from the top — that line is middle C. Used for the high registers of cello, bassoon and trombone. Lines bottom-up: D F A C E.',
        abc: 'X:1\nL:1/4\nK:C clef=tenor\nC|',
      },
      {
        heading: 'Rewriting between clefs',
        body:
          'When you rewrite a melody into another clef at the SAME pitch, each note keeps its sound but moves to a new line/space. Find middle C in both clefs and count up or down from there.',
      },
    ],
  },
  {
    id: 'transposition',
    title: 'Transposition',
    blurb: 'Transposing at the octave and by interval, including transposing instruments.',
    icon: '🔄',
    notes: [
      {
        heading: 'At the octave',
        body:
          'Moving a melody up or down an octave keeps every letter name; you usually change clef (or add 8va) to avoid ledger lines. Accidentals and key signature stay the same.',
      },
      {
        heading: 'By interval',
        body:
          'Work out the interval, move EVERY note by the same interval (number and quality), then choose the new key signature. Check each accidental: it must keep the same quality relative to the new key.',
      },
      {
        heading: 'Transposing instruments',
        body:
          'A transposing instrument sounds a different pitch from the written note.\n' +
          '- Clarinet in B♭ sounds a major 2nd LOWER than written → to get the written part, transpose the concert (sounding) pitch UP a major 2nd.\n' +
          '- Horn in F sounds a perfect 5th lower than written.',
      },
    ],
  },
  {
    id: 'ornaments',
    title: 'Ornaments',
    blurb: 'Trill, turn, mordents, appoggiatura and acciaccatura — signs and meanings.',
    icon: '✨',
    notes: [
      {
        heading: 'Trill (tr)',
        body:
          'A rapid alternation between the written note and the note above it. Written as "tr" (often with a wavy line).',
      },
      {
        heading: 'Turn & mordents',
        body:
          '- Turn (∿): the note above, the note itself, the note below, then back to the note.\n' +
          '- Upper mordent: note → note above → note (a single quick flip up).\n' +
          '- Lower mordent: note → note below → note (a vertical line through the sign).',
      },
      {
        heading: 'Appoggiatura vs acciaccatura',
        body:
          '- Appoggiatura: a "leaning" grace note that takes time FROM the main note (usually half its value).\n' +
          '- Acciaccatura: a "crushed" grace note with a stroke through its tail — played as quickly as possible before the beat note.',
      },
    ],
  },
  {
    id: 'terms-and-signs',
    title: 'Terms & Signs',
    blurb: 'Italian, French & German terms for tempo, dynamics and expression.',
    icon: '🇮🇹',
    notes: [
      {
        heading: 'Tempo (Italian)',
        body:
          '- adagio = slow · andante = at a walking pace · moderato = moderate · allegro = quick, lively · presto = very fast.\n' +
          '- accelerando (accel.) = getting faster · ritardando / rallentando (rit. / rall.) = getting slower · a tempo = back in time · rubato = with flexible time.',
      },
      {
        heading: 'Dynamics & accents',
        body:
          '- p piano (soft), f forte (loud), mp/mf = moderately soft/loud, pp/ff = very soft/loud.\n' +
          '- crescendo (cresc.) = getting louder · diminuendo / decrescendo (dim.) = getting softer.\n' +
          '- sforzando (sf, sfz) = a sudden strong accent on one note.',
      },
      {
        heading: 'Common modifiers',
        body:
          'poco = a little · molto = very · assai = very · meno = less · più = more · sempre = always · con = with · senza = without · ma non troppo = but not too much.',
      },
      {
        heading: 'French & German',
        body:
          '- French: lent = slow · vif = lively · doux = sweet/soft · modéré = moderate · en dehors = prominent · retenu = held back.\n' +
          '- German: langsam = slow · schnell = fast · mässig = moderate · lebhaft = lively · bewegt = with movement · ruhig = calm.',
      },
    ],
  },
  {
    id: 'instruments-and-voices',
    title: 'Instruments & Voices',
    blurb: 'Orchestral families, transposing instruments, voices and playing terms.',
    icon: '🎻',
    notes: [
      {
        heading: 'The four families',
        body:
          '- Strings: violin, viola, cello, double bass (+ harp).\n' +
          '- Woodwind: flute, oboe, clarinet, bassoon (+ piccolo, cor anglais).\n' +
          '- Brass: horn, trumpet, trombone, tuba.\n' +
          '- Percussion: timpani, snare/bass drum, cymbals, xylophone, etc.',
      },
      {
        heading: 'String playing terms',
        body:
          '- arco = with the bow · pizzicato (pizz.) = plucked · con sordino = with mute · senza sordino = remove mute.\n' +
          '- double stopping = two strings sounded together · tremolo = fast repetition.',
      },
      {
        heading: 'Voices',
        body:
          'From highest to lowest: soprano, alto (contralto), tenor, bass. SATB is the standard four-part choir. Soprano & alto are usually female voices; tenor & bass usually male.',
      },
      {
        heading: 'Transposing instruments (recap)',
        body:
          'Clarinet in B♭ and trumpet in B♭ sound a major 2nd lower than written; horn in F sounds a perfect 5th lower; the piccolo sounds an octave higher and the double bass an octave lower than written.',
      },
    ],
  },
]

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t])) as Record<
  Topic['id'],
  Topic
>
