# Question bank — authoring & "举一反三" methodology

This file explains how the question bank is grown so it stays accurate,
exam-relevant, and **legally clean**.

## ⚖️ Copyright — read first

ABRSM's exam papers, practice papers and sample tests are **copyrighted**. We do
**not** copy, paraphrase, or reproduce their questions. Instead we use the
publicly published **syllabus and exam format** as a reference and write our own
**original** questions that test the same concepts ("举一反三" — infer many from
one). This is the same principle any independent revision book follows.

**Rule of thumb:** reference the *syllabus topic*, never an actual ABRSM question.

## 📚 Reference material (public, free)

- ABRSM syllabuses hub — <https://www.abrsm.org/en-gb/about-our-exams/syllabuses>
- Music Theory syllabus outline, Grades 1–5 (from 2020), official PDF —
  <https://www.abrsm.org/sites/default/files/2023-09/music-theory-syllabus-outline-grades-1-5-from-2020.pdf>
- About Music Theory exams (Grade 5) — <https://us.abrsm.org/en/our-exams/music-theory-exams/music-theory-grade-5/>
- Official practice papers (paid, optional — for *your own* format familiarity,
  not for copying) — ABRSM Shop.

## 🎯 Grade 5 (2020+) coverage checklist

The online Grade 5 Theory exam tests, in all keys up to 6 sharps/flats:

- [x] Keys, key signatures, scales (major, harmonic & melodic minor, chromatic), degree names
- [x] Intervals — number + quality, compound, augmented/diminished, inversion
- [x] Chords — triads I, **ii (new at Grade 5)**, IV, V; inversions (a/b/c); dominant 7th
- [x] Cadences — perfect, imperfect, plagal, interrupted
- [x] Time — simple, compound, **irregular (5/4, 7/8 …)**, grouping/beaming, triplets/duplets, note values
- [x] Clefs — treble, bass, alto, tenor
- [x] Transposition — at the octave, by interval, transposing instruments
- [x] Ornaments — trill, turn, mordents, appoggiatura, acciaccatura
- [x] Terms & signs — Italian, French, German
- [x] Instruments & voices — families, transposing instruments, SATB, playing terms

## ✍️ How to add a question

Append to [`../src/data/questions.ts`](../src/data/questions.ts):

```ts
{
  id: 'iv-25',                 // unique; convention: <topic-prefix>-<n>
  topic: 'intervals',          // must be a valid TopicId
  difficulty: 2,               // 1 (easy) – 3 (hard)
  prompt: 'A up to F is a:',
  abc: '[AF]',                 // optional ABC notation → renders a stave
  choices: ['Minor 6th', 'Major 6th', 'Perfect 5th', 'Augmented 5th'],
  answer: 0,                   // index of the CORRECT choice — KEEP IT AT 0
  explanation: 'A–F is six letter names and eight semitones — a minor 6th.',
}
```

### Conventions that matter

1. **Correct answer at index 0.** The app shuffles choices at display time, so
   position never leaks the answer — but keeping the source consistent makes
   review and bulk-generation easy.
2. **One concept per question**, with a short *why* in `explanation` (the app
   shows it as feedback — it's where the learning happens).
3. **Plausible distractors.** Wrong options should be the common mistakes
   (e.g. the relative-major instead of relative-minor; major vs minor 3rd).
4. **Spread the difficulty** (1–3) and tag the right `topic` so Practice/Mock
   filtering and the per-topic score breakdown stay meaningful.
5. **Notation:** a bare snippet like `[CE]` (harmonic) or `C E` (melodic) is
   auto-wrapped. For full control start the string with `X:1`. Test it renders.

### "举一反三" recipe (turn 1 concept into many questions)

For any concept, vary one axis at a time:

- **Transpose the example** — "C up to E" → "G up to B", "F up to A" (same M3,
  different starting note).
- **Flip the direction** — naming an interval ↔ inverting it.
- **Swap the ask** — give notes → name it; give the name → pick the notes;
  show notation → identify it.
- **Change the key** — chord V in C, then in D, then in G.
- **Raise difficulty** — add accidentals, double sharps/flats, compound intervals.

## 🤖 Future: AI-assisted generation

A later iteration can add a **bring-your-own-key** panel that calls Claude to
draft new questions in this exact schema, which a human then reviews before
they're committed. The site stays fully static; no key is ever stored server-side.
See the roadmap in [`../README.md`](../README.md).
