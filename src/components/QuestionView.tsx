import type { FillQuestion, MultiQuestion } from '../types'
import { questionType } from '../types'
import type { Prepared } from '../lib/quiz'
import type { Answer } from '../lib/answer'
import { isCorrect } from '../lib/answer'
import { TOPIC_BY_ID } from '../data/topics'
import Notation from './Notation'

interface Props {
  prepared: Prepared
  answer: Answer
  onChange: (a: Answer) => void
  revealed: boolean
  bookmarked: boolean
  onToggleBookmark: () => void
  index?: number
  total?: number
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`Difficulty ${level}/3`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={`h-1.5 w-1.5 rounded-full ${n <= level ? 'bg-brand-500' : 'bg-line'}`} />
      ))}
    </span>
  )
}

export default function QuestionView({
  prepared,
  answer,
  onChange,
  revealed,
  bookmarked,
  onToggleBookmark,
  index,
  total,
}: Props) {
  const q = prepared.question
  // Past-paper questions may carry a topic that isn't one of the nine study
  // topics, so fall back to a generic label instead of crashing.
  const topic = TOPIC_BY_ID[q.topic]
  const topicIcon = topic?.icon ?? '🎼'
  const topicTitle = topic?.title ?? q.topic
  const correct = revealed && isCorrect(prepared, answer)

  return (
    <div className="clay-card p-5 sm:p-6 animate-pop-in">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="chip bg-brand-500/12 text-brand-600 dark:text-brand-300">
          <span aria-hidden>{topicIcon}</span>
          {topicTitle}
        </span>
        <div className="flex items-center gap-3">
          {typeof index === 'number' && typeof total === 'number' && (
            <span className="text-xs font-bold text-ink-faint tabular-nums">
              {index + 1} / {total}
            </span>
          )}
          <DifficultyDots level={q.difficulty} />
          <button
            onClick={onToggleBookmark}
            className="text-xl leading-none transition-transform active:scale-90"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this question'}
            title={bookmarked ? 'Bookmarked' : 'Bookmark'}
          >
            {bookmarked ? '🔖' : '🏷️'}
          </button>
        </div>
      </div>

      <p className="text-lg font-bold leading-snug text-ink">{q.prompt}</p>

      {q.abc && (
        <div className="paper my-4 px-3 py-2">
          <Notation abc={q.abc} scale={1.4} />
        </div>
      )}

      {q.imageSrc && (
        <div className="paper my-4 px-3 py-2">
          <img
            src={q.imageSrc}
            alt="Notation excerpt for this question"
            className="mx-auto max-h-80 w-full max-w-full object-contain"
          />
        </div>
      )}

      {questionType(q) === 'fill' ? (
        <FillBody q={q as FillQuestion} value={answer as string[]} revealed={revealed} onChange={onChange} />
      ) : questionType(q) === 'multi' ? (
        <MultiBody
          q={q as MultiQuestion}
          options={prepared.multiOptions ?? (q as MultiQuestion).options}
          value={answer as (string | null)[]}
          revealed={revealed}
          onChange={onChange}
        />
      ) : (
        <MCBody prepared={prepared} value={answer as number | null} revealed={revealed} onSelect={onChange} />
      )}

      {revealed && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold animate-pop-in ${
            correct
              ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : 'border-amber-400/30 bg-amber-500/10 text-amber-800 dark:text-amber-200'
          }`}
        >
          <span className="mr-1">{correct ? '🎉 Correct!' : '💡 Not quite.'}</span>
          {q.explanation}
        </div>
      )}
    </div>
  )
}

// ---- MC (text choices, notation choices, or true/false) -------------------
function MCBody({
  prepared,
  value,
  revealed,
  onSelect,
}: {
  prepared: Prepared
  value: number | null
  revealed: boolean
  onSelect: (i: number) => void
}) {
  const mc = prepared.mc!
  const answer = mc.answer

  function cls(i: number): string {
    const base = 'w-full text-left rounded-2xl border px-4 py-3 font-semibold transition-all flex items-start gap-3'
    if (!revealed) {
      return `${base} ${
        value === i
          ? 'border-brand-400 bg-brand-500/10 dark:bg-brand-500/20 text-ink ring-2 ring-brand-400/40'
          : 'border-line bg-surface text-ink hover:border-brand-300 hover:bg-brand-500/5 active:scale-[0.99]'
      }`
    }
    if (i === answer) return `${base} border-emerald-400 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300`
    if (i === value) return `${base} border-rose-400 bg-rose-500/12 text-rose-700 dark:text-rose-300`
    return `${base} border-line bg-surface text-ink-soft opacity-60`
  }

  return (
    <div className="mt-4 grid gap-2.5 stagger">
      {mc.choices.map((choice, i) => (
        <button
          key={i}
          style={{ ['--i' as string]: i }}
          onClick={() => !revealed && onSelect(i)}
          disabled={revealed}
          className={cls(i)}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg text-sm font-extrabold ${
              revealed && i === answer
                ? 'bg-emerald-500 text-white'
                : revealed && i === value
                ? 'bg-rose-500 text-white'
                : 'bg-surface-2 text-ink-soft'
            }`}
          >
            {revealed && i === answer ? '✓' : revealed && i === value ? '✕' : LETTERS[i]}
          </span>
          {mc.choicesAbc?.[i] ? (
            <span className="flex flex-col gap-1 pt-0.5">
              <span className="paper px-2 py-1">
                <Notation abc={mc.choicesAbc[i]!} scale={1.2} />
              </span>
              <span className="text-xs text-ink-soft">{choice}</span>
            </span>
          ) : (
            <span className="pt-0.5">{choice}</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ---- Fill in the blank(s) -------------------------------------------------
function FillBody({
  q,
  value,
  revealed,
  onChange,
}: {
  q: FillQuestion
  value: string[]
  revealed: boolean
  onChange: (a: string[]) => void
}) {
  const v = value ?? q.blanks.map(() => '')
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
  return (
    <div className="mt-4 space-y-3">
      {q.blanks.map((b, i) => {
        const ok = [b.answer, ...(b.alt ?? [])].map(norm).includes(norm(v[i] ?? ''))
        return (
          <div key={i} className="flex flex-wrap items-center gap-2 text-ink">
            {b.prefix && <span className="font-semibold">{b.prefix}</span>}
            <input
              value={v[i] ?? ''}
              disabled={revealed}
              onChange={(e) => {
                const next = v.slice()
                next[i] = e.target.value
                onChange(next)
              }}
              inputMode="text"
              className={`w-28 rounded-xl border bg-surface px-3 py-2 text-center font-bold text-ink outline-none transition-all focus:ring-2 focus:ring-brand-400 ${
                revealed
                  ? ok
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-rose-400 bg-rose-500/10'
                  : 'border-line'
              }`}
            />
            {b.suffix && <span className="font-semibold">{b.suffix}</span>}
            {revealed && !ok && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">→ {b.answer}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---- Multi: a labelled item per row, each a dropdown ----------------------
function MultiBody({
  q,
  options,
  value,
  revealed,
  onChange,
}: {
  q: MultiQuestion
  options: string[]
  value: (string | null)[]
  revealed: boolean
  onChange: (a: (string | null)[]) => void
}) {
  const v = value ?? q.items.map(() => null)
  return (
    <div className="mt-4 space-y-2.5">
      {q.items.map((it, i) => {
        const ok = v[i] === it.answer
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="w-16 flex-none font-bold text-ink">{it.label}</span>
            <select
              value={v[i] ?? ''}
              disabled={revealed}
              onChange={(e) => {
                const next = v.slice()
                next[i] = e.target.value || null
                onChange(next)
              }}
              className={`flex-1 rounded-xl border bg-surface px-3 py-2 font-semibold text-ink outline-none transition-all focus:ring-2 focus:ring-brand-400 ${
                revealed ? (ok ? 'border-emerald-400' : 'border-rose-400') : 'border-line'
              }`}
            >
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {revealed && !ok && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">{it.answer}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
