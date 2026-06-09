import { useState } from 'react'
import type { Question } from '../types'
import type { PracticePool } from '../lib/nav'
import type { ProgressApi } from '../lib/storage'
import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import { prepareMany, shuffle, QUESTION_BY_ID, type Prepared } from '../lib/quiz'
import { blankAnswer, isAnswered, isCorrect, revealsOnChange, type Answer } from '../lib/answer'
import QuestionView from '../components/QuestionView'
import { Grade } from './Home'

interface Props {
  api: ProgressApi
  pool: PracticePool | null
}

function buildQuestions(pool: PracticePool): Question[] {
  if (pool.kind === 'topic') {
    return pool.topic === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.topic === pool.topic)
  }
  return pool.ids.map((id) => QUESTION_BY_ID[id]).filter(Boolean)
}

/** Shuffle the pool and cap to `limit` (0 / undefined = keep all). */
function buildSession(pool: PracticePool, limit?: number): Prepared[] {
  const all = shuffle(buildQuestions(pool))
  const capped = limit && limit > 0 ? all.slice(0, limit) : all
  return prepareMany(capped)
}

const LENGTHS: { label: string; value: number }[] = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: 'All', value: 0 },
]

export default function Practice({ api, pool }: Props) {
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>(pool ? 'run' : 'setup')
  const [activePool, setActivePool] = useState<PracticePool | null>(pool)
  const [activeLimit, setActiveLimit] = useState<number>(pool?.limit ?? 0)
  const [lenChoice, setLenChoice] = useState<number>(20)
  const label = activePool?.label ?? ''
  const [questions, setQuestions] = useState<Prepared[]>(() =>
    pool ? buildSession(pool, pool.limit) : [],
  )
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState<Answer>(() => (pool ? blankAnswer(buildQuestions(pool)[0]) : null))
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [answered, setAnswered] = useState(0)

  function start(p: PracticePool, limit: number) {
    const qs = buildSession(p, limit)
    setQuestions(qs)
    setActivePool(p)
    setActiveLimit(limit)
    setI(0)
    setAnswer(qs.length ? blankAnswer(qs[0].question) : null)
    setRevealed(false)
    setCorrect(0)
    setAnswered(0)
    setPhase('run')
  }

  function reveal(a: Answer) {
    if (revealed) return
    const ok = isCorrect(questions[i], a)
    setRevealed(true)
    setAnswered((n) => n + 1)
    if (ok) setCorrect((n) => n + 1)
    api.recordAttempt(questions[i].question.id, ok)
  }

  function handleChange(a: Answer) {
    if (revealed) return
    setAnswer(a)
    if (revealsOnChange(questions[i].question)) reveal(a)
  }

  function next() {
    if (i + 1 < questions.length) {
      const ni = i + 1
      setI(ni)
      setAnswer(blankAnswer(questions[ni].question))
      setRevealed(false)
    } else {
      setPhase('done')
    }
  }

  // ---- Setup -------------------------------------------------------------
  if (phase === 'setup') {
    return (
      <div className="space-y-4">
        <header className="pt-2">
          <h1 className="text-2xl font-black text-ink">Practice</h1>
          <p className="text-ink-soft">Pick a length and topic — instant feedback on every answer.</p>
        </header>

        <div className="clay-soft flex items-center justify-between p-3">
          <span className="pl-1 text-sm font-bold text-ink-soft">Questions per set</span>
          <div className="flex gap-1 rounded-xl bg-surface-2 p-1">
            {LENGTHS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLenChoice(l.value)}
                className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${
                  lenChoice === l.value ? 'bg-surface text-brand-600 dark:text-brand-300 shadow-clay-sm' : 'text-ink-soft'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="clay-card flex w-full items-center gap-4 p-4 text-left transition-transform hover:-translate-y-0.5"
          onClick={() => start({ kind: 'topic', topic: 'all', label: 'All topics' }, lenChoice)}
        >
          <span className="text-3xl">✨</span>
          <span className="flex-1">
            <span className="block text-lg font-extrabold text-ink">All topics (mixed)</span>
            <span className="block text-sm text-ink-soft">{QUESTIONS.length} questions, shuffled</span>
          </span>
        </button>
        <div className="grid gap-3">
          {TOPICS.map((t) => {
            const count = QUESTIONS.filter((q) => q.topic === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => start({ kind: 'topic', topic: t.id, label: t.title }, lenChoice)}
                className="clay-soft flex items-center gap-4 p-4 text-left transition-transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="flex-1 font-bold text-ink">{t.title}</span>
                <span className="chip bg-surface-2 text-ink-soft">{count} Q</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ---- Empty pool --------------------------------------------------------
  if (questions.length === 0) {
    return (
      <div className="clay-card mt-6 p-8 text-center">
        <div className="text-4xl">🗒️</div>
        <p className="mt-3 font-bold text-ink">Nothing to practise here yet.</p>
        <button className="btn-ghost mt-4" onClick={() => setPhase('setup')}>
          Choose a topic
        </button>
      </div>
    )
  }

  // ---- Done --------------------------------------------------------------
  if (phase === 'done') {
    const pct = Math.round((correct / questions.length) * 100)
    return (
      <div className="space-y-4">
        <div className="clay-card p-8 text-center animate-pop-in">
          <div className="text-5xl">{pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪'}</div>
          <h1 className="mt-3 text-2xl font-black text-ink">Set complete!</h1>
          <p className="mt-1 text-ink-soft">{label}</p>
          <div className="mt-4 text-5xl font-black text-brand-600 dark:text-brand-300">
            {correct}
            <span className="text-2xl text-ink-faint">/{questions.length}</span>
          </div>
          <div className="mt-3 flex justify-center">
            <Grade pct={pct} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-primary" onClick={() => activePool && start(activePool, activeLimit)}>
            ↻ Again
          </button>
          <button className="btn-ghost" onClick={() => setPhase('setup')}>
            Choose set
          </button>
        </div>
      </div>
    )
  }

  // ---- Run ---------------------------------------------------------------
  const current = questions[i]
  const needsCheck = !revealed && !revealsOnChange(current.question)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-1">
        <span className="chip bg-brand-500/12 text-brand-600 dark:text-brand-300">{label}</span>
        <span className="text-sm font-bold text-ink-soft tabular-nums">
          Score {correct}/{answered}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${((i + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <QuestionView
        prepared={current}
        answer={answer}
        onChange={handleChange}
        revealed={revealed}
        bookmarked={api.progress.bookmarks.includes(current.question.id)}
        onToggleBookmark={() => api.toggleBookmark(current.question.id)}
        index={i}
        total={questions.length}
      />

      {needsCheck && (
        <button
          className="btn-primary w-full"
          disabled={!isAnswered(current.question, answer)}
          onClick={() => reveal(answer)}
        >
          Check answer
        </button>
      )}
      {revealed && (
        <button className="btn-primary w-full animate-pop-in" onClick={next}>
          {i + 1 < questions.length ? 'Next question →' : 'See results'}
        </button>
      )}
    </div>
  )
}
