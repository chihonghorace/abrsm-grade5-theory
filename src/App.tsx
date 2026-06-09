import { useState } from 'react'
import type { PracticePool, View } from './lib/nav'
import { useProgress } from './lib/storage'
import { useTheme } from './lib/theme'
import Home from './views/Home'
import Learn from './views/Learn'
import Practice from './views/Practice'
import Mock from './views/Mock'
import Review from './views/Review'

const NAV: { view: View; icon: string; label: string }[] = [
  { view: 'home', icon: '🏠', label: 'Home' },
  { view: 'learn', icon: '📚', label: 'Learn' },
  { view: 'practice', icon: '✏️', label: 'Practice' },
  { view: 'mock', icon: '⏱️', label: 'Mock' },
  { view: 'review', icon: '🔁', label: 'Review' },
]

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export default function App() {
  const api = useProgress()
  const { theme, toggle } = useTheme()
  const [view, setView] = useState<View>('home')
  const [pool, setPool] = useState<PracticePool | null>(null)
  // Bumped to force the Practice view to remount (fresh session) on each entry.
  const [practiceKey, setPracticeKey] = useState(0)

  function goTo(next: View) {
    if (next === 'practice') {
      setPool(null)
      setPracticeKey((k) => k + 1)
    }
    setView(next)
  }

  function startPractice(p: PracticePool) {
    setPool(p)
    setPracticeKey((k) => k + 1)
    setView('practice')
  }

  function reset() {
    if (confirm('Reset all progress, bookmarks and mock history? This cannot be undone.')) {
      api.resetAll()
      setView('home')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 pt-4">
        <button
          onClick={() => goTo('home')}
          className="flex items-center gap-2 text-lg font-black text-brand-600 dark:text-brand-300"
        >
          <span aria-hidden>🎼</span>
          <span>Grade 5 Theory</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-2 hover:text-brand-500 active:scale-90"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={reset}
            className="rounded-full px-3 py-1 text-xs font-bold text-ink-faint transition-colors hover:bg-rose-500/10 hover:text-rose-500"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-28 pt-3">
        {view === 'home' && <Home api={api} goTo={goTo} startPractice={startPractice} />}
        {view === 'learn' && <Learn startPractice={startPractice} />}
        {view === 'practice' && <Practice key={practiceKey} api={api} pool={pool} />}
        {view === 'mock' && <Mock api={api} />}
        {view === 'review' && <Review api={api} startPractice={startPractice} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
          {NAV.map((item) => {
            const active = view === item.view
            return (
              <button
                key={item.view}
                onClick={() => goTo(item.view)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-colors ${
                  active ? 'text-brand-600 dark:text-brand-300' : 'text-ink-faint'
                }`}
              >
                <span
                  className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}
                  aria-hidden
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
