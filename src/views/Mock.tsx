import { useEffect, useRef, useState } from 'react'
import type { ProgressApi } from '../lib/storage'
import { QUESTIONS } from '../data/questions'
import { TOPIC_BY_ID } from '../data/topics'
import { prepareMany, shuffle, type Prepared } from '../lib/quiz'
import QuestionCard from '../components/QuestionCard'
import { Grade } from './Home'

interface Props {
  api: ProgressApi
}

interface Preset {
  label: string
  count: number
  minutes: number
}

const PRESETS: Preset[] = [
  { label: 'Quick', count: 12, minutes: 15 },
  { label: 'Standard', count: 24, minutes: 30 },
  { label: 'Full', count: 40, minutes: 50 },
]

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Mock({ api }: Props) {
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>('setup')
  const [questions, setQuestions] = useState<Prepared[]>([])
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [flags, setFlags] = useState<boolean[]>([])
  const [cur, setCur] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [durationSec, setDurationSec] = useState(0)
  const startedAt = useRef<number>(0)

  // Countdown timer: decrement once per second while running.
  useEffect(() => {
    if (phase !== 'run' || secondsLeft <= 0) return
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, secondsLeft])

  // Auto-submit when the clock hits zero. Kept separate from the ticker so it
  // closes over the latest answers rather than a stale snapshot.
  useEffect(() => {
    if (phase === 'run' && secondsLeft === 0) submit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft])

  function start(p: Preset) {
    const count = Math.min(p.count, QUESTIONS.length)
    const qs = prepareMany(shuffle(QUESTIONS).slice(0, count))
    setQuestions(qs)
    setAnswers(new Array(qs.length).fill(null))
    setFlags(new Array(qs.length).fill(false))
    setCur(0)
    setSecondsLeft(p.minutes * 60)
    startedAt.current = Date.now()
    setPhase('run')
  }

  function choose(choice: number) {
    setAnswers((prev) => {
      const next = prev.slice()
      next[cur] = choice
      return next
    })
  }

  function submit(auto = false) {
    if (phase !== 'run') return
    if (!auto) {
      const blanks = answers.filter((a) => a === null).length
      if (blanks > 0 && !confirm(`You have ${blanks} unanswered question(s). Submit anyway?`)) return
    }
    let score = 0
    questions.forEach((q, idx) => {
      const correct = answers[idx] === q.answer
      if (correct) score++
      api.recordAttempt(q.question.id, correct)
    })
    const dur = Math.round((Date.now() - startedAt.current) / 1000)
    setDurationSec(dur)
    api.addMockResult({ date: new Date().toISOString(), score, total: questions.length, durationSec: dur })
    setPhase('done')
  }

  // ---- Setup -------------------------------------------------------------
  if (phase === 'setup') {
    return (
      <div className="space-y-4">
        <header className="pt-2">
          <h1 className="text-2xl font-black text-slate-800">Mock exam</h1>
          <p className="text-slate-500">
            Timed, no instant feedback — just like the real thing. Flag questions and revisit before you submit.
          </p>
        </header>
        <div className="grid gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => start(p)}
              className="clay-card flex items-center gap-4 p-5 text-left transition-transform hover:-translate-y-0.5"
            >
              <span className="text-3xl">⏱️</span>
              <span className="flex-1">
                <span className="block text-lg font-extrabold text-slate-800">{p.label}</span>
                <span className="block text-sm text-slate-500">
                  {Math.min(p.count, QUESTIONS.length)} questions · {p.minutes} min
                </span>
              </span>
              <span className="text-slate-300">→</span>
            </button>
          ))}
        </div>
        <p className="rounded-2xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-500">
          Grading: 66% Pass · 80% Merit · 90% Distinction (the ABRSM Grade 5 thresholds).
        </p>
      </div>
    )
  }

  // ---- Done --------------------------------------------------------------
  if (phase === 'done') {
    const score = questions.reduce((n, q, idx) => n + (answers[idx] === q.answer ? 1 : 0), 0)
    const pct = Math.round((score / questions.length) * 100)

    // Per-topic breakdown
    const byTopic = new Map<string, { correct: number; total: number }>()
    questions.forEach((q, idx) => {
      const t = q.question.topic
      const e = byTopic.get(t) ?? { correct: 0, total: 0 }
      e.total++
      if (answers[idx] === q.answer) e.correct++
      byTopic.set(t, e)
    })

    return (
      <div className="space-y-4">
        <div className="clay-card p-8 text-center animate-pop-in">
          <div className="text-5xl">{pct >= 90 ? '🏆' : pct >= 66 ? '🎉' : '💪'}</div>
          <h1 className="mt-3 text-2xl font-black text-slate-800">Exam finished</h1>
          <div className="mt-3 text-5xl font-black text-brand-600">
            {score}
            <span className="text-2xl text-slate-400">/{questions.length}</span>
          </div>
          <div className="mt-3 flex justify-center">
            <Grade pct={pct} />
          </div>
          <p className="mt-3 text-sm text-slate-400">Time used: {fmt(durationSec)}</p>
        </div>

        <div className="clay-soft p-5">
          <h2 className="mb-3 text-lg font-extrabold text-slate-800">By topic</h2>
          <ul className="space-y-2.5">
            {[...byTopic.entries()].map(([t, e]) => {
              const topic = TOPIC_BY_ID[t as keyof typeof TOPIC_BY_ID]
              const w = Math.round((e.correct / e.total) * 100)
              return (
                <li key={t}>
                  <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-600">
                    <span>
                      {topic.icon} {topic.title}
                    </span>
                    <span>
                      {e.correct}/{e.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${w >= 66 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <details className="clay-soft p-5">
          <summary className="cursor-pointer text-lg font-extrabold text-slate-800">
            Review all answers
          </summary>
          <div className="mt-4 space-y-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.question.id}
                prepared={q}
                selected={answers[idx]}
                revealed
                onSelect={() => {}}
                bookmarked={api.progress.bookmarks.includes(q.question.id)}
                onToggleBookmark={() => api.toggleBookmark(q.question.id)}
                index={idx}
                total={questions.length}
              />
            ))}
          </div>
        </details>

        <button className="btn-primary w-full" onClick={() => setPhase('setup')}>
          ↻ New mock exam
        </button>
      </div>
    )
  }

  // ---- Run ---------------------------------------------------------------
  const q = questions[cur]
  const answeredCount = answers.filter((a) => a !== null).length
  const low = secondsLeft <= 60

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between bg-cream/90 px-4 py-2 backdrop-blur">
        <span className="chip bg-slate-100 text-slate-600">
          {answeredCount}/{questions.length} answered
        </span>
        <span
          className={`chip font-black tabular-nums ${
            low ? 'animate-pulse bg-rose-100 text-rose-700' : 'bg-brand-50 text-brand-700'
          }`}
        >
          ⏱️ {fmt(secondsLeft)}
        </span>
        <button onClick={() => submit(false)} className="btn-primary px-4 py-2 text-sm">
          Submit
        </button>
      </div>

      <QuestionCard
        prepared={q}
        selected={answers[cur]}
        revealed={false}
        onSelect={choose}
        bookmarked={flags[cur]}
        onToggleBookmark={() =>
          setFlags((f) => {
            const n = f.slice()
            n[cur] = !n[cur]
            return n
          })
        }
        index={cur}
        total={questions.length}
      />

      <div className="flex gap-3">
        <button
          className="btn-ghost flex-1"
          onClick={() => setCur((c) => Math.max(0, c - 1))}
          disabled={cur === 0}
        >
          ← Prev
        </button>
        <button
          className="btn-primary flex-1"
          onClick={() => setCur((c) => Math.min(questions.length - 1, c + 1))}
          disabled={cur === questions.length - 1}
        >
          Next →
        </button>
      </div>

      {/* Question palette */}
      <div className="clay-soft p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Jump to question · 🏷️ = flagged
        </p>
        <div className="grid grid-cols-8 gap-1.5">
          {questions.map((_, idx) => {
            const isAnswered = answers[idx] !== null
            const isFlagged = flags[idx]
            const isCur = idx === cur
            return (
              <button
                key={idx}
                onClick={() => setCur(idx)}
                className={`relative h-9 rounded-lg text-sm font-bold transition-all ${
                  isCur
                    ? 'bg-brand-600 text-white ring-2 ring-brand-300'
                    : isAnswered
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {idx + 1}
                {isFlagged && <span className="absolute -right-0.5 -top-1 text-[10px]">🏷️</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
