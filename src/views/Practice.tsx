import { useState } from 'react'
import type { Question } from '../types'
import type { PracticePool } from '../lib/nav'
import type { ProgressApi } from '../lib/storage'
import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import { prepareMany, shuffle, QUESTION_BY_ID, type Prepared } from '../lib/quiz'
import QuestionCard from '../components/QuestionCard'
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

export default function Practice({ api, pool }: Props) {
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>(pool ? 'run' : 'setup')
  const [activePool, setActivePool] = useState<PracticePool | null>(pool)
  const label = activePool?.label ?? ''
  const [questions, setQuestions] = useState<Prepared[]>(() =>
    pool ? prepareMany(shuffle(buildQuestions(pool))) : [],
  )
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [answered, setAnswered] = useState(0)

  function start(p: PracticePool) {
    const qs = prepareMany(shuffle(buildQuestions(p)))
    setQuestions(qs)
    setActivePool(p)
    setI(0)
    setSelected(null)
    setRevealed(false)
    setCorrect(0)
    setAnswered(0)
    setPhase('run')
  }

  function handleSelect(choice: number) {
    if (revealed) return
    const isRight = choice === questions[i].answer
    setSelected(choice)
    setRevealed(true)
    setAnswered((n) => n + 1)
    if (isRight) setCorrect((n) => n + 1)
    api.recordAttempt(questions[i].question.id, isRight)
  }

  function next() {
    if (i + 1 < questions.length) {
      setI(i + 1)
      setSelected(null)
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
          <h1 className="text-2xl font-black text-slate-800">Practice</h1>
          <p className="text-slate-500">Pick a topic and answer with instant feedback.</p>
        </header>
        <button
          className="clay-card flex w-full items-center gap-4 p-4 text-left transition-transform hover:-translate-y-0.5"
          onClick={() => start({ kind: 'topic', topic: 'all', label: 'All topics' })}
        >
          <span className="text-3xl">✨</span>
          <span className="flex-1">
            <span className="block text-lg font-extrabold text-slate-800">All topics (mixed)</span>
            <span className="block text-sm text-slate-500">{QUESTIONS.length} questions, shuffled</span>
          </span>
        </button>
        <div className="grid gap-3">
          {TOPICS.map((t) => {
            const count = QUESTIONS.filter((q) => q.topic === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => start({ kind: 'topic', topic: t.id, label: t.title })}
                className="clay-soft flex items-center gap-4 p-4 text-left transition-transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="flex-1 font-bold text-slate-700">{t.title}</span>
                <span className="chip bg-slate-100 text-slate-500">{count} Q</span>
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
        <p className="mt-3 font-bold text-slate-700">Nothing to practise here yet.</p>
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
          <h1 className="mt-3 text-2xl font-black text-slate-800">Set complete!</h1>
          <p className="mt-1 text-slate-500">{label}</p>
          <div className="mt-4 text-5xl font-black text-brand-600">
            {correct}
            <span className="text-2xl text-slate-400">/{questions.length}</span>
          </div>
          <div className="mt-3 flex justify-center">
            <Grade pct={pct} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            className="btn-primary"
            onClick={() => activePool && start(activePool)}
          >
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-1">
        <span className="chip bg-brand-50 text-brand-700">{label}</span>
        <span className="text-sm font-bold text-slate-500">
          Score {correct}/{answered}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${((i + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        prepared={current}
        selected={selected}
        revealed={revealed}
        onSelect={handleSelect}
        bookmarked={api.progress.bookmarks.includes(current.question.id)}
        onToggleBookmark={() => api.toggleBookmark(current.question.id)}
        index={i}
        total={questions.length}
      />

      {revealed && (
        <button className="btn-primary w-full animate-pop-in" onClick={next}>
          {i + 1 < questions.length ? 'Next question →' : 'See results'}
        </button>
      )}
    </div>
  )
}
