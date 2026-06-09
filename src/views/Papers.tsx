import { useEffect, useRef, useState } from 'react'
import type { Paper, TopicId } from '../types'
import type { ProgressApi } from '../lib/storage'
import { PAPERS } from '../data/papers'
import { prepareMany, type Prepared } from '../lib/quiz'
import { blankAnswer, isCorrect, type Answer } from '../lib/answer'
import { tally } from '../lib/stats'
import ExamShell, { type PaletteCell } from '../components/exam/ExamShell'
import ExamQuestion from '../components/exam/ExamQuestion'
import TopicBreakdown from '../components/TopicBreakdown'
import { Grade } from './Home'

interface Props {
  api: ProgressApi
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Papers({ api }: Props) {
  const [phase, setPhase] = useState<'pick' | 'run' | 'done'>('pick')
  const [paper, setPaper] = useState<Paper | null>(null)
  const [questions, setQuestions] = useState<Prepared[]>([])
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState<Answer>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [marks, setMarks] = useState<{ topic: TopicId; correct: boolean }[]>([])
  const [flags, setFlags] = useState<boolean[]>([])
  const [elapsed, setElapsed] = useState(0)
  const startedAt = useRef(0)

  // Count-up exam timer while a paper is in progress.
  useEffect(() => {
    if (phase !== 'run') return
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000)
    return () => clearInterval(id)
  }, [phase])

  function start(p: Paper) {
    // Keep the paper's own question order (it's a real exam); prepare() still
    // shuffles each MC's choices so position never leaks the answer.
    const qs = prepareMany(p.questions)
    setPaper(p)
    setQuestions(qs)
    setI(0)
    setAnswer(qs.length ? blankAnswer(qs[0].question) : null)
    setRevealed(false)
    setCorrect(0)
    setMarks([])
    setFlags(new Array(qs.length).fill(false))
    setElapsed(0)
    startedAt.current = Date.now()
    setPhase('run')
  }

  function reveal(a: Answer) {
    if (revealed) return
    const ok = isCorrect(questions[i], a)
    setRevealed(true)
    if (ok) setCorrect((n) => n + 1)
    setMarks((m) => [...m, { topic: questions[i].question.topic, correct: ok }])
    api.recordAttempt(questions[i].question.id, ok)
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

  // ---- Pick a paper (or empty-state setup instructions) ------------------
  if (phase === 'pick') {
    return (
      <div className="space-y-4">
        <header className="pt-2">
          <h1 className="text-2xl font-black text-ink">Past papers · 真题</h1>
          <p className="text-ink-soft">
            Work through a real exam paper question by question, with instant feedback.
          </p>
        </header>

        {PAPERS.length === 0 ? (
          // The "how to add a paper" instructions are author-only and reference local,
          // copyright material — keep them OUT of the published build. `import.meta.env.DEV`
          // is statically false in production, so Vite drops this whole branch (and its
          // strings) from the public bundle. Visitors just see the neutral message below.
          import.meta.env.DEV ? (
            <div className="clay-card p-6">
              <div className="text-4xl">📄</div>
              <p className="mt-3 font-bold text-ink">No local papers yet.</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Past papers stay on <span className="font-semibold">your machine only</span> and are
                never published (copyright). To turn one of your own downloaded PDFs into practice
                questions, run:
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 text-xs font-semibold text-ink-soft">
{`npm run questions:extract -- \\
  --pdf "path/to/your-paper.pdf" \\
  --id my-paper \\
  --title "My paper"`}
              </pre>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Review the generated <span className="font-semibold">data/papers/&lt;id&gt;.json</span>{' '}
                (fix anything the model got wrong), then reopen this tab.
              </p>
            </div>
          ) : (
            <div className="clay-card p-8 text-center">
              <div className="text-4xl">📄</div>
              <p className="mt-3 font-bold text-ink">No papers available.</p>
              <p className="mt-2 text-sm text-ink-soft">
                Head to Practice or Mock exam from the top menu to keep revising.
              </p>
            </div>
          )
        ) : (
          <div className="grid gap-3">
            {PAPERS.map((p) => (
              <button
                key={p.id}
                onClick={() => start(p)}
                className="clay-soft flex items-center gap-4 p-4 text-left transition-transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">📝</span>
                <span className="flex-1">
                  <span className="block font-extrabold text-ink">{p.title}</span>
                  {p.source && <span className="block text-xs text-ink-faint">{p.source}</span>}
                </span>
                <span className="chip bg-surface-2 text-ink-soft">{p.questions.length} Q</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ---- Done --------------------------------------------------------------
  if (phase === 'done') {
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0
    return (
      <div className="space-y-4">
        <div className="clay-card p-8 text-center animate-pop-in">
          <div className="text-5xl">{pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪'}</div>
          <h1 className="mt-3 text-2xl font-black text-ink">Paper complete!</h1>
          <p className="mt-1 text-ink-soft">{paper?.title}</p>
          <div className="mt-4 text-5xl font-black text-brand-600 dark:text-brand-300">
            {correct}
            <span className="text-2xl text-ink-faint">/{questions.length}</span>
          </div>
          <div className="mt-3 flex justify-center">
            <Grade pct={pct} />
          </div>
          <p className="mt-3 text-sm text-ink-faint">Time used: {fmt(elapsed)}</p>
        </div>

        <TopicBreakdown tallies={tally(marks)} />

        <div className="grid grid-cols-2 gap-3">
          <button className="btn-primary" onClick={() => paper && start(paper)}>
            ↻ Again
          </button>
          <button className="btn-ghost" onClick={() => setPhase('pick')}>
            Choose paper
          </button>
        </div>
      </div>
    )
  }

  // ---- Run (exam shell) --------------------------------------------------
  const current = questions[i]
  const cellState = (idx: number): PaletteCell['state'] =>
    idx === i ? 'current' : flags[idx] ? 'flagged' : idx < i ? 'answered' : 'plain'

  return (
    <ExamShell
      timer={fmt(elapsed)}
      onEnd={() => setPhase('pick')}
      onNext={revealed ? next : undefined}
      onFlag={() =>
        setFlags((f) => {
          const n = f.slice()
          n[i] = !n[i]
          return n
        })
      }
      onClear={() => {
        if (!revealed) setAnswer(blankAnswer(current.question))
      }}
      palette={questions.map((_, idx) => ({ label: String(idx + 1), state: cellState(idx) }))}
    >
      <ExamQuestion
        prepared={current}
        answer={answer}
        onChange={(a) => !revealed && setAnswer(a)}
        revealed={revealed}
        onAnswer={() => reveal(answer)}
      />
      {revealed && (
        <button
          onClick={next}
          className="rounded-md bg-rose-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          {i + 1 < questions.length ? 'Continue' : 'See results'}
        </button>
      )}
    </ExamShell>
  )
}
