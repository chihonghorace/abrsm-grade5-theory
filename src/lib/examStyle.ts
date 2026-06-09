import { useEffect, useState } from 'react'

// Paper background colours for the exam shell — mirrors the "Change Style" /
// "Select style for the test" colour picker of a typical online-exam interface.
export interface PaperStyle {
  id: string
  label: string
  bg: string
  ink: string
}

export const PAPER_STYLES: PaperStyle[] = [
  { id: 'white', label: 'White', bg: '#ffffff', ink: '#1f2937' },
  { id: 'cream', label: 'Cream', bg: '#fdf7da', ink: '#3a3520' },
  { id: 'blue', label: 'Blue', bg: '#dcebf8', ink: '#1f2937' },
  { id: 'pink', label: 'Pink', bg: '#f7daef', ink: '#3a2030' },
]

const KEY = 'abrsm-g5-paper-style'

export function usePaperStyle() {
  const [id, setId] = useState<string>(() => {
    try {
      return localStorage.getItem(KEY) ?? 'white'
    } catch {
      return 'white'
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, id)
    } catch {
      /* ignore */
    }
  }, [id])
  const style = PAPER_STYLES.find((s) => s.id === id) ?? PAPER_STYLES[0]
  return { style, setId, styles: PAPER_STYLES }
}
