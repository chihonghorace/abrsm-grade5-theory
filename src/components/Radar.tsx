import type { TopicStat } from '../lib/stats'

/**
 * Hand-rolled SVG radar of per-topic accuracy (no chart library). Each axis is
 * a study topic; the filled polygon is the learner's accuracy on each.
 */
export default function Radar({ stats, size = 280 }: { stats: TopicStat[]; size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 32 // leave room for the icon labels
  const n = stats.length
  const ang = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2
  const at = (i: number, f: number): [number, number] => [
    cx + Math.cos(ang(i)) * r * f,
    cy + Math.sin(ang(i)) * r * f,
  ]
  const ringPoints = (f: number) => stats.map((_, i) => at(i, f).join(',')).join(' ')
  const dataPoints = stats.map((s, i) => at(i, Math.max(0.02, s.accuracy)).join(',')).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-auto w-full max-w-[18rem]" role="img" aria-label="Per-topic accuracy radar">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ringPoints(f)} fill="none" stroke="currentColor" className="text-line" strokeWidth={1} />
      ))}
      {stats.map((_, i) => {
        const [x, y] = at(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" className="text-line" strokeWidth={1} />
      })}
      <polygon points={dataPoints} fill="#6b66f7" fillOpacity={0.25} stroke="#6b66f7" strokeWidth={2} strokeLinejoin="round" />
      {stats.map((s, i) => {
        const [x, y] = at(i, Math.max(0.02, s.accuracy))
        return <circle key={i} cx={x} cy={y} r={3} fill="#6b66f7" />
      })}
      {stats.map((s, i) => {
        const [x, y] = at(i, 1.14)
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={15} aria-hidden>
            {s.icon}
          </text>
        )
      })}
    </svg>
  )
}
