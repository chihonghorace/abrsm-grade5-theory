import { useState } from 'react'
import type { Paper } from '../types'
import type { ProgressApi } from '../lib/storage'
import { PAPERS } from '../data/papers'
import { prepareMany, type Prepared } from '../lib/quiz'
import { blankAnswer, isAnswered, isCorrect, revealsOnChange, type Answer } from '../lib/answer'
import QuestionView from '../components/QuestionView'
import { Grade } from './Home'

interface Props {
  api: ProgressApi
}

export default function Papers({ api }: Props) {
  const [phase, setPhase] = useState<'pick' | 'run' | 'done'>('pick')
  const [paper, setPaper] = useState<Paper | null>(null)
  const [questions, setQuestions] = useState<Prepared[]>([])
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState<Answer>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [answered, setAnswered] = useState(0)

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
          <div className="clay-card p-6">
            <div className="text-4xl">📄</div>
            <p className="mt-3 font-bold text-ink">No local papers yet.</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Past papers stay on <span className="font-semibold">your machine only</span> — ABRSM
              papers are copyright and are never published. To turn one of your own downloaded PDFs
              into practice questions, run:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 text-xs font-semibold text-ink-soft">
{`npm run questions:extract -- \\
  --pdf "ABRSM 官网材料/music-theory-grade-5-sample-paper-200722.pdf" \\
  --id grade5-2020-sample \\
  --title "Grade 5 — 2020 sample paper"`}
            </pre>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Review the generated <span className="font-semibold">data/papers/&lt;id&gt;.json</span>{' '}
              (fix anything the model got wrong), then reopen this tab.
            </p>
          </div>
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
        </div>
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

  // ---- Run ---------------------------------------------------------------
  const current = questions[i]
  const needsCheck = !revealed && !revealsOnChange(current.question)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-1">
        <button className="chip bg-surface-2 text-ink-soft" onClick={() => setPhase('pick')}>
          ← {paper?.title}
        </button>
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
