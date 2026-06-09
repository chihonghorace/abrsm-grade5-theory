import type { MCQuestion, MultiQuestion, Progress, Question } from '../types'
import { questionType } from '../types'
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
  /** Present for MC questions: choices shuffled for display + the new answer index. */
  mc?: { choices: string[]; choicesAbc?: (string | undefined)[]; answer: number }
  /** Present for multi questions: the shared option list, shuffled for display. */
  multiOptions?: string[]
}

export function prepare(q: Question): Prepared {
  switch (questionType(q)) {
    case 'fill':
      return { question: q }
    case 'multi': {
      const m = q as MultiQuestion
      return { question: q, multiOptions: shuffle(m.options) }
    }
    default: {
      // MC: every question stores the correct answer at index 0, so shuffle.
      const mc = q as MCQuestion
      const order = shuffle(mc.choices.map((_, i) => i))
      return {
        question: q,
        mc: {
          choices: order.map((i) => mc.choices[i]),
          choicesAbc: mc.choicesAbc ? order.map((i) => mc.choicesAbc![i]) : undefined,
          answer: order.indexOf(mc.answer),
        },
      }
    }
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
