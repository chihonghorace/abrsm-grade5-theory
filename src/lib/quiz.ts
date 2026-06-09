import type { Progress, Question } from '../types'
import { QUESTIONS } from '../data/questions'

/** Fisher–Yates shuffle, returns a new array. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * A question with its choices shuffled for display. Every question in the bank
 * stores the correct answer at index 0, so shuffling is essential — otherwise
 * the answer is always the first option.
 */
export interface Prepared {
  question: Question
  choices: string[]
  /** Index of the correct answer within the shuffled `choices`. */
  answer: number
}

export function prepare(q: Question): Prepared {
  const order = shuffle(q.choices.map((_, i) => i))
  return {
    question: q,
    choices: order.map((i) => q.choices[i]),
    answer: order.indexOf(q.answer),
  }
}

export function prepareMany(qs: Question[]): Prepared[] {
  return qs.map(prepare)
}

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
)

/** Questions the learner most recently got wrong, or gets wrong more than right. */
export function needsWork(progress: Progress): Question[] {
  return QUESTIONS.filter((q) => {
    const a = progress.attempts[q.id]
    return a && (a.lastCorrect === false || a.wrong > a.correct)
  })
}

export function bookmarkedQuestions(progress: Progress): Question[] {
  const set = new Set(progress.bookmarks)
  return QUESTIONS.filter((q) => set.has(q.id))
}
