import type { ProgressApi } from '../lib/storage'
import type { PracticePool } from '../lib/nav'
import { topicStats, weakAreaIds } from '../lib/stats'
import Radar from '../components/Radar'

interface Props {
  api: ProgressApi
  startPractice: (pool: PracticePool) => void
}

export default function Stats({ api, startPractice }: Props) {
  const { progress } = api
  const stats = topicStats(progress)
  const totalSeen = stats.reduce((n, s) => n + s.seen, 0)
  const totalCorrect = stats.reduce((n, s) => n + s.correct, 0)
  const overall = totalSeen ? Math.round((totalCorrect / totalSeen) * 100) : 0
  // Weakest practised topics drive the "practise weak spots" suggestion.
  const ranked = [...stats].sort((a, b) => {
    const pa = a.seen ? a.accuracy : 1.1 // unseen sinks to the bottom of "weakest"
    const pb = b.seen ? b.accuracy : 1.1
    return pa - pb
  })

  if (totalSeen === 0) {
    return (
      <div className="space-y-4">
        <header className="pt-2">
          <h1 className="text-2xl font-black text-ink">Stats · 报表</h1>
          <p className="text-ink-soft">Your accuracy across all nine topics, at a glance.</p>
        </header>
        <div className="clay-card p-8 text-center">
          <div className="text-4xl">📊</div>
          <p className="mt-3 font-bold text-ink">No data yet.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Answer some questions in Practice or a Mock and your topic radar appears here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-ink">Stats · 报表</h1>
        <p className="text-ink-soft">Accuracy by topic — find your weak spots and drill them.</p>
      </header>

      <section className="clay-card p-5">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold text-ink">Knowledge-point accuracy</h2>
          <span className="text-sm font-bold text-ink-soft">Overall {overall}%</span>
        </div>
        <Radar stats={stats} />
      </section>

      <section className="clay-soft p-5">
        <h2 className="mb-3 text-lg font-extrabold text-ink">By topic (weakest first)</h2>
        <ul className="space-y-2.5">
          {ranked.map((s) => {
            const pct = Math.round(s.accuracy * 100)
            return (
              <li key={s.id}>
                <div className="mb-1 flex items-center justify-between text-sm font-bold text-ink-soft">
                  <span>
                    {s.icon} {s.title}
                  </span>
                  <span className="tabular-nums">
                    {s.seen === 0 ? 'not practised' : `${pct}% · ${s.correct}/${s.seen}`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={`h-full rounded-full ${
                      s.seen === 0 ? 'bg-line' : pct >= 80 ? 'bg-emerald-400' : pct >= 66 ? 'bg-sky-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${s.seen === 0 ? 0 : Math.max(4, pct)}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <button
        className="btn-primary w-full"
        onClick={() => startPractice({ kind: 'ids', ids: weakAreaIds(progress, 20), label: 'Weak spots · 弱项练习' })}
      >
        🎯 Practise my weak spots (20)
      </button>
    </div>
  )
}
