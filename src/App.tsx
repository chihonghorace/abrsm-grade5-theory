import { useState } from 'react'
import type { PracticePool, View } from './lib/nav'
import { useProgress } from './lib/storage'
import { useTheme } from './lib/theme'
import Home from './views/Home'
import Learn from './views/Learn'
import Practice from './views/Practice'
import Mock from './views/Mock'
import Papers from './views/Papers'
import Review from './views/Review'
import Stats from './views/Stats'

const NAV: { view: View; label: string }[] = [
  { view: 'home', label: 'Home' },
  { view: 'learn', label: 'Learn' },
  { view: 'practice', label: 'Practice' },
  { view: 'mock', label: 'Mock' },
  { view: 'review', label: 'Review' },
  { view: 'stats', label: 'Stats' },
  { view: 'papers', label: 'Papers' },
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
      <div className="sticky top-0 z-20 border-b border-line bg-app/85 backdrop-blur">
        <header className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-3">
          <button
            onClick={() => goTo('home')}
            className="flex items-center gap-2 text-base font-extrabold tracking-tight text-ink"
          >
            <span aria-hidden className="text-brand-500">♪</span>
            <span>ABRSM Grade 5 Theory</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-2 hover:text-brand-500 active:scale-90"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={reset}
              className="rounded-lg px-3 py-1 text-xs font-bold text-ink-faint transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            >
              Reset
            </button>
          </div>
        </header>
        <nav className="mx-auto flex max-w-3xl gap-0.5 overflow-x-auto px-2">
          {NAV.map((item) => {
            const active = view === item.view
            return (
              <button
                key={item.view}
                onClick={() => goTo(item.view)}
                className={`relative whitespace-nowrap px-3.5 py-2.5 text-sm font-bold transition-colors ${
                  active ? 'text-brand-600 dark:text-brand-300' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500" />}
              </button>
            )
          })}
        </nav>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-5">
        {view === 'home' && <Home api={api} goTo={goTo} startPractice={startPractice} />}
        {view === 'learn' && <Learn startPractice={startPractice} />}
        {view === 'practice' && <Practice key={practiceKey} api={api} pool={pool} />}
        {view === 'mock' && <Mock api={api} />}
        {view === 'papers' && <Papers api={api} />}
        {view === 'review' && <Review api={api} startPractice={startPractice} />}
        {view === 'stats' && <Stats api={api} startPractice={startPractice} />}
      </main>
    </div>
  )
}
