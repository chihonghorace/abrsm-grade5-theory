import type { Question } from '../types'

// ---------------------------------------------------------------------------
// ABRSM Grade 5 question bank.
//
// Single-answer multiple choice. `answer` is the index of the correct choice.
// Some questions carry `abc` notation that renders as a real stave.
// Add new questions freely — the UI picks them up by `topic` automatically.
// ---------------------------------------------------------------------------

export const QUESTIONS: Question[] = [
  // ----- Keys, Scales & Degrees -------------------------------------------
  {
    id: 'ks-1', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'A major key signature of four sharps belongs to which key?',
    choices: ['E major', 'A major', 'D major', 'B major'], answer: 0,
    explanation: 'Four sharps are F♯ C♯ G♯ D♯. The last sharp (D♯) is the leading note, so the key is a semitone above it: E major.',
  },
  {
    id: 'ks-2', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'What is the relative minor of A major?',
    choices: ['F♯ minor', 'D minor', 'A minor', 'C♯ minor'], answer: 0,
    explanation: 'The relative minor starts on the 6th degree of the major scale — a minor 3rd below the tonic. A minor 3rd below A is F♯, so F♯ minor.',
  },
  {
    id: 'ks-3', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'In a harmonic minor scale, which degree is raised compared with the key signature?',
    choices: ['7th', '6th', '2nd', '5th'], answer: 0,
    explanation: 'The harmonic minor raises only the 7th degree (both ascending and descending).',
  },
  {
    id: 'ks-4', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'How many flats are in the key signature of A♭ major?',
    choices: ['4', '3', '5', '2'], answer: 0,
    explanation: 'A♭ major has B♭ E♭ A♭ D♭ — four flats. (The second-to-last flat, A♭, names the key.)',
  },
  {
    id: 'ks-5', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'A major key’s relative minor begins on which note, relative to the tonic?',
    choices: ['A minor 3rd below', 'A major 2nd below', 'A perfect 4th below', 'A minor 3rd above'], answer: 0,
    explanation: 'The relative minor is a minor 3rd below the major tonic (the 6th degree of the major scale).',
  },
  {
    id: 'ks-6', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'The note a chromatic semitone above C is:',
    choices: ['C♯', 'D♭', 'B', 'D'], answer: 0,
    explanation: 'A chromatic semitone keeps the same letter name, so C → C♯ (C → D♭ would be a diatonic semitone).',
  },
  {
    id: 'ks-7', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'C up to D♭ is an example of a:',
    choices: ['diatonic semitone', 'chromatic semitone', 'whole tone', 'unison'], answer: 0,
    explanation: 'Two different letter names a semitone apart (C and D♭) form a diatonic semitone.',
  },
  {
    id: 'ks-8', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'The 6th degree of a major or minor scale is called the:',
    choices: ['submediant', 'mediant', 'subdominant', 'supertonic'], answer: 0,
    explanation: 'Degrees: 1 tonic, 2 supertonic, 3 mediant, 4 subdominant, 5 dominant, 6 submediant, 7 leading note.',
  },
  {
    id: 'ks-9', topic: 'keys-and-scales', difficulty: 3,
    prompt: 'Which major key has six sharps?',
    choices: ['F♯ major', 'B major', 'D♭ major', 'C♯ major'], answer: 0,
    explanation: 'F♯ major has F♯ C♯ G♯ D♯ A♯ E♯ — six sharps. (C♯ major has all seven.)',
  },
  {
    id: 'ks-10', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'Ascending, the melodic minor scale raises which degrees?',
    choices: ['6th and 7th', '7th only', '6th only', '2nd and 7th'], answer: 0,
    explanation: 'Melodic minor raises the 6th and 7th going up, then cancels both (back to the key signature) coming down.',
  },
  {
    id: 'ks-11', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'Which major key has just one flat?',
    choices: ['F major', 'B♭ major', 'D major', 'G major'], answer: 0,
    explanation: 'F major has one flat (B♭). B♭ major has two flats; G major has one sharp.',
  },
  {
    id: 'ks-12', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'The 5th degree of the scale is called the:',
    choices: ['dominant', 'mediant', 'leading note', 'subdominant'], answer: 0,
    explanation: 'The 5th degree is the dominant — the second most important note after the tonic.',
  },
  {
    id: 'ks-13', topic: 'keys-and-scales', difficulty: 3,
    prompt: 'The enharmonic equivalent of G♭ major is:',
    choices: ['F♯ major', 'E♯ major', 'A♭ major', 'F major'], answer: 0,
    explanation: 'G♭ and F♯ are the same pitch, so G♭ major (6 flats) sounds identical to F♯ major (6 sharps).',
  },

  // ----- Intervals ---------------------------------------------------------
  {
    id: 'iv-1', topic: 'intervals', difficulty: 1,
    prompt: 'Name this harmonic interval (lower note C).', abc: '[CE]',
    choices: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Major 2nd'], answer: 0,
    explanation: 'C–E spans three letter names (a 3rd) and four semitones, making it a major 3rd.',
  },
  {
    id: 'iv-2', topic: 'intervals', difficulty: 1,
    prompt: 'C up to G is a:',
    choices: ['Perfect 5th', 'Perfect 4th', 'Major 6th', 'Augmented 5th'], answer: 0,
    explanation: 'C–G is five letter names and seven semitones — a perfect 5th.',
  },
  {
    id: 'iv-3', topic: 'intervals', difficulty: 2,
    prompt: 'C up to A is a:',
    choices: ['Major 6th', 'Minor 6th', 'Major 7th', 'Perfect 5th'], answer: 0,
    explanation: 'A is the 6th note of the C major scale, so C–A is a major 6th.',
  },
  {
    id: 'iv-4', topic: 'intervals', difficulty: 2,
    prompt: 'C up to B♭ is a:',
    choices: ['Minor 7th', 'Major 7th', 'Major 6th', 'Diminished 7th'], answer: 0,
    explanation: 'C–B would be a major 7th; lowering the top note a semitone to B♭ makes it a minor 7th.',
  },
  {
    id: 'iv-5', topic: 'intervals', difficulty: 3,
    prompt: 'Name this interval (F up to B).', abc: '[FB]',
    choices: ['Augmented 4th', 'Perfect 4th', 'Diminished 5th', 'Perfect 5th'], answer: 0,
    explanation: 'F–B is four letter names (a 4th) but six semitones — one more than a perfect 4th — so it is an augmented 4th (the tritone).',
  },
  {
    id: 'iv-6', topic: 'intervals', difficulty: 2,
    prompt: 'A major 3rd, when inverted, becomes a:',
    choices: ['Minor 6th', 'Major 6th', 'Minor 3rd', 'Perfect 5th'], answer: 0,
    explanation: 'On inversion the numbers add to 9 (3 → 6) and the quality flips (major → minor): a minor 6th.',
  },
  {
    id: 'iv-7', topic: 'intervals', difficulty: 2,
    prompt: 'A perfect 5th, when inverted, becomes a:',
    choices: ['Perfect 4th', 'Perfect 5th', 'Major 4th', 'Augmented 4th'], answer: 0,
    explanation: '5 + 4 = 9, and perfect stays perfect, so a perfect 5th inverts to a perfect 4th.',
  },
  {
    id: 'iv-8', topic: 'intervals', difficulty: 2,
    prompt: 'An octave plus a third is correctly named a:',
    choices: ['10th', '11th', '9th', 'compound 5th'], answer: 0,
    explanation: 'Compound intervals keep counting past the octave: octave (8) + a 3rd = a 10th.',
  },
  {
    id: 'iv-9', topic: 'intervals', difficulty: 1,
    prompt: 'C up to E♭ is a:',
    choices: ['Minor 3rd', 'Major 3rd', 'Augmented 2nd', 'Diminished 3rd'], answer: 0,
    explanation: 'C–E is a major 3rd; lowering the top note to E♭ makes it a minor 3rd (three semitones).',
  },
  {
    id: 'iv-10', topic: 'intervals', difficulty: 1,
    prompt: 'Another name for the augmented 4th / diminished 5th is the:',
    choices: ['tritone', 'semitone', 'whole tone', 'comma'], answer: 0,
    explanation: 'Both span three whole tones, hence the name tritone.',
  },
  {
    id: 'iv-11', topic: 'intervals', difficulty: 3,
    prompt: 'C up to F♯ is a:',
    choices: ['Augmented 4th', 'Perfect 4th', 'Diminished 5th', 'Major 3rd'], answer: 0,
    explanation: 'C–F is a perfect 4th; raising the top note to F♯ adds a semitone, giving an augmented 4th.',
  },
  {
    id: 'iv-12', topic: 'intervals', difficulty: 1,
    prompt: 'D up to the D an octave higher is a:',
    choices: ['Perfect octave', 'Perfect unison', 'Major 7th', 'Compound 2nd'], answer: 0,
    explanation: 'The same letter name eight notes apart is a perfect octave.',
  },

  // ----- Chords & Cadences -------------------------------------------------
  {
    id: 'cc-1', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'Chord V in C major is built from which notes?',
    choices: ['G B D', 'C E G', 'F A C', 'G B♭ D'], answer: 0,
    explanation: 'Chord V is the triad on the dominant (G): G–B–D.',
  },
  {
    id: 'cc-2', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'A perfect cadence is formed by the chords:',
    choices: ['V – I', 'IV – I', 'I – V', 'V – vi'], answer: 0,
    explanation: 'A perfect (authentic) cadence moves from the dominant to the tonic, V → I, and sounds finished.',
  },
  {
    id: 'cc-3', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'A plagal cadence is:',
    choices: ['IV – I', 'V – I', 'ii – V', 'V – vi'], answer: 0,
    explanation: 'The plagal ("Amen") cadence is subdominant to tonic, IV → I.',
  },
  {
    id: 'cc-4', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'A cadence that ends on chord V is called:',
    choices: ['imperfect', 'perfect', 'plagal', 'interrupted'], answer: 0,
    explanation: 'An imperfect cadence finishes on chord V (often I–V or IV–V) and sounds unfinished.',
  },
  {
    id: 'cc-5', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'An interrupted cadence usually moves:',
    choices: ['V – vi', 'V – I', 'IV – I', 'I – IV'], answer: 0,
    explanation: 'The interrupted cadence sets up V → I but surprises us by going to vi instead.',
  },
  {
    id: 'cc-6', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'The dominant 7th in C major contains the notes:',
    choices: ['G B D F', 'G B D', 'C E G B♭', 'G B♭ D F'], answer: 0,
    explanation: 'Take chord V (G B D) and add a minor 7th above the root (F): G–B–D–F.',
  },
  {
    id: 'cc-7', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'Which position of the C major triad is shown (C in the bass)?', abc: '[CEG]',
    choices: ['Root position', 'First inversion', 'Second inversion', 'Dominant 7th'], answer: 0,
    explanation: 'The root (C) is the lowest note, so the triad is in root position.',
  },
  {
    id: 'cc-8', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'The C major triad with E in the bass is in:', abc: '[EGc]',
    choices: ['First inversion', 'Root position', 'Second inversion', 'An incomplete chord'], answer: 0,
    explanation: 'When the 3rd (E) is in the bass, the triad is in first inversion (labelled "b").',
  },
  {
    id: 'cc-9', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'The triad built on the subdominant of G major is:',
    choices: ['C E G', 'G B D', 'D F♯ A', 'C E♭ G'], answer: 0,
    explanation: 'The subdominant (4th degree) of G major is C, so the triad is C–E–G.',
  },
  {
    id: 'cc-10', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'Roman numeral IV represents the triad on which degree?',
    choices: ['Subdominant', 'Dominant', 'Supertonic', 'Submediant'], answer: 0,
    explanation: 'IV is built on the 4th degree, the subdominant.',
  },
  {
    id: 'cc-11', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'In a first-inversion triad, which note is in the bass?',
    choices: ['The 3rd', 'The root', 'The 5th', 'The 7th'], answer: 0,
    explanation: 'First inversion puts the 3rd of the chord in the bass.',
  },
  {
    id: 'cc-12', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'The "Amen" cadence sung at the end of hymns is which cadence?',
    choices: ['Plagal', 'Perfect', 'Imperfect', 'Interrupted'], answer: 0,
    explanation: 'The plagal cadence (IV–I) is traditionally sung to "A-men".',
  },

  // ----- Time, Rhythm & Grouping ------------------------------------------
  {
    id: 'tr-1', topic: 'time-and-rhythm', difficulty: 1,
    prompt: '6/8 is an example of:',
    choices: ['compound duple time', 'simple duple time', 'compound triple time', 'simple triple time'], answer: 0,
    explanation: '6/8 has two dotted-crotchet beats, each dividing into three — compound duple.',
  },
  {
    id: 'tr-2', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'In 6/8 time, one beat is normally a:',
    choices: ['dotted crotchet', 'crotchet', 'quaver', 'dotted minim'], answer: 0,
    explanation: 'In compound time the beat is a dotted note; in 6/8 that is a dotted crotchet (three quavers).',
  },
  {
    id: 'tr-3', topic: 'time-and-rhythm', difficulty: 1,
    prompt: '3/4 is:',
    choices: ['simple triple time', 'compound triple time', 'simple duple time', 'compound duple time'], answer: 0,
    explanation: 'Three crotchet beats, each dividing into two — simple triple.',
  },
  {
    id: 'tr-4', topic: 'time-and-rhythm', difficulty: 2,
    prompt: '9/8 is:',
    choices: ['compound triple time', 'simple triple time', 'compound duple time', 'compound quadruple time'], answer: 0,
    explanation: '9/8 has three dotted-crotchet beats — compound triple.',
  },
  {
    id: 'tr-5', topic: 'time-and-rhythm', difficulty: 2,
    prompt: 'A breve is equal to:',
    choices: ['two semibreves', 'half a semibreve', 'two minims', 'four semibreves'], answer: 0,
    explanation: 'A breve is the longest common note value: two semibreves (eight crotchets).',
  },
  {
    id: 'tr-6', topic: 'time-and-rhythm', difficulty: 2,
    prompt: 'A triplet of crotchets is played in the time of:',
    choices: ['two crotchets', 'three crotchets', 'four crotchets', 'two minims'], answer: 0,
    explanation: 'A triplet squeezes three notes into the time normally taken by two of the same value.',
  },
  {
    id: 'tr-7', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'Which top number indicates compound time?',
    choices: ['6', '2', '3', '4'], answer: 0,
    explanation: 'Top numbers 6, 9 and 12 indicate compound time (the beat divides into three).',
  },
  {
    id: 'tr-8', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'A dot placed after a note adds:',
    choices: ['half its value', 'a quarter of its value', 'its own value again', 'one beat'], answer: 0,
    explanation: 'A dot lengthens a note by half of its original value.',
  },
  {
    id: 'tr-9', topic: 'time-and-rhythm', difficulty: 2,
    prompt: '12/8 is named:',
    choices: ['compound quadruple', 'simple quadruple', 'compound triple', 'compound duple'], answer: 0,
    explanation: '12/8 has four dotted-crotchet beats — compound quadruple.',
  },
  {
    id: 'tr-10', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'In simple time, each beat divides into:',
    choices: ['two', 'three', 'four', 'six'], answer: 0,
    explanation: 'Simple time = the beat divides into two; compound time = into three.',
  },
  {
    id: 'tr-11', topic: 'time-and-rhythm', difficulty: 2,
    prompt: 'Cut time (2/2, ¢) is:',
    choices: ['simple duple', 'compound duple', 'simple quadruple', 'simple triple'], answer: 0,
    explanation: '2/2 has two minim beats, each dividing into two — simple duple.',
  },

  // ----- The Four Clefs ----------------------------------------------------
  {
    id: 'cl-1', topic: 'clefs', difficulty: 1,
    prompt: 'On the alto clef, middle C sits on the:',
    choices: ['middle line', 'bottom line', 'top line', 'second space'], answer: 0,
    explanation: 'The alto C-clef is centred on the middle line, so the middle line is middle C.',
  },
  {
    id: 'cl-2', topic: 'clefs', difficulty: 1,
    prompt: 'Which instrument normally reads the alto clef?',
    choices: ['Viola', 'Cello', 'Flute', 'Trumpet'], answer: 0,
    explanation: 'The viola is the standard alto-clef instrument.',
  },
  {
    id: 'cl-3', topic: 'clefs', difficulty: 2,
    prompt: 'The tenor clef places middle C on the:',
    choices: ['second line from the top', 'middle line', 'bottom line', 'top line'], answer: 0,
    explanation: 'The tenor C-clef sits on the second line from the top, marking middle C.',
  },
  {
    id: 'cl-4', topic: 'clefs', difficulty: 1,
    prompt: 'Middle C in the treble clef is written:',
    choices: ['one ledger line below the staff', 'one ledger line above the staff', 'on the bottom line', 'in the bottom space'], answer: 0,
    explanation: 'Middle C sits on the first ledger line below the treble staff.',
  },
  {
    id: 'cl-5', topic: 'clefs', difficulty: 2,
    prompt: 'The alto and tenor clefs are both types of:',
    choices: ['C clef', 'G clef', 'F clef', 'percussion clef'], answer: 0,
    explanation: 'Both are C-clefs; their centre marks the position of middle C.',
  },
  {
    id: 'cl-6', topic: 'clefs', difficulty: 1,
    prompt: 'Middle C in the bass clef is:',
    choices: ['one ledger line above the staff', 'one ledger line below the staff', 'on the top line', 'on the middle line'], answer: 0,
    explanation: 'Middle C sits on the first ledger line above the bass staff.',
  },

  // ----- Transposition -----------------------------------------------------
  {
    id: 'tp-1', topic: 'transposition', difficulty: 2,
    prompt: 'A clarinet in B♭ sounds how far from the written note?',
    choices: ['a major 2nd lower', 'a major 2nd higher', 'a perfect 5th lower', 'the same'], answer: 0,
    explanation: 'A B♭ clarinet sounds a major 2nd lower than written, so its written part is a major 2nd higher than concert pitch.',
  },
  {
    id: 'tp-2', topic: 'transposition', difficulty: 1,
    prompt: 'To transpose music up an octave you usually:',
    choices: ['change clef or add 8va', 'change the key signature', 'add accidentals', 'do nothing'], answer: 0,
    explanation: 'Octave transposition keeps every letter name and the key signature; you change clef or add 8va to avoid ledger lines.',
  },
  {
    id: 'tp-3', topic: 'transposition', difficulty: 2,
    prompt: 'When transposing a melody by interval, the key signature:',
    choices: ['usually changes to the new key', 'always stays the same', 'is removed', 'doubles'], answer: 0,
    explanation: 'Transposing by an interval moves into a new key, so you write the new key’s signature.',
  },
  {
    id: 'tp-4', topic: 'transposition', difficulty: 3,
    prompt: 'A horn in F sounds:',
    choices: ['a perfect 5th lower than written', 'a perfect 5th higher', 'a major 2nd lower', 'an octave lower'], answer: 0,
    explanation: 'A horn in F sounds a perfect 5th below the written pitch.',
  },
  {
    id: 'tp-5', topic: 'transposition', difficulty: 2,
    prompt: 'Transposing a C major melody up a major 2nd puts it in:',
    choices: ['D major', 'B♭ major', 'E major', 'C major'], answer: 0,
    explanation: 'A major 2nd above C is D, so the new key is D major.',
  },
  {
    id: 'tp-6', topic: 'transposition', difficulty: 1,
    prompt: 'The double bass sounds:',
    choices: ['an octave lower than written', 'an octave higher', 'a 5th lower', 'as written'], answer: 0,
    explanation: 'Double bass parts sound an octave lower than written to avoid excessive ledger lines.',
  },

  // ----- Ornaments ---------------------------------------------------------
  {
    id: 'or-1', topic: 'ornaments', difficulty: 2,
    prompt: 'A grace note with a stroke through its tail, played as quickly as possible, is an:',
    choices: ['acciaccatura', 'appoggiatura', 'trill', 'mordent'], answer: 0,
    explanation: 'The acciaccatura ("crushed" note) has a stroke through it and is played as fast as possible before the main note.',
  },
  {
    id: 'or-2', topic: 'ornaments', difficulty: 1,
    prompt: 'The sign "tr" indicates a:',
    choices: ['trill', 'turn', 'mordent', 'slur'], answer: 0,
    explanation: '"tr" marks a trill — a rapid alternation between the written note and the note above.',
  },
  {
    id: 'or-3', topic: 'ornaments', difficulty: 2,
    prompt: 'An upper mordent plays:',
    choices: ['note, note above, note', 'note, note below, note', 'note above, note, note below', 'two notes above'], answer: 0,
    explanation: 'An upper mordent is a quick flip up: the written note, the note above, then back to the written note.',
  },
  {
    id: 'or-4', topic: 'ornaments', difficulty: 2,
    prompt: 'An appoggiatura usually takes its time:',
    choices: ['from the main note', 'from nowhere — it is instant', 'from the previous note', 'a whole bar'], answer: 0,
    explanation: 'The appoggiatura "leans" on the beat and borrows time (often half the value) from the main note.',
  },
  {
    id: 'or-5', topic: 'ornaments', difficulty: 3,
    prompt: 'A turn (∿) plays the notes:',
    choices: ['above, written, below, written', 'below, written, above', 'written, above, written', 'above, below, written'], answer: 0,
    explanation: 'A standard turn goes: the note above, the written note, the note below, then back to the written note.',
  },
  {
    id: 'or-6', topic: 'ornaments', difficulty: 2,
    prompt: 'A lower mordent is shown by the mordent sign with:',
    choices: ['a vertical line through it', 'no line', 'a dot above', 'a sharp'], answer: 0,
    explanation: 'A short vertical line through the mordent sign turns the upper mordent into a lower mordent.',
  },

  // ----- Terms & Signs -----------------------------------------------------
  {
    id: 'ts-1', topic: 'terms-and-signs', difficulty: 1,
    prompt: 'What does "allegro" mean?',
    choices: ['quick and lively', 'slow', 'very fast', 'moderate'], answer: 0,
    explanation: 'Allegro = quick and lively (faster than moderato, slower than presto).',
  },
  {
    id: 'ts-2', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"Ritardando" (rit.) means:',
    choices: ['gradually getting slower', 'gradually getting faster', 'getting louder', 'in strict time'], answer: 0,
    explanation: 'Ritardando (like rallentando) means gradually slowing down.',
  },
  {
    id: 'ts-3', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"Dolce" means:',
    choices: ['sweetly', 'loudly', 'detached', 'held'], answer: 0,
    explanation: 'Dolce = sweetly.',
  },
  {
    id: 'ts-4', topic: 'terms-and-signs', difficulty: 2,
    prompt: '"sf" (sforzando) means:',
    choices: ['a sudden strong accent', 'very soft', 'gradually louder', 'smoothly'], answer: 0,
    explanation: 'Sforzando (sf, sfz) = a sudden, forced accent on a single note or chord.',
  },
  {
    id: 'ts-5', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"Cantabile" means:',
    choices: ['in a singing style', 'quickly', 'detached', 'very loud'], answer: 0,
    explanation: 'Cantabile = in a singing style.',
  },
  {
    id: 'ts-6', topic: 'terms-and-signs', difficulty: 2,
    prompt: 'The German word "langsam" means:',
    choices: ['slow', 'fast', 'loud', 'lively'], answer: 0,
    explanation: 'Langsam (German) = slow.',
  },
  {
    id: 'ts-7', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"poco" means:',
    choices: ['a little', 'very', 'less', 'always'], answer: 0,
    explanation: 'Poco = a little (e.g. poco rit. = slow down a little).',
  },
  {
    id: 'ts-8', topic: 'terms-and-signs', difficulty: 2,
    prompt: 'The French word "doux" means:',
    choices: ['sweet / soft', 'slow', 'fast', 'loud'], answer: 0,
    explanation: 'Doux (French) = sweet or soft.',
  },
  {
    id: 'ts-9', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"a tempo" means:',
    choices: ['return to the original speed', 'gradually slower', 'at a walking pace', 'very fast'], answer: 0,
    explanation: 'A tempo = go back to the original speed (often after a rit. or rubato).',
  },
  {
    id: 'ts-10', topic: 'terms-and-signs', difficulty: 2,
    prompt: '"rubato" indicates:',
    choices: ['flexible, expressive timing', 'strict timing', 'very loud', 'staccato'], answer: 0,
    explanation: 'Tempo rubato = a flexible, expressive give-and-take with the time.',
  },
  {
    id: 'ts-11', topic: 'terms-and-signs', difficulty: 2,
    prompt: '"ma non troppo" means:',
    choices: ['but not too much', 'always', 'with feeling', 'very fast'], answer: 0,
    explanation: 'Ma non troppo = but not too much (e.g. allegro ma non troppo).',
  },
  {
    id: 'ts-12', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"diminuendo" (dim.) means:',
    choices: ['getting gradually softer', 'getting gradually louder', 'getting faster', 'detached'], answer: 0,
    explanation: 'Diminuendo (decrescendo) = getting gradually softer.',
  },

  // ----- Instruments & Voices ---------------------------------------------
  {
    id: 'in-1', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'To which family does the oboe belong?',
    choices: ['Woodwind', 'Brass', 'Strings', 'Percussion'], answer: 0,
    explanation: 'The oboe is a double-reed woodwind instrument.',
  },
  {
    id: 'in-2', topic: 'instruments-and-voices', difficulty: 1,
    prompt: '"pizzicato" tells a string player to:',
    choices: ['pluck the strings', 'use the bow', 'mute the strings', 'play loudly'], answer: 0,
    explanation: 'Pizzicato (pizz.) = pluck the strings with the finger.',
  },
  {
    id: 'in-3', topic: 'instruments-and-voices', difficulty: 1,
    prompt: '"arco" means:',
    choices: ['with the bow', 'plucked', 'with mute', 'very fast'], answer: 0,
    explanation: 'Arco = play with the bow (cancels a previous pizzicato).',
  },
  {
    id: 'in-4', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'From highest to lowest, the four standard voices are:',
    choices: ['soprano, alto, tenor, bass', 'bass, tenor, alto, soprano', 'soprano, tenor, alto, bass', 'alto, soprano, bass, tenor'], answer: 0,
    explanation: 'SATB, highest to lowest: soprano, alto, tenor, bass.',
  },
  {
    id: 'in-5', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'The timpani belong to which family?',
    choices: ['Percussion', 'Brass', 'Strings', 'Woodwind'], answer: 0,
    explanation: 'Timpani (kettledrums) are tuned percussion instruments.',
  },
  {
    id: 'in-6', topic: 'instruments-and-voices', difficulty: 2,
    prompt: '"con sordino" asks a player to use a:',
    choices: ['mute', 'bow', 'plectrum', 'faster tempo'], answer: 0,
    explanation: 'Con sordino = with the mute; senza sordino = without (remove the mute).',
  },
  {
    id: 'in-7', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'Which of these is a brass instrument?',
    choices: ['Trombone', 'Clarinet', 'Cello', 'Oboe'], answer: 0,
    explanation: 'The trombone is brass; clarinet and oboe are woodwind; the cello is a string instrument.',
  },
  {
    id: 'in-8', topic: 'instruments-and-voices', difficulty: 2,
    prompt: 'The cor anglais belongs to which family?',
    choices: ['Woodwind', 'Brass', 'Strings', 'Percussion'], answer: 0,
    explanation: 'The cor anglais (English horn) is a larger, lower double-reed woodwind relative of the oboe.',
  },

  // ===========================================================================
  // Expansion pack — original questions aligned to the Grade 5 (2020+) syllabus.
  // Written from the public syllabus & exam format, not copied from ABRSM papers.
  // ===========================================================================

  // ----- Keys, Scales & Degrees (more) ------------------------------------
  {
    id: 'ks-14', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'The technical name for the 7th degree of a major scale is the:',
    choices: ['leading note', 'subdominant', 'submediant', 'mediant'], answer: 0,
    explanation: 'The 7th degree is the leading note — it "leads" up to the tonic.',
  },
  {
    id: 'ks-15', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'How many sharps does B major have?',
    choices: ['5', '4', '6', '3'], answer: 0,
    explanation: 'B major: F♯ C♯ G♯ D♯ A♯ — five sharps.',
  },
  {
    id: 'ks-16', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'The relative minor of E♭ major is:',
    choices: ['C minor', 'G minor', 'E♭ minor', 'A minor'], answer: 0,
    explanation: 'A minor 3rd below E♭ is C, so the relative minor is C minor (same three flats).',
  },
  {
    id: 'ks-17', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'Which major key has three flats?',
    choices: ['E♭ major', 'A♭ major', 'B♭ major', 'F major'], answer: 0,
    explanation: 'E♭ major has B♭ E♭ A♭ — three flats. (C minor shares these but is a minor key.)',
  },
  {
    id: 'ks-18', topic: 'keys-and-scales', difficulty: 3,
    prompt: 'C♯ major is enharmonically equivalent to:',
    choices: ['D♭ major', 'B major', 'C major', 'D major'], answer: 0,
    explanation: 'C♯ (7 sharps) and D♭ (5 flats) are the same pitch, so the keys sound identical.',
  },
  {
    id: 'ks-19', topic: 'keys-and-scales', difficulty: 3,
    prompt: 'In G♯ harmonic minor, the raised 7th degree is written as:',
    choices: ['F double sharp', 'F♯', 'G natural', 'F natural'], answer: 0,
    explanation: 'The 7th degree of G♯ minor is F♯; raising it a semitone for the harmonic minor gives F double sharp (F𝄪).',
  },
  {
    id: 'ks-20', topic: 'keys-and-scales', difficulty: 1,
    prompt: 'The chromatic scale is made up entirely of:',
    choices: ['semitones', 'tones', 'tones and semitones', 'major 2nds'], answer: 0,
    explanation: 'A chromatic scale moves by semitone throughout, using every note.',
  },
  {
    id: 'ks-21', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'The submediant of A major is the note:',
    choices: ['F♯', 'D', 'E', 'C♯'], answer: 0,
    explanation: 'The submediant is the 6th degree; the 6th note of A major is F♯.',
  },
  {
    id: 'ks-22', topic: 'keys-and-scales', difficulty: 2,
    prompt: 'Which minor key has just one sharp in its key signature?',
    choices: ['E minor', 'B minor', 'D minor', 'A minor'], answer: 0,
    explanation: 'E minor is the relative minor of G major, which has one sharp (F♯).',
  },
  {
    id: 'ks-23', topic: 'keys-and-scales', difficulty: 3,
    prompt: 'Which major key has six flats?',
    choices: ['G♭ major', 'C♭ major', 'D♭ major', 'F major'], answer: 0,
    explanation: 'G♭ major has B♭ E♭ A♭ D♭ G♭ C♭ — six flats. (It is the enharmonic of F♯ major.)',
  },

  // ----- Intervals (more) -------------------------------------------------
  {
    id: 'iv-13', topic: 'intervals', difficulty: 1,
    prompt: 'E up to G is a:',
    choices: ['Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Major 2nd'], answer: 0,
    explanation: 'E–G is three letter names and three semitones — a minor 3rd.',
  },
  {
    id: 'iv-14', topic: 'intervals', difficulty: 1,
    prompt: 'F up to A is a:',
    choices: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Augmented 3rd'], answer: 0,
    explanation: 'F–A is three letter names and four semitones — a major 3rd.',
  },
  {
    id: 'iv-15', topic: 'intervals', difficulty: 2,
    prompt: 'G up to F is a:',
    choices: ['Minor 7th', 'Major 7th', 'Major 6th', 'Perfect 5th'], answer: 0,
    explanation: 'G–F spans seven letter names and ten semitones — a minor 7th.',
  },
  {
    id: 'iv-16', topic: 'intervals', difficulty: 2,
    prompt: 'D up to B is a:',
    choices: ['Major 6th', 'Minor 6th', 'Major 7th', 'Perfect 5th'], answer: 0,
    explanation: 'B is the 6th note of the D major scale, so D–B is a major 6th.',
  },
  {
    id: 'iv-17', topic: 'intervals', difficulty: 3,
    prompt: 'B up to F is a:',
    choices: ['Diminished 5th', 'Perfect 5th', 'Augmented 4th', 'Minor 6th'], answer: 0,
    explanation: 'B–F is five letter names but only six semitones (a perfect 5th is seven), so it is a diminished 5th.',
  },
  {
    id: 'iv-18', topic: 'intervals', difficulty: 2,
    prompt: 'An octave plus a 2nd is correctly called a:',
    choices: ['9th', '10th', '7th', 'compound 3rd'], answer: 0,
    explanation: 'Counting past the octave: 8 + a 2nd = a 9th.',
  },
  {
    id: 'iv-19', topic: 'intervals', difficulty: 2,
    prompt: 'An octave plus a 5th is correctly called a:',
    choices: ['12th', '13th', '11th', '10th'], answer: 0,
    explanation: 'An octave (8) plus a 5th = a 12th.',
  },
  {
    id: 'iv-20', topic: 'intervals', difficulty: 2,
    prompt: 'A minor 6th, when inverted, becomes a:',
    choices: ['Major 3rd', 'Minor 3rd', 'Major 6th', 'Perfect 4th'], answer: 0,
    explanation: '6 + 3 = 9 and minor flips to major, so a minor 6th inverts to a major 3rd.',
  },
  {
    id: 'iv-21', topic: 'intervals', difficulty: 3,
    prompt: 'A diminished 5th, when inverted, becomes a(n):',
    choices: ['Augmented 4th', 'Perfect 4th', 'Diminished 4th', 'Major 5th'], answer: 0,
    explanation: '5 + 4 = 9 and diminished flips to augmented, so a diminished 5th inverts to an augmented 4th.',
  },
  {
    id: 'iv-22', topic: 'intervals', difficulty: 1,
    prompt: 'Name this interval (G up to D).', abc: '[Gd]',
    choices: ['Perfect 5th', 'Perfect 4th', 'Major 6th', 'Diminished 5th'], answer: 0,
    explanation: 'G–D is five letter names and seven semitones — a perfect 5th.',
  },
  {
    id: 'iv-23', topic: 'intervals', difficulty: 2,
    prompt: 'Name this interval (D up to F).', abc: '[DF]',
    choices: ['Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Diminished 3rd'], answer: 0,
    explanation: 'D–F is three letter names and three semitones — a minor 3rd.',
  },
  {
    id: 'iv-24', topic: 'intervals', difficulty: 3,
    prompt: 'C up to D♯ is a(n):',
    choices: ['Augmented 2nd', 'Minor 3rd', 'Major 2nd', 'Diminished 3rd'], answer: 0,
    explanation: 'C–D is a 2nd; raising D to D♯ stretches it to three semitones, giving an augmented 2nd (it sounds like a minor 3rd but is spelled as a 2nd).',
  },

  // ----- Chords & Cadences (more) -----------------------------------------
  {
    id: 'cc-13', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'The supertonic triad (chord ii) in C major is:',
    choices: ['D F A', 'C E G', 'G B D', 'D F♯ A'], answer: 0,
    explanation: 'Chord ii is built on the 2nd degree (D): D–F–A, a minor triad. Chord ii is new at Grade 5.',
  },
  {
    id: 'cc-14', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'Chord ii is built on which degree of the scale?',
    choices: ['Supertonic', 'Subdominant', 'Submediant', 'Mediant'], answer: 0,
    explanation: 'ii is the triad on the 2nd degree, the supertonic.',
  },
  {
    id: 'cc-15', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'In C major, chord IV is built from:',
    choices: ['F A C', 'G B D', 'C E G', 'D F A'], answer: 0,
    explanation: 'Chord IV is the triad on the subdominant (F): F–A–C.',
  },
  {
    id: 'cc-16', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'The tonic triad of G minor is:',
    choices: ['G B♭ D', 'G B D', 'G B♭ D♯', 'D F♯ A'], answer: 0,
    explanation: 'A minor tonic triad has a minor 3rd: G–B♭–D.',
  },
  {
    id: 'cc-17', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'In D major, chord V is:',
    choices: ['A C♯ E', 'D F♯ A', 'G B D', 'A C E'], answer: 0,
    explanation: 'The dominant of D is A; its triad is A–C♯–E.',
  },
  {
    id: 'cc-18', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'A second-inversion triad has which note in the bass?',
    choices: ['The 5th', 'The 3rd', 'The root', 'The 7th'], answer: 0,
    explanation: 'Second inversion (labelled "c") puts the 5th of the chord in the bass.',
  },
  {
    id: 'cc-19', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'In ABRSM labelling, a root-position chord is marked:',
    choices: ['a', 'b', 'c', 'd'], answer: 0,
    explanation: 'Root position = a, first inversion = b, second inversion = c.',
  },
  {
    id: 'cc-20', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'A first-inversion chord is labelled:',
    choices: ['b', 'a', 'c', 'i'], answer: 0,
    explanation: 'First inversion (3rd in the bass) is labelled "b" — e.g. Vb.',
  },
  {
    id: 'cc-21', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'A phrase ending I–V makes which cadence?',
    choices: ['Imperfect', 'Perfect', 'Plagal', 'Interrupted'], answer: 0,
    explanation: 'Any progression finishing on chord V is an imperfect cadence — it sounds unfinished.',
  },
  {
    id: 'cc-22', topic: 'chords-and-cadences', difficulty: 2,
    prompt: 'Which position is this C major triad in (G in the bass)?', abc: '[Gce]',
    choices: ['Second inversion', 'First inversion', 'Root position', 'Dominant 7th'], answer: 0,
    explanation: 'With the 5th (G) in the bass, the triad is in second inversion ("c").',
  },
  {
    id: 'cc-23', topic: 'chords-and-cadences', difficulty: 3,
    prompt: 'The supertonic triad in G major is:',
    choices: ['A C E', 'D F♯ A', 'G B D', 'A C♯ E'], answer: 0,
    explanation: 'The supertonic of G is A; the triad A–C–E is a minor triad.',
  },
  {
    id: 'cc-24', topic: 'chords-and-cadences', difficulty: 1,
    prompt: 'A dominant 7th chord is built on the dominant with what added?',
    choices: ['A minor 7th above the root', 'A major 7th above the root', 'A 6th', 'Nothing'], answer: 0,
    explanation: 'It is chord V plus a minor 7th above the root — a four-note chord that pulls to the tonic.',
  },

  // ----- Time, Rhythm & Grouping (more) -----------------------------------
  {
    id: 'tr-12', topic: 'time-and-rhythm', difficulty: 2,
    prompt: '5/4 time is an example of:',
    choices: ['irregular time', 'simple duple time', 'compound triple time', 'simple quadruple time'], answer: 0,
    explanation: '5/4 (and 7/8 etc.) is irregular: it does not divide evenly into duple, triple or quadruple beats.',
  },
  {
    id: 'tr-13', topic: 'time-and-rhythm', difficulty: 3,
    prompt: '7/8 is most often grouped into beats adding up to seven, for example:',
    choices: ['2 + 2 + 3 quavers', '3 + 3 quavers', '2 + 2 + 2 quavers', '4 + 4 quavers'], answer: 0,
    explanation: 'Irregular 7/8 is commonly grouped 2+2+3 (or 3+2+2) quavers per bar.',
  },
  {
    id: 'tr-14', topic: 'time-and-rhythm', difficulty: 2,
    prompt: 'How many demisemiquavers equal one quaver?',
    choices: ['4', '2', '8', '3'], answer: 0,
    explanation: 'A demisemiquaver is a 32nd note; four of them make one quaver (an 8th note).',
  },
  {
    id: 'tr-15', topic: 'time-and-rhythm', difficulty: 3,
    prompt: 'A double-dotted crotchet is equal to how many semiquavers?',
    choices: ['7', '6', '8', '5'], answer: 0,
    explanation: 'Crotchet = 4 semiquavers; the first dot adds 2, the second dot adds 1 → 7 semiquavers.',
  },
  {
    id: 'tr-16', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'Which note lasts exactly twice as long as a minim?',
    choices: ['Semibreve', 'Crotchet', 'Quaver', 'Breve'], answer: 0,
    explanation: 'A semibreve equals two minims. (A breve equals four minims.)',
  },
  {
    id: 'tr-17', topic: 'time-and-rhythm', difficulty: 2,
    prompt: 'An unaccented note (or notes) before the first complete bar is called an:',
    choices: ['anacrusis', 'appoggiatura', 'ostinato', 'interval'], answer: 0,
    explanation: 'An anacrusis (or "upbeat") leads into the first full bar.',
  },
  {
    id: 'tr-18', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'How many quavers are there in one complete bar of 9/8?',
    choices: ['9', '3', '6', '12'], answer: 0,
    explanation: 'The lower 8 means quavers; the upper 9 means nine of them per bar.',
  },
  {
    id: 'tr-19', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'A curved line joining two notes of the SAME pitch, adding their values, is a:',
    choices: ['tie', 'slur', 'phrase mark', 'glissando'], answer: 0,
    explanation: 'A tie joins two notes of the same pitch into one longer sound. A slur joins different pitches.',
  },
  {
    id: 'tr-20', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'A pause sign (fermata) tells the performer to:',
    choices: ['hold the note longer than its written value', 'play it short', 'repeat it', 'play it quietly'], answer: 0,
    explanation: 'A fermata (𝄐) means hold the note or rest longer than written.',
  },
  {
    id: 'tr-21', topic: 'time-and-rhythm', difficulty: 1,
    prompt: 'How many quavers make up one dotted-crotchet beat?',
    choices: ['3', '2', '4', '6'], answer: 0,
    explanation: 'A dotted crotchet = a crotchet (2 quavers) plus a dot (1 quaver) = 3 quavers — the beat in compound time.',
  },
  {
    id: 'tr-22', topic: 'time-and-rhythm', difficulty: 1,
    prompt: '2/4, 3/4 and 4/4 are all examples of:',
    choices: ['simple time', 'compound time', 'irregular time', 'free time'], answer: 0,
    explanation: 'Their beats each divide into two, so they are all simple time.',
  },
  {
    id: 'tr-23', topic: 'time-and-rhythm', difficulty: 2,
    prompt: 'A semiquaver is equal to how many demisemiquavers?',
    choices: ['2', '4', '8', '1'], answer: 0,
    explanation: 'A semiquaver (16th) is twice the length of a demisemiquaver (32nd).',
  },

  // ----- The Four Clefs (more) --------------------------------------------
  {
    id: 'cl-7', topic: 'clefs', difficulty: 2,
    prompt: 'On the alto clef, the note on the bottom line is:',
    choices: ['F', 'E', 'G', 'D'], answer: 0,
    explanation: 'Alto-clef lines from the bottom up are F A C E G.',
  },
  {
    id: 'cl-8', topic: 'clefs', difficulty: 3,
    prompt: 'On the tenor clef, the note on the top line is:',
    choices: ['E', 'F', 'C', 'A'], answer: 0,
    explanation: 'Tenor-clef lines from the bottom up are D F A C E, so the top line is E.',
  },
  {
    id: 'cl-9', topic: 'clefs', difficulty: 2,
    prompt: 'Which clef is used for the higher notes of the cello and bassoon?',
    choices: ['Tenor clef', 'Alto clef', 'Treble clef', 'Bass clef'], answer: 0,
    explanation: 'The tenor clef keeps high cello/bassoon/trombone passages near the staff, avoiding ledger lines.',
  },
  {
    id: 'cl-10', topic: 'clefs', difficulty: 1,
    prompt: 'On the treble clef, the note on the bottom line is:',
    choices: ['E', 'G', 'F', 'D'], answer: 0,
    explanation: 'Treble-clef lines spell E G B D F (from the bottom): "Every Good Boy Deserves Favour".',
  },
  {
    id: 'cl-11', topic: 'clefs', difficulty: 1,
    prompt: 'On the bass clef, the note on the top line is:',
    choices: ['A', 'G', 'F', 'C'], answer: 0,
    explanation: 'Bass-clef lines spell G B D F A (from the bottom), so the top line is A.',
  },
  {
    id: 'cl-12', topic: 'clefs', difficulty: 1,
    prompt: 'On the alto clef shown, which note is this?', abc: 'X:1\nL:1/1\nM:none\nK:C clef=alto\nC',
    choices: ['Middle C', 'The C an octave below middle C', 'G', 'E'], answer: 0,
    explanation: 'The alto C-clef centres on the middle line, which is middle C.',
  },

  // ----- Transposition (more) ---------------------------------------------
  {
    id: 'tp-7', topic: 'transposition', difficulty: 3,
    prompt: 'A clarinet in A sounds how far from the written note?',
    choices: ['a minor 3rd lower', 'a major 2nd lower', 'a minor 3rd higher', 'a perfect 4th lower'], answer: 0,
    explanation: 'An A clarinet sounds a minor 3rd below the written pitch.',
  },
  {
    id: 'tp-8', topic: 'transposition', difficulty: 2,
    prompt: 'A trumpet in B♭ sounds:',
    choices: ['a major 2nd lower than written', 'a major 2nd higher', 'a perfect 5th lower', 'the same as written'], answer: 0,
    explanation: 'Like the B♭ clarinet, the B♭ trumpet sounds a major 2nd lower than written.',
  },
  {
    id: 'tp-9', topic: 'transposition', difficulty: 3,
    prompt: 'To make a B♭ clarinet sound music in C major, the written part must be in:',
    choices: ['D major', 'B♭ major', 'C major', 'A major'], answer: 0,
    explanation: 'Because it sounds a major 2nd lower, you write a major 2nd higher than concert pitch: C → D major.',
  },
  {
    id: 'tp-10', topic: 'transposition', difficulty: 2,
    prompt: 'Transposing a melody DOWN a major 2nd from C major puts it in:',
    choices: ['B♭ major', 'D major', 'A major', 'C major'], answer: 0,
    explanation: 'A major 2nd below C is B♭, so the new key is B♭ major.',
  },
  {
    id: 'tp-11', topic: 'transposition', difficulty: 1,
    prompt: 'The piccolo sounds:',
    choices: ['an octave higher than written', 'an octave lower', 'a 5th higher', 'as written'], answer: 0,
    explanation: 'Piccolo parts sound an octave higher than written.',
  },
  {
    id: 'tp-12', topic: 'transposition', difficulty: 1,
    prompt: 'When transposing by interval, every note must move by:',
    choices: ['the same interval (number and quality)', 'a different interval each', 'the same number of letters only', 'a semitone'], answer: 0,
    explanation: 'Keep the interval identical for every note — same number AND quality — then fit the new key signature.',
  },

  // ----- Ornaments (more) -------------------------------------------------
  {
    id: 'or-7', topic: 'ornaments', difficulty: 2,
    prompt: 'A lower mordent plays:',
    choices: ['note, note below, note', 'note, note above, note', 'note below, note above, note', 'two notes below'], answer: 0,
    explanation: 'A lower mordent is a quick flip down: the written note, the note below, then back.',
  },
  {
    id: 'or-8', topic: 'ornaments', difficulty: 1,
    prompt: 'Which ornament is a single, rapid flip up to the note above and straight back?',
    choices: ['Upper mordent', 'Turn', 'Trill', 'Acciaccatura'], answer: 0,
    explanation: 'An upper mordent flips once to the note above and returns; a trill alternates many times.',
  },
  {
    id: 'or-9', topic: 'ornaments', difficulty: 2,
    prompt: 'An appoggiatura is written as a grace note that has:',
    choices: ['no stroke through its tail', 'a stroke through its tail', 'a wavy line above', 'a dot beside it'], answer: 0,
    explanation: 'The appoggiatura is a normal-looking grace note with NO stroke; the acciaccatura has the stroke.',
  },

  // ----- Terms & Signs (more) ---------------------------------------------
  {
    id: 'ts-13', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"adagio" means:',
    choices: ['slow', 'quick', 'moderate', 'very fast'], answer: 0,
    explanation: 'Adagio = slow (slower than andante).',
  },
  {
    id: 'ts-14', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"andante" means:',
    choices: ['at a walking pace', 'very fast', 'very slow', 'getting slower'], answer: 0,
    explanation: 'Andante = at a walking pace.',
  },
  {
    id: 'ts-15', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"presto" means:',
    choices: ['very fast', 'slow', 'moderate', 'at a walking pace'], answer: 0,
    explanation: 'Presto = very fast (faster than allegro).',
  },
  {
    id: 'ts-16', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"accelerando" (accel.) means:',
    choices: ['getting gradually faster', 'getting gradually slower', 'getting louder', 'in strict time'], answer: 0,
    explanation: 'Accelerando = gradually speeding up.',
  },
  {
    id: 'ts-17', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"legato" means:',
    choices: ['smoothly', 'detached', 'loudly', 'quickly'], answer: 0,
    explanation: 'Legato = smoothly, with notes connected.',
  },
  {
    id: 'ts-18', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"staccato" means:',
    choices: ['detached (short)', 'smooth', 'loud', 'slow'], answer: 0,
    explanation: 'Staccato = detached, each note shortened.',
  },
  {
    id: 'ts-19', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"crescendo" (cresc.) means:',
    choices: ['getting gradually louder', 'getting softer', 'getting faster', 'smoothly'], answer: 0,
    explanation: 'Crescendo = gradually getting louder.',
  },
  {
    id: 'ts-20', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"mezzo-forte" (mf) means:',
    choices: ['moderately loud', 'very loud', 'moderately soft', 'very soft'], answer: 0,
    explanation: 'Mezzo = half/moderately; mf = moderately loud.',
  },
  {
    id: 'ts-21', topic: 'terms-and-signs', difficulty: 2,
    prompt: '"da capo" (D.C.) means:',
    choices: ['from the beginning', 'from the sign', 'the end', 'a little'], answer: 0,
    explanation: 'Da capo = (go back to and repeat) from the beginning.',
  },
  {
    id: 'ts-22', topic: 'terms-and-signs', difficulty: 2,
    prompt: '"dal segno" (D.S.) means:',
    choices: ['from the sign', 'from the beginning', 'to the end', 'gradually'], answer: 0,
    explanation: 'Dal segno = repeat from the sign (𝄋).',
  },
  {
    id: 'ts-23', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"fine" means:',
    choices: ['the end', 'the beginning', 'a little', 'always'], answer: 0,
    explanation: 'Fine = the end (where the piece finishes, often after a D.C.).',
  },
  {
    id: 'ts-24', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"molto" means:',
    choices: ['very / much', 'a little', 'less', 'smoothly'], answer: 0,
    explanation: 'Molto = very/much (e.g. molto allegro = very fast).',
  },
  {
    id: 'ts-25', topic: 'terms-and-signs', difficulty: 2,
    prompt: '"meno mosso" means:',
    choices: ['less movement (slower)', 'more movement (faster)', 'very fast', 'smoothly'], answer: 0,
    explanation: 'Meno mosso = less motion, i.e. slower.',
  },
  {
    id: 'ts-26', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"più" means:',
    choices: ['more', 'less', 'a little', 'always'], answer: 0,
    explanation: 'Più = more (e.g. più mosso = more movement, faster).',
  },
  {
    id: 'ts-27', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"sempre" means:',
    choices: ['always', 'sometimes', 'never', 'a little'], answer: 0,
    explanation: 'Sempre = always (e.g. sempre staccato).',
  },
  {
    id: 'ts-28', topic: 'terms-and-signs', difficulty: 2,
    prompt: 'The German word "schnell" means:',
    choices: ['fast', 'slow', 'loud', 'soft'], answer: 0,
    explanation: 'Schnell (German) = fast.',
  },
  {
    id: 'ts-29', topic: 'terms-and-signs', difficulty: 2,
    prompt: 'The German word "mässig" means:',
    choices: ['moderate(ly)', 'fast', 'slow', 'loud'], answer: 0,
    explanation: 'Mässig (German) = moderate, at a moderate speed.',
  },
  {
    id: 'ts-30', topic: 'terms-and-signs', difficulty: 2,
    prompt: 'The French word "lent" means:',
    choices: ['slow', 'fast', 'sweet', 'lively'], answer: 0,
    explanation: 'Lent (French) = slow.',
  },
  {
    id: 'ts-31', topic: 'terms-and-signs', difficulty: 2,
    prompt: 'The French word "vif" means:',
    choices: ['lively', 'slow', 'soft', 'heavy'], answer: 0,
    explanation: 'Vif (French) = lively, brisk.',
  },
  {
    id: 'ts-32', topic: 'terms-and-signs', difficulty: 1,
    prompt: '"con moto" means:',
    choices: ['with movement', 'without movement', 'with mute', 'very slow'], answer: 0,
    explanation: 'Con moto = with movement (a flowing, moving feel).',
  },

  // ----- Instruments & Voices (more) --------------------------------------
  {
    id: 'in-9', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'Which of these is NOT a member of the string family?',
    choices: ['Flute', 'Viola', 'Cello', 'Double bass'], answer: 0,
    explanation: 'The flute is woodwind; viola, cello and double bass are strings.',
  },
  {
    id: 'in-10', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'The bassoon belongs to which family?',
    choices: ['Woodwind', 'Brass', 'Strings', 'Percussion'], answer: 0,
    explanation: 'The bassoon is the lowest standard double-reed woodwind instrument.',
  },
  {
    id: 'in-11', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'Which is the LOWEST of the four standard voices?',
    choices: ['Bass', 'Tenor', 'Alto', 'Soprano'], answer: 0,
    explanation: 'From low to high: bass, tenor, alto, soprano.',
  },
  {
    id: 'in-12', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'The harp belongs to which family?',
    choices: ['Strings', 'Percussion', 'Woodwind', 'Brass'], answer: 0,
    explanation: 'The harp is a (plucked) string instrument.',
  },
  {
    id: 'in-13', topic: 'instruments-and-voices', difficulty: 2,
    prompt: '"senza sordino" tells a player to:',
    choices: ['remove the mute', 'put on the mute', 'put down the bow', 'play silently'], answer: 0,
    explanation: 'Senza sordino = without the mute (i.e. take it off); con sordino = with the mute.',
  },
  {
    id: 'in-14', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'Which of these is a brass instrument?',
    choices: ['Tuba', 'Bassoon', 'Harp', 'Clarinet'], answer: 0,
    explanation: 'The tuba is the lowest brass instrument; the others are woodwind or strings.',
  },
  {
    id: 'in-15', topic: 'instruments-and-voices', difficulty: 3,
    prompt: 'In a standard orchestral score, which family is written at the TOP of the page?',
    choices: ['Woodwind', 'Strings', 'Brass', 'Percussion'], answer: 0,
    explanation: 'Score order top-to-bottom is woodwind, brass, percussion, then strings.',
  },
  {
    id: 'in-16', topic: 'instruments-and-voices', difficulty: 1,
    prompt: 'The xylophone belongs to which family?',
    choices: ['Percussion', 'Brass', 'Strings', 'Woodwind'], answer: 0,
    explanation: 'The xylophone is a tuned percussion instrument.',
  },
]
