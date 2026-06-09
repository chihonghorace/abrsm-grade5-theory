import { useEffect, useRef } from 'react'
import abcjs from 'abcjs'

interface Props {
  /** ABC-notation source. The component wraps bare note strings in a minimal header. */
  abc: string
  className?: string
  /** Staff scale; smaller for inline question prompts, larger for study notes. */
  scale?: number
}

/**
 * Wraps any ABC string in a sensible default header (4/4, treble, no bar
 * counting fuss) unless the snippet already declares its own `X:`/`K:` fields.
 * This lets question data stay terse, e.g. abc: "[CE]" for a harmonic third.
 */
function normalize(abc: string): string {
  const trimmed = abc.trim()
  if (trimmed.startsWith('X:')) return trimmed
  const hasKey = /(^|\n)\s*K:/.test(trimmed)
  const header = ['X:1', 'L:1/1', 'M:none']
  if (!hasKey) header.push('K:C')
  return [...header, trimmed].join('\n')
}

export default function Notation({ abc, className = '', scale = 1.2 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    abcjs.renderAbc(ref.current, normalize(abc), {
      responsive: 'resize',
      scale,
      paddingtop: 6,
      paddingbottom: 6,
      paddingleft: 0,
      paddingright: 0,
      staffwidth: 320,
    })
  }, [abc, scale])

  return (
    <div
      ref={ref}
      className={`abc-notation flex justify-center overflow-x-auto ${className}`}
      aria-label="Music notation"
    />
  )
}
