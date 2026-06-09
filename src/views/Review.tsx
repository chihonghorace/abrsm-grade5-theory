import { useMemo, useState } from 'react'
import type { ProgressApi } from '../lib/storage'
import type { PracticePool } from '../lib/nav'
import { bookmarkedQuestions, needsWork, prepareMany } from '../lib/quiz'
import { blankAnswer } from '../lib/answer'
import { TOPIC_BY_ID } from '../data/topics'
import QuestionView from '../components/QuestionView'

interface Props {
  api: ProgressApi
  startPractice: (pool: PracticePool) => void
}

export default function Review({ api, startPractice }: Props) {
  const [tab, setTab] = useState<'work' | 'bookmarks'>('work')
  const { progress } = api

  const work = needsWork(progress)
  const bookmarks = bookmarkedQuestions(progress)
  const list = tab === 'work' ? work : bookmarks

  // Mistakes grouped by topic (most-missed first) — the "错题本" categorisation.
  const byTopic = new Map<string, number>()
  for (const q of work) byTopic.set(q.topic, (byTopic.get(q.topic) ?? 0) + 1)
  const dist = [...byTopic.entries()].sort((a, b) => b[1] - a[1])

  // Prepare once per (tab, id-set) so choices don't reshuffle on every render.
  const ids = list.map((q) => q.id).join(',')
  const prepared = useMemo(() => prepareMany(list), [ids]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-ink">Review</h1>
        <p className="text-ink-soft">Revisit the questions you missed or bookmarked.</p>
      </header>

      <div className="flex gap-2 rounded-2xl bg-surface-2 p-1">
        <TabButton active={tab === 'work'} onClick={() => setTab('work')}>
          💪 Needs work ({work.length})
        </TabButton>
        <TabButton active={tab === 'bookmarks'} onClick={() => setTab('bookmarks')}>
          🔖 Bookmarks ({bookmarks.length})
        </TabButton>
      </div>

      {tab === 'work' && dist.length > 0 && (
        <div className="clay-soft p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">Mistakes by topic</p>
          <div className="flex flex-wrap gap-1.5">
            {dist.map(([t, n]) => {
              const topic = TOPIC_BY_ID[t as keyof typeof TOPIC_BY_ID]
              return (
                <span key={t} className="chip bg-surface-2 text-ink-soft">
                  {topic?.icon ?? '🎼'} {topic?.title ?? t} · {n}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="clay-card p-8 text-center">
          <div className="text-4xl">{tab === 'work' ? '🎯' : '🔖'}</div>
          <p className="mt-3 font-bold text-ink">
            {tab === 'work' ? 'No missed questions — nice!' : 'No bookmarks yet.'}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {tab === 'work'
              ? 'Answers you get wrong in Practice or a Mock will appear here.'
              : 'Tap the 🏷️ on any question to save it for later.'}
          </p>
        </div>
      ) : (
        <>
          <button
            className="btn-primary w-full"
            onClick={() =>
              startPractice({
                kind: 'ids',
                ids: list.map((q) => q.id),
                label: tab === 'work' ? 'Needs work' : 'Bookmarks',
              })
            }
          >
            ✏️ Practise these {list.length} questions
          </button>
          <div className="space-y-4">
            {prepared.map((p) => (
              <QuestionView
                key={p.question.id}
                prepared={p}
                answer={blankAnswer(p.question)}
                onChange={() => {}}
                revealed
                bookmarked={progress.bookmarks.includes(p.question.id)}
                onToggleBookmark={() => api.toggleBookmark(p.question.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
        active ? 'bg-surface text-brand-700 shadow-clay-sm' : 'text-ink-soft'
      }`}
    >
      {children}
    </button>
  )
}
