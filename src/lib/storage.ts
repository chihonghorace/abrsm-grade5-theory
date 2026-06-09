import { useCallback, useEffect, useState } from 'react'
import type { MockResult, Progress } from '../types'

const KEY = 'abrsm-g5-progress-v1'

const EMPTY: Progress = { attempts: {}, bookmarks: [], mockHistory: [] }

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      attempts: parsed.attempts ?? {},
      bookmarks: parsed.bookmarks ?? [],
      mockHistory: parsed.mockHistory ?? [],
    }
  } catch {
    return EMPTY
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* storage may be unavailable (private mode) — fail silently */
  }
}

/**
 * Single source of truth for learner progress. Lives at the App root and is
 * threaded down via props so every view reads/writes the same persisted state.
 */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    save(progress)
  }, [progress])

  const recordAttempt = useCallback((questionId: string, correct: boolean) => {
    setProgress((p) => {
      const prev = p.attempts[questionId] ?? { seen: 0, correct: 0, wrong: 0, lastCorrect: false }
      return {
        ...p,
        attempts: {
          ...p.attempts,
          [questionId]: {
            seen: prev.seen + 1,
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
            lastCorrect: correct,
          },
        },
      }
    })
  }, [])

  const toggleBookmark = useCallback((questionId: string) => {
    setProgress((p) => {
      const has = p.bookmarks.includes(questionId)
      return {
        ...p,
        bookmarks: has
          ? p.bookmarks.filter((id) => id !== questionId)
          : [...p.bookmarks, questionId],
      }
    })
  }, [])

  const addMockResult = useCallback((result: MockResult) => {
    setProgress((p) => ({
      ...p,
      // keep the 20 most recent attempts
      mockHistory: [result, ...p.mockHistory].slice(0, 20),
    }))
  }, [])

  const resetAll = useCallback(() => setProgress(EMPTY), [])

  return { progress, recordAttempt, toggleBookmark, addMockResult, resetAll }
}

export type ProgressApi = ReturnType<typeof useProgress>
