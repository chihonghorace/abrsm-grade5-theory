import type { Progress, Question, TopicId } from '../types'
import { TOPICS } from '../data/topics'
import { QUESTIONS } from '../data/questions'
import { QUESTION_BY_ID, shuffle } from './quiz'

// ---------------------------------------------------------------------------
// Single source of truth for progress analytics. All derived from the existing
// localStorage `attempts` (per-question seen/correct counts) — no new data is
// stored, so everything here works on the data the app already records.
// ---------------------------------------------------------------------------

export interface TopicStat {
  id: TopicId
  title: string
  icon: string
  seen: number
  correct: number
  /** correct / seen in [0,1]; 0 when the topic has never been attempted. */
  accuracy: number
}

/** Lifetime per-topic accuracy, aggregated across every recorded attempt. */
export function topicStats(progress: Progress): TopicStat[] {
  const agg = new Map<TopicId, { seen: number; correct: number }>()
  for (const [id, a] of Object.entries(progress.attempts)) {
    const q = QUESTION_BY_ID[id]
    if (!q) continue // ignore ids outside the main bank (e.g. past-paper questions)
    const e = agg.get(q.topic) ?? { seen: 0, correct: 0 }
    e.seen += a.seen
    e.correct += a.correct
    agg.set(q.topic, e)
  }
  return TOPICS.map((t) => {
    const e = agg.get(t.id) ?? { seen: 0, correct: 0 }
    return {
      id: t.id,
      title: t.title,
      icon: t.icon,
      seen: e.seen,
      correct: e.correct,
      accuracy: e.seen ? e.correct / e.seen : 0,
    }
  })
}

export interface TopicTally {
  topic: TopicId
  correct: number
  total: number
}

/** Group one session's per-question marks into per-topic correct/total (weakest first). */
export function tally(marks: { topic: TopicId; correct: boolean }[]): TopicTally[] {
  const m = new Map<TopicId, TopicTally>()
  for (const mk of marks) {
    const e = m.get(mk.topic) ?? { topic: mk.topic, correct: 0, total: 0 }
    e.total++
    if (mk.correct) e.correct++
    m.set(mk.topic, e)
  }
  return [...m.values()].sort((a, b) => a.correct / a.total - b.correct / b.total)
}

/**
 * A practice pool weighted toward the learner's weak topics: lower lifetime
 * accuracy → more questions, and never-practised topics are prioritised. Within
 * a topic, previously-wrong questions come first, then unseen, then correct.
 */
export function weakAreaQuestions(progress: Progress, count: number): Question[] {
  const stats = topicStats(progress)
  const weightOf = (s: TopicStat) => (s.seen === 0 ? 2.5 : 1 + (1 - s.accuracy) * 2.5)
  const weights = stats.map(weightOf)
  const sum = weights.reduce((a, b) => a + b, 0) || 1
  const picked: Question[] = []
  stats.forEach((s, i) => {
    const n = Math.round((count * weights[i]) / sum)
    if (n <= 0) return
    const rank = (q: Question) => {
      const a = progress.attempts[q.id]
      if (!a) return 1 // unseen
      return a.lastCorrect ? 2 : 0 // wrong first → unseen → correct last
    }
    const ordered = shuffle(QUESTIONS.filter((q) => q.topic === s.id)).sort((x, y) => rank(x) - rank(y))
    picked.push(...ordered.slice(0, n))
  })
  return shuffle(picked).slice(0, count)
}

export function weakAreaIds(progress: Progress, count: number): string[] {
  return weakAreaQuestions(progress, count).map((q) => q.id)
}
