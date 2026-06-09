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
]
