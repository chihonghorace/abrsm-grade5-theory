import { TOPIC_BY_ID } from '../data/topics'
import type { TopicTally } from '../lib/stats'

/**
 * Per-topic correct/total bars for a finished session (mock, paper or practice).
 * Pass the result of `tally(marks)`. Renders nothing for an empty list.
 */
export default function TopicBreakdown({
  tallies,
  title = 'By topic',
}: {
  tallies: TopicTally[]
  title?: string
}) {
  if (tallies.length === 0) return null
  return (
    <div className="clay-soft p-5">
      <h2 className="mb-3 text-lg font-extrabold text-ink">{title}</h2>
      <ul className="space-y-2.5">
        {tallies.map((e) => {
          const topic = TOPIC_BY_ID[e.topic]
          const icon = topic?.icon ?? '🎼'
          const name = topic?.title ?? e.topic
          const w = Math.round((e.correct / e.total) * 100)
          return (
            <li key={e.topic}>
              <div className="mb-1 flex items-center justify-between text-sm font-bold text-ink-soft">
                <span>
                  {icon} {name}
                </span>
                <span className="tabular-nums">
                  {e.correct}/{e.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
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
  )
}
