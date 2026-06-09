// ---------------------------------------------------------------------------
// Domain model for the ABRSM Grade 5 theory app.
//
// The whole app is data-driven: add a Topic or a Question object and it shows
// up across Learn / Practice / Mock Exam automatically. Keeping a clean schema
// here is what lets the question bank grow without touching UI code.
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

export interface Question {
  id: string
  topic: TopicId
  difficulty: Difficulty
  prompt: string
  /** Optional ABC-notation string rendered as a music stave above the choices. */
  abc?: string
  choices: string[]
  /** Index into `choices` of the correct answer. */
  answer: number
  explanation: string
}

export interface TopicNote {
  heading: string
  /** Plain text; blank lines separate paragraphs, "- " lines become bullets. */
  body: string
  /** Optional ABC-notation example rendered under the note. */
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
  /** Keyed by Question.id */
  attempts: Record<string, Attempt>
  /** Question ids the learner flagged to revisit. */
  bookmarks: string[]
  mockHistory: MockResult[]
}
