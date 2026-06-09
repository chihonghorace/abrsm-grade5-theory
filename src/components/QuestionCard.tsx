import type { Prepared } from '../lib/quiz'
import { TOPIC_BY_ID } from '../data/topics'
import Notation from './Notation'

interface Props {
  prepared: Prepared
  /** Index (within shuffled choices) the learner picked, or null. */
  selected: number | null
  /** When true, show which answer was right/wrong and the explanation. */
  revealed: boolean
  onSelect: (choiceIndex: number) => void
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
        <span
          key={n}
          className={`h-1.5 w-1.5 rounded-full ${n <= level ? 'bg-brand-500' : 'bg-slate-200'}`}
        />
      ))}
    </span>
  )
}

export default function QuestionCard({
  prepared,
  selected,
  revealed,
  onSelect,
  bookmarked,
  onToggleBookmark,
  index,
  total,
}: Props) {
  const { question, choices, answer } = prepared
  const topic = TOPIC_BY_ID[question.topic]

  function choiceClasses(i: number): string {
    const base =
      'w-full text-left rounded-2xl border px-4 py-3 font-semibold transition-all flex items-start gap-3'
    if (!revealed) {
      return `${base} ${
        selected === i
          ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-200'
          : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/40'
      }`
    }
    // revealed
    if (i === answer) return `${base} border-emerald-300 bg-emerald-50 text-emerald-900`
    if (i === selected) return `${base} border-rose-300 bg-rose-50 text-rose-900`
    return `${base} border-slate-200 bg-white opacity-60`
  }

  return (
    <div className="clay-card p-5 sm:p-6 animate-pop-in">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="chip bg-brand-50 text-brand-700">
          <span aria-hidden>{topic.icon}</span>
          {topic.title}
        </span>
        <div className="flex items-center gap-3">
          {typeof index === 'number' && typeof total === 'number' && (
            <span className="text-xs font-bold text-slate-400">
              {index + 1} / {total}
            </span>
          )}
          <DifficultyDots level={question.difficulty} />
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

      <p className="text-lg font-bold leading-snug text-slate-800">{question.prompt}</p>

      {question.abc && (
        <div className="my-4 rounded-2xl bg-slate-50 px-3 py-2">
          <Notation abc={question.abc} scale={1.4} />
        </div>
      )}

      <div className="mt-4 grid gap-2.5">
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => !revealed && onSelect(i)}
            disabled={revealed}
            className={choiceClasses(i)}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg text-sm font-extrabold ${
                revealed && i === answer
                  ? 'bg-emerald-500 text-white'
                  : revealed && i === selected
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {revealed && i === answer ? '✓' : revealed && i === selected ? '✕' : LETTERS[i]}
            </span>
            <span className="pt-0.5">{choice}</span>
          </button>
        ))}
      </div>

      {revealed && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold animate-pop-in ${
            selected === answer
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <span className="mr-1">{selected === answer ? '🎉 Correct!' : '💡 Not quite.'}</span>
          {question.explanation}
        </div>
      )}
    </div>
  )
}
