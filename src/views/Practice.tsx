import { useState } from 'react'
import type { Question } from '../types'
import type { PracticePool } from '../lib/nav'
import type { ProgressApi } from '../lib/storage'
import { QUESTIONS } from '../data/questions'
import { TOPICS } from '../data/topics'
import { prepareMany, shuffle, QUESTION_BY_ID, type Prepared } from '../lib/quiz'
import { blankAnswer, isCorrect, type Answer } from '../lib/answer'
import { tally } from '../lib/stats'
import ExamShell, { type PaletteCell } from '../components/exam/ExamShell'
import ExamQuestion from '../components/exam/ExamQuestion'
import TopicBreakdown from '../components/TopicBreakdown'
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

// Ids of the interactive "drag a note" interval questions, for a direct entry point.
const BUILD_IDS = QUESTIONS.filter((q) => q.type === 'build').map((q) => q.id)

export default function Practice({ api, pool }: Props) {
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>(pool ? 'run' : 'setup')
  const [activePool, setActivePool] = useState<PracticePool | null>(pool)
  const [activeLimit, setActiveLimit] = useState<number>(pool?.limit ?? 0)
  const [lenChoice, setLenChoice] = useState<number>(20)
  const label = activePool?.label ?? ''
  const [session, setSession] = useState(() => {
    const qs = pool ? buildSession(pool, pool.limit) : []
    return {
      qs,
      answers: qs.map((p) => blankAnswer(p.question)),
      revealed: qs.map(() => false),
      flags: qs.map(() => false),
    }
  })
  const [i, setI] = useState(0)
  const questions = session.qs
  const answer = session.answers[i]
  const revealed = !!session.revealed[i]
  const answered = session.revealed.filter(Boolean).length
  const correct = questions.reduce(
    (n, q, idx) => n + (session.revealed[idx] && isCorrect(q, session.answers[idx]) ? 1 : 0),
    0,
  )

  function start(p: PracticePool, limit: number) {
    const qs = buildSession(p, limit)
    setSession({
      qs,
      answers: qs.map((x) => blankAnswer(x.question)),
      revealed: qs.map(() => false),
      flags: qs.map(() => false),
    })
    setActivePool(p)
    setActiveLimit(limit)
    setI(0)
    setPhase('run')
  }

  function reveal(idx: number, a: Answer) {
    if (session.revealed[idx]) return
    const ok = isCorrect(questions[idx], a)
    setSession((s) => {
      const answers = s.answers.slice()
      const revealed = s.revealed.slice()
      answers[idx] = a
      revealed[idx] = true
      return { ...s, answers, revealed }
    })
    api.recordAttempt(questions[idx].question.id, ok)
  }

  function handleChange(a: Answer) {
    if (session.revealed[i]) return
    setSession((s) => {
      const answers = s.answers.slice()
      answers[i] = a
      return { ...s, answers }
    })
  }

  function advance() {
    if (i + 1 < questions.length) setI(i + 1)
    else setPhase('done')
  }

  function toggleFlag(idx: number) {
    setSession((s) => {
      const flags = s.flags.slice()
      flags[idx] = !flags[idx]
      return { ...s, flags }
    })
  }

  function clearCurrent() {
    if (session.revealed[i]) return
    setSession((s) => {
      const answers = s.answers.slice()
      answers[i] = blankAnswer(questions[i].question)
      return { ...s, answers }
    })
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

        {BUILD_IDS.length > 0 && (
          <button
            className="clay-card flex w-full items-center gap-4 p-4 text-left ring-2 ring-brand-400/40 transition-transform hover:-translate-y-0.5"
            onClick={() => start({ kind: 'ids', ids: BUILD_IDS, label: 'Build intervals' }, 0)}
          >
            <span className="text-3xl">🎵</span>
            <span className="flex-1">
              <span className="block text-lg font-extrabold text-ink">Build intervals</span>
              <span className="block text-sm text-ink-soft">
                {BUILD_IDS.length} build-the-note questions — set the pitch on the staff
              </span>
            </span>
          </button>
        )}
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
    const marks = questions.flatMap((q, idx) =>
      session.revealed[idx] ? [{ topic: q.question.topic, correct: isCorrect(q, session.answers[idx]) }] : [],
    )
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

        <TopicBreakdown tallies={tally(marks)} />

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

  // ---- Run (exam shell: one question per screen, free navigation) --------
  const current = questions[i]
  const cellState = (idx: number): PaletteCell['state'] =>
    idx === i ? 'current' : session.flags[idx] ? 'flagged' : session.revealed[idx] ? 'answered' : 'plain'

  return (
    <ExamShell
      onPrev={i > 0 ? () => setI(i - 1) : undefined}
      onNext={i + 1 < questions.length ? () => setI(i + 1) : undefined}
      onEnd={() => setPhase('done')}
      onFlag={() => toggleFlag(i)}
      onClear={!revealed ? clearCurrent : undefined}
      palette={questions.map((_, idx) => ({
        label: String(idx + 1),
        state: cellState(idx),
        onClick: () => setI(idx),
      }))}
    >
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>{label}</span>
        <span className="tabular-nums opacity-70">
          Score {correct}/{answered} · Q{i + 1}/{questions.length}
        </span>
      </div>

      <ExamQuestion
        prepared={current}
        answer={answer}
        onChange={handleChange}
        revealed={revealed}
        onAnswer={() => reveal(i, answer)}
      />

      {revealed && (
        <button
          onClick={advance}
          className="rounded-md bg-rose-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          {i + 1 < questions.length ? 'Continue' : 'See results'}
        </button>
      )}
    </ExamShell>
  )
}
