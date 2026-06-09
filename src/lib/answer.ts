import type { BuildQuestion, FillQuestion, MultiQuestion, Question } from '../types'
import { questionType } from '../types'
import { samePitch } from './pitch'
import type { Prepared } from './quiz'

/** A learner's in-progress answer, shaped per question type. */
export type Answer = number | null | string | string[] | (string | null)[]

export function blankAnswer(q: Question): Answer {
  switch (questionType(q)) {
    case 'fill':
      return (q as FillQuestion).blanks.map(() => '')
    case 'multi':
      return (q as MultiQuestion).items.map(() => null)
    case 'build':
      return (q as BuildQuestion).startAbc
    default:
      return null
  }
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

export function isAnswered(q: Question, a: Answer): boolean {
  switch (questionType(q)) {
    case 'fill':
      return Array.isArray(a) && (a as string[]).every((s) => typeof s === 'string' && s.trim() !== '')
    case 'multi':
      return Array.isArray(a) && (a as (string | null)[]).every((s) => s != null && s !== '')
    case 'build':
      // Answered once the learner has moved the note off its starting position.
      return typeof a === 'string' && a !== (q as BuildQuestion).startAbc
    default:
      return typeof a === 'number'
  }
}

export function isCorrect(prepared: Prepared, a: Answer): boolean {
  const q = prepared.question
  switch (questionType(q)) {
    case 'fill': {
      const blanks = (q as FillQuestion).blanks
      if (!Array.isArray(a)) return false
      const arr = a as string[]
      return blanks.every((b, i) => {
        const given = norm(arr[i] ?? '')
        return [b.answer, ...(b.alt ?? [])].map(norm).includes(given)
      })
    }
    case 'multi': {
      const items = (q as MultiQuestion).items
      if (!Array.isArray(a)) return false
      const arr = a as (string | null)[]
      return items.every((it, i) => arr[i] === it.answer)
    }
    case 'build':
      return typeof a === 'string' && samePitch(a, (q as BuildQuestion).answerAbc)
    default:
      return typeof a === 'number' && a === prepared.mc!.answer
  }
}

/** MC (incl. true/false & notation-pick) reveals on pick; fill/multi need a Check. */
export function revealsOnChange(q: Question): boolean {
  return questionType(q) === 'mc'
}
