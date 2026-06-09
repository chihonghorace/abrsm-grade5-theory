import type { ProgressApi } from '../lib/storage'
import type { PracticePool, View } from '../lib/nav'
import { QUESTIONS } from '../data/questions'
import { needsWork } from '../lib/quiz'

interface Props {
  api: ProgressApi
  goTo: (view: View) => void
  startPractice: (pool: PracticePool) => void
}

export default function Home({ api, goTo, startPractice }: Props) {
  const { progress } = api

  const answered = Object.keys(progress.attempts).length
  const totals = Object.values(progress.attempts).reduce(
    (acc, a) => ({ seen: acc.seen + a.seen, correct: acc.correct + a.correct }),
    { seen: 0, correct: 0 },
  )
  const accuracy = totals.seen ? Math.round((totals.correct / totals.seen) * 100) : 0
  const coverage = Math.round((answered / QUESTIONS.length) * 100)
  const toReview = needsWork(progress).length
  const bestMock = progress.mockHistory.reduce(
    (best, m) => Math.max(best, Math.round((m.score / m.total) * 100)),
    0,
  )

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-500">ABRSM · Grade 5</p>
        <h1 className="mt-1 text-3xl font-black leading-tight text-ink">Music Theory Trainer</h1>
        <p className="mt-1 text-ink-soft">Study the topics, practise with instant feedback, then sit a timed mock.</p>
      </header>

      {/* Progress ring + headline stats */}
      <section className="clay-card p-5">
        <div className="flex items-center gap-5">
          <ProgressRing percent={coverage} />
          <div className="grid flex-1 grid-cols-2 gap-3">
            <Stat label="Accuracy" value={`${accuracy}%`} />
            <Stat label="Answered" value={`${answered}/${QUESTIONS.length}`} />
            <Stat label="To review" value={String(toReview)} accent={toReview > 0} />
            <Stat label="Best mock" value={bestMock ? `${bestMock}%` : '—'} />
          </div>
        </div>
      </section>

      {/* Primary actions */}
      <section className="grid grid-cols-2 gap-3">
        <ActionCard
          icon="📚"
          title="Learn"
          subtitle="9 revision topics"
          onClick={() => goTo('learn')}
        />
        <ActionCard
          icon="✏️"
          title="Practice"
          subtitle="Instant feedback"
          onClick={() => goTo('practice')}
        />
        <ActionCard
          icon="⏱️"
          title="Mock exam"
          subtitle="Timed & scored"
          onClick={() => goTo('mock')}
        />
        <ActionCard
          icon="🔁"
          title="Review"
          subtitle={toReview ? `${toReview} need work` : 'Bookmarks & misses'}
          onClick={() => goTo('review')}
          accent={toReview > 0}
        />
      </section>

      {/* Quick start */}
      <section className="clay-soft p-5">
        <h2 className="mb-1 text-lg font-extrabold text-ink">Jump straight in</h2>
        <p className="mb-3 text-sm text-ink-soft">A quick mixed set across every topic.</p>
        <button
          className="btn-primary w-full"
          onClick={() => startPractice({ kind: 'topic', topic: 'all', label: 'Mixed (20)', limit: 20 })}
        >
          ✨ Start mixed practice
        </button>
      </section>

      {/* Recent mocks */}
      {progress.mockHistory.length > 0 && (
        <section className="clay-soft p-5">
          <h2 className="mb-3 text-lg font-extrabold text-ink">Recent mock exams</h2>
          <ul className="space-y-2">
            {progress.mockHistory.slice(0, 5).map((m, i) => {
              const pct = Math.round((m.score / m.total) * 100)
              return (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2 text-sm"
                >
                  <span className="text-ink-soft">{new Date(m.date).toLocaleDateString()}</span>
                  <span className="font-bold text-ink">
                    {m.score}/{m.total}
                  </span>
                  <Grade pct={pct} />
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl px-3 py-2 ${accent ? 'bg-amber-50' : 'bg-surface-2'}`}>
      <div className={`text-xl font-black ${accent ? 'text-amber-600' : 'text-ink'}`}>{value}</div>
      <div className="text-xs font-bold uppercase tracking-wide text-ink-faint">{label}</div>
    </div>
  )
}

function ActionCard({
  icon,
  title,
  subtitle,
  onClick,
  accent,
}: {
  icon: string
  title: string
  subtitle: string
  onClick: () => void
  accent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`clay-card flex flex-col items-start gap-1 p-5 text-left transition-transform active:scale-[0.98] hover:-translate-y-0.5 ${
        accent ? 'ring-2 ring-amber-200' : ''
      }`}
    >
      <span className="text-3xl">{icon}</span>
      <span className="mt-1 text-lg font-extrabold text-ink">{title}</span>
      <span className="text-xs font-semibold text-ink-faint">{subtitle}</span>
    </button>
  )
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  const offset = c - (percent / 100) * c
  return (
    <div className="relative h-24 w-24 flex-none">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-line" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#6b66f7"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-ink">{percent}%</span>
        <span className="text-[10px] font-bold uppercase text-ink-faint">seen</span>
      </div>
    </div>
  )
}

export function Grade({ pct }: { pct: number }) {
  // ABRSM Grade 5 theory: pass 66%, merit 80%, distinction 90% (out of 100).
  const { label, cls } =
    pct >= 90
      ? { label: 'Distinction', cls: 'bg-violet-100 text-violet-700' }
      : pct >= 80
      ? { label: 'Merit', cls: 'bg-emerald-100 text-emerald-700' }
      : pct >= 66
      ? { label: 'Pass', cls: 'bg-sky-100 text-sky-700' }
      : { label: 'Keep going', cls: 'bg-rose-100 text-rose-700' }
  return <span className={`chip ${cls}`}>{pct}% · {label}</span>
}
