import { useEffect, useRef, useState } from 'react'
import type { ProgressApi } from '../lib/storage'
import type { Question } from '../types'
import { QUESTIONS } from '../data/questions'
import { prepareMany, shuffle, type Prepared } from '../lib/quiz'
import { blankAnswer, isAnswered, isCorrect, type Answer } from '../lib/answer'
import { tally, weakAreaQuestions } from '../lib/stats'
import QuestionView from '../components/QuestionView'
import ExamShell, { type PaletteCell } from '../components/exam/ExamShell'
import ExamQuestion from '../components/exam/ExamQuestion'
import TopicBreakdown from '../components/TopicBreakdown'
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

// The real ABRSM Grade 5 online exam: 58 questions / 120 minutes / 75 marks.
// Question counts are weighted to mirror the official mark distribution
// (Rhythm · Pitch · Keys&Scales · Intervals · Chords · Terms/Signs/Instruments).
const BLUEPRINT_MINUTES = 120
const EXAM_BLUEPRINT: { topic: string; count: number }[] = [
  { topic: 'time-and-rhythm', count: 8 }, // 节奏
  { topic: 'clefs', count: 8 }, // 音高 (note reading)
  { topic: 'keys-and-scales', count: 10 }, // 调与音阶
  { topic: 'intervals', count: 8 }, // 音程
  { topic: 'chords-and-cadences', count: 8 }, // 和弦
  { topic: 'terms-and-signs', count: 4 }, // 术语与标记
  { topic: 'ornaments', count: 3 }, // 装饰音
  { topic: 'instruments-and-voices', count: 3 }, // 乐器
  { topic: 'transposition', count: 2 }, // 移调
  { topic: 'score-analysis', count: 4 }, // 乐谱分析
]
const BLUEPRINT_TOTAL = EXAM_BLUEPRINT.reduce((n, b) => n + b.count, 0) // 58

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Mock({ api }: Props) {
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>('setup')
  const [questions, setQuestions] = useState<Prepared[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [flags, setFlags] = useState<boolean[]>([])
  const [cur, setCur] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [durationSec, setDurationSec] = useState(0)
  const startedAt = useRef<number>(0)

  // Setup mode: real-exam blueprint (真题) vs custom/shorter mock exam.
  const [mockMode, setMockMode] = useState<'exam' | 'mock'>('exam')
  // Custom paper builder (组卷) state
  const [showBuilder, setShowBuilder] = useState(false)
  const [bCount, setBCount] = useState(30)
  const [bMinutes, setBMinutes] = useState(60)
  const [bFocus, setBFocus] = useState<'balanced' | 'weak'>('balanced')

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

  function begin(qs: Prepared[], minutes: number) {
    setQuestions(qs)
    setAnswers(qs.map((p) => blankAnswer(p.question)))
    setFlags(new Array(qs.length).fill(false))
    setCur(0)
    setSecondsLeft(minutes * 60)
    startedAt.current = Date.now()
    setPhase('run')
  }

  function start(p: Preset) {
    const count = Math.min(p.count, QUESTIONS.length)
    begin(prepareMany(shuffle(QUESTIONS).slice(0, count)), p.minutes)
  }

  // Weighted "real exam" paper — draws from each topic per the official blueprint.
  function startBlueprint() {
    const picked: typeof QUESTIONS = []
    for (const { topic, count } of EXAM_BLUEPRINT) {
      picked.push(...shuffle(QUESTIONS.filter((q) => q.topic === topic)).slice(0, count))
    }
    begin(prepareMany(shuffle(picked)), BLUEPRINT_MINUTES)
  }

  // Custom paper (组卷): "balanced" = evenly random; "weak" = weight toward the
  // topics this learner gets wrong or hasn't practised (uses local progress).
  // "balanced" = evenly random; "weak" = weighted toward the topics this learner
  // gets wrong or hasn't practised (shared weak-area logic — see lib/stats.ts).
  function buildWeighted(count: number, focus: 'balanced' | 'weak'): Question[] {
    return focus === 'weak'
      ? weakAreaQuestions(api.progress, count)
      : shuffle(QUESTIONS).slice(0, count)
  }

  function buildCustom() {
    begin(prepareMany(buildWeighted(Math.min(bCount, QUESTIONS.length), bFocus)), bMinutes)
  }

  function onChange(a: Answer) {
    setAnswers((prev) => {
      const next = prev.slice()
      next[cur] = a
      return next
    })
  }

  function submit(auto = false) {
    if (phase !== 'run') return
    if (!auto) {
      const blanks = answers.filter((a, idx) => !isAnswered(questions[idx].question, a)).length
      if (blanks > 0 && !confirm(`You have ${blanks} unanswered question(s). Submit anyway?`)) return
    }
    let score = 0
    questions.forEach((q, idx) => {
      const correct = isCorrect(q, answers[idx])
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
          <h1 className="text-2xl font-black text-ink">Mock exam</h1>
          <p className="text-ink-soft">
            Timed, no instant feedback — just like the real thing. Flag questions and revisit before you submit.
          </p>
        </header>

        <div className="flex gap-1 rounded-xl bg-surface-2 p-1">
          {([['exam', '真题 Real exam'], ['mock', 'Mock exam']] as const).map(([k, lbl]) => (
            <button
              key={k}
              onClick={() => setMockMode(k)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                mockMode === k ? 'bg-surface text-brand-600 dark:text-brand-300 shadow-clay-sm' : 'text-ink-soft'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {mockMode === 'exam' && (
          <button
            onClick={startBlueprint}
            className="clay-card flex w-full items-center gap-4 p-5 text-left ring-2 ring-brand-400/40 transition-transform hover:-translate-y-0.5"
          >
          <span className="text-3xl">🎓</span>
          <span className="flex-1">
            <span className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-ink">Real exam</span>
              <span className="chip bg-brand-500/15 text-brand-600 dark:text-brand-300">真题模拟</span>
            </span>
            <span className="block text-sm text-ink-soft">
              {Math.min(BLUEPRINT_TOTAL, QUESTIONS.length)} questions · {BLUEPRINT_MINUTES} min · weighted like the official paper
            </span>
          </span>
          <span className="text-ink-faint">→</span>
          </button>
        )}

        {mockMode === 'mock' && (
        <>
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-ink-faint">Shorter / custom papers</p>
        <div className="grid gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => start(p)}
              className="clay-card flex items-center gap-4 p-5 text-left transition-transform hover:-translate-y-0.5"
            >
              <span className="text-3xl">⏱️</span>
              <span className="flex-1">
                <span className="block text-lg font-extrabold text-ink">{p.label}</span>
                <span className="block text-sm text-ink-soft">
                  {Math.min(p.count, QUESTIONS.length)} questions · {p.minutes} min
                </span>
              </span>
              <span className="text-ink-faint">→</span>
            </button>
          ))}
        </div>

        {/* Custom paper builder (组卷) */}
        <div className="clay-soft p-4">
          <button onClick={() => setShowBuilder((v) => !v)} className="flex w-full items-center gap-3 text-left">
            <span className="text-2xl">🛠️</span>
            <span className="flex-1">
              <span className="block font-extrabold text-ink">Custom paper · 组卷</span>
              <span className="block text-sm text-ink-soft">Choose length, time and focus</span>
            </span>
            <span className="text-ink-faint">{showBuilder ? '▾' : '▸'}</span>
          </button>
          {showBuilder && (
            <div className="mt-3 space-y-3 border-t border-line pt-3 animate-pop-in">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">Questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {[10, 20, 30, 40, 58].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBCount(n)}
                      className={`rounded-xl px-3.5 py-1.5 text-sm font-bold transition-all ${
                        bCount === n ? 'bg-brand-600 text-white' : 'bg-surface-2 text-ink-soft'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">Minutes</p>
                <div className="flex flex-wrap gap-1.5">
                  {[15, 30, 45, 60, 120].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBMinutes(n)}
                      className={`rounded-xl px-3.5 py-1.5 text-sm font-bold transition-all ${
                        bMinutes === n ? 'bg-brand-600 text-white' : 'bg-surface-2 text-ink-soft'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">Focus</p>
                <div className="flex gap-1 rounded-xl bg-surface-2 p-1">
                  {([['balanced', 'Balanced'], ['weak', 'Weak spots']] as const).map(([k, lbl]) => (
                    <button
                      key={k}
                      onClick={() => setBFocus(k)}
                      className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${
                        bFocus === k ? 'bg-surface text-brand-600 dark:text-brand-300 shadow-clay-sm' : 'text-ink-soft'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                {bFocus === 'weak' && (
                  <p className="mt-1.5 text-xs text-ink-faint">
                    Weights toward topics you get wrong or haven’t practised yet.
                  </p>
                )}
              </div>
              <button className="btn-primary w-full" onClick={buildCustom}>
                Build paper · 开始组卷
              </button>
            </div>
          )}
        </div>
        </>
        )}

        <p className="rounded-2xl bg-surface-2 px-4 py-3 text-xs font-semibold text-ink-soft">
          Grading: 66% Pass · 80% Merit · 90% Distinction (the ABRSM Grade 5 thresholds).
        </p>
      </div>
    )
  }

  // ---- Done --------------------------------------------------------------
  if (phase === 'done') {
    const score = questions.reduce((n, q, idx) => n + (isCorrect(q, answers[idx]) ? 1 : 0), 0)
    const pct = Math.round((score / questions.length) * 100)
    const tallies = tally(
      questions.map((q, idx) => ({ topic: q.question.topic, correct: isCorrect(q, answers[idx]) })),
    )

    return (
      <div className="space-y-4">
        <div className="clay-card p-8 text-center animate-pop-in">
          <div className="text-5xl">{pct >= 90 ? '🏆' : pct >= 66 ? '🎉' : '💪'}</div>
          <h1 className="mt-3 text-2xl font-black text-ink">Exam finished</h1>
          <div className="mt-3 text-5xl font-black text-brand-600">
            {score}
            <span className="text-2xl text-ink-faint">/{questions.length}</span>
          </div>
          <div className="mt-3 flex justify-center">
            <Grade pct={pct} />
          </div>
          <p className="mt-3 text-sm text-ink-faint">Time used: {fmt(durationSec)}</p>
        </div>

        <TopicBreakdown tallies={tallies} />

        <details className="clay-soft p-5">
          <summary className="cursor-pointer text-lg font-extrabold text-ink">
            Review all answers
          </summary>
          <div className="mt-4 space-y-4">
            {questions.map((q, idx) => (
              <QuestionView
                key={q.question.id}
                prepared={q}
                answer={answers[idx]}
                onChange={() => {}}
                revealed
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

  // ---- Run (exam shell: timed, no per-question feedback) -----------------
  const q = questions[cur]
  const answeredCount = answers.filter((a, idx) => isAnswered(questions[idx].question, a)).length
  const cellState = (idx: number): PaletteCell['state'] =>
    idx === cur
      ? 'current'
      : flags[idx]
      ? 'flagged'
      : isAnswered(questions[idx].question, answers[idx])
      ? 'answered'
      : 'plain'

  return (
    <ExamShell
      timer={fmt(secondsLeft)}
      onPrev={cur > 0 ? () => setCur(cur - 1) : undefined}
      onNext={cur + 1 < questions.length ? () => setCur(cur + 1) : undefined}
      onEnd={() => submit(false)}
      onFlag={() =>
        setFlags((f) => {
          const n = f.slice()
          n[cur] = !n[cur]
          return n
        })
      }
      onClear={() => onChange(blankAnswer(q.question))}
      palette={questions.map((_, idx) => ({
        label: String(idx + 1),
        state: cellState(idx),
        onClick: () => setCur(idx),
      }))}
    >
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>{mockMode === 'exam' ? '真题模拟 · Real exam' : 'Mock exam'}</span>
        <span className="tabular-nums opacity-70">
          {answeredCount}/{questions.length} answered · Q{cur + 1}/{questions.length}
        </span>
      </div>

      <ExamQuestion prepared={q} answer={answers[cur]} onChange={onChange} revealed={false} examMode />

      <button
        onClick={() => submit(false)}
        className="rounded-md bg-rose-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
      >
        Submit exam
      </button>
    </ExamShell>
  )
}
