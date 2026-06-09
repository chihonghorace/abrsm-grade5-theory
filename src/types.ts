// ---------------------------------------------------------------------------
// Domain model for the ABRSM Grade 5 theory app.
//
// Questions are a discriminated union of interaction types that mirror the real
// online exam:
//   - mc      : single-answer multiple choice. Choices may render as notation
//               (`choicesAbc`) for "build the interval/identify the note" tasks,
//               or be ['True','False'] for true/false statements.
//   - fill    : one or more text/number blanks.
//   - multi   : several labelled items, each chosen from a shared option list
//               (e.g. name each chord A/B/C).
//
// The whole app is data-driven: drop a question object into the JSON database
// (src/data/questions/<topic>.json) and it shows up everywhere automatically.
// ---------------------------------------------------------------------------

export type TopicId =
  | 'keys-and-scales'
  | 'intervals'
  | 'chords-and-cadences'
  | 'time-and-rhythm'
  | 'clefs'
  | 'transposition'
  | 'ornaments'
  | 'terms-and-signs'
  | 'instruments-and-voices'

export type Difficulty = 1 | 2 | 3

export type QuestionType = 'mc' | 'fill' | 'multi'

interface QuestionBase {
  id: string
  topic: TopicId
  difficulty: Difficulty
  prompt: string
  /** Optional ABC-notation rendered as a stave above the answer area. */
  abc?: string
  /**
   * Optional image rendered above the answer area (e.g. a notation excerpt
   * cropped from a past paper). A URL served from /public, like
   * `/papers/<paperId>/<qid>.png`. Used by local-only past papers.
   */
  imageSrc?: string
  explanation: string
}

export interface MCQuestion extends QuestionBase {
  type?: 'mc'
  choices: string[]
  /** If present, each choice is rendered as notation instead of text. */
  choicesAbc?: string[]
  /** Index into `choices` of the correct answer. */
  answer: number
}

export interface FillBlank {
  answer: string
  /** Other accepted spellings (case/space-insensitive match is applied too). */
  alt?: string[]
  prefix?: string
  suffix?: string
}

export interface FillQuestion extends QuestionBase {
  type: 'fill'
  blanks: FillBlank[]
}

export interface MultiItem {
  label: string
  answer: string
}

export interface MultiQuestion extends QuestionBase {
  type: 'multi'
  options: string[]
  items: MultiItem[]
}

export type Question = MCQuestion | FillQuestion | MultiQuestion

/** Narrowing helper — JSON MC questions omit `type`, so default to 'mc'. */
export function questionType(q: Question): QuestionType {
  return q.type ?? 'mc'
}

// --- Study notes -----------------------------------------------------------

export interface TopicNote {
  heading: string
  body: string
  abc?: string
}

export interface Topic {
  id: TopicId
  title: string
  blurb: string
  icon: string
  notes: TopicNote[]
}

// --- Persisted progress (localStorage) -------------------------------------

export interface Attempt {
  seen: number
  correct: number
  wrong: number
  lastCorrect: boolean
}

export interface MockResult {
  date: string
  score: number
  total: number
  durationSec: number
}

export interface Progress {
  attempts: Record<string, Attempt>
  bookmarks: string[]
  mockHistory: MockResult[]
}

// --- Past papers (真题) -----------------------------------------------------
// Real exam-paper practice. Paper definitions live in data/papers/*.json and
// their cropped images in public/papers/<id>/ — BOTH gitignored, because ABRSM
// papers are copyright and must never be bundled into the published build.
// They exist only on the local machine that extracted them. See
// src/data/papers.ts and scripts/extract-paper.mjs.

export interface Paper {
  /** Stable id; also the folder name under public/papers/<id>/. */
  id: string
  title: string
  /** Provenance, e.g. "ABRSM Grade 5 2020 sample paper (local copy)". */
  source?: string
  questions: Question[]
}
