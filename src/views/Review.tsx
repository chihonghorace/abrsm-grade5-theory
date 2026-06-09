import { useMemo, useState } from 'react'
import type { ProgressApi } from '../lib/storage'
import type { PracticePool } from '../lib/nav'
import { bookmarkedQuestions, needsWork, prepareMany } from '../lib/quiz'
import QuestionCard from '../components/QuestionCard'

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

  // Prepare once per (tab, id-set) so choices don't reshuffle on every render.
  const ids = list.map((q) => q.id).join(',')
  const prepared = useMemo(() => prepareMany(list), [ids]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-slate-800">Review</h1>
        <p className="text-slate-500">Revisit the questions you missed or bookmarked.</p>
      </header>

      <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
        <TabButton active={tab === 'work'} onClick={() => setTab('work')}>
          💪 Needs work ({work.length})
        </TabButton>
        <TabButton active={tab === 'bookmarks'} onClick={() => setTab('bookmarks')}>
          🔖 Bookmarks ({bookmarks.length})
        </TabButton>
      </div>

      {list.length === 0 ? (
        <div className="clay-card p-8 text-center">
          <div className="text-4xl">{tab === 'work' ? '🎯' : '🔖'}</div>
          <p className="mt-3 font-bold text-slate-700">
            {tab === 'work' ? 'No missed questions — nice!' : 'No bookmarks yet.'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
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
              <QuestionCard
                key={p.question.id}
                prepared={p}
                selected={null}
                revealed
                onSelect={() => {}}
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
        active ? 'bg-white text-brand-700 shadow-clay-sm' : 'text-slate-500'
      }`}
    >
      {children}
    </button>
  )
}
