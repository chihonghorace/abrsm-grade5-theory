import { useEffect, useRef } from 'react'
import abcjs from 'abcjs'

interface Props {
  /** ABC-notation source. The component wraps bare note strings in a minimal header. */
  abc: string
  className?: string
  /** Staff scale; smaller for inline question prompts, larger for study notes. */
  scale?: number
  /** Colour the Nth note (0-based) — used to highlight a placed/selected note. */
  highlight?: { index: number; color: string }
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

export default function Notation({ abc, className = '', scale = 1.2, highlight }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // NB: no `responsive: 'resize'`. That mode sets the SVG width to 100% of the
    // parent, which collapses to nothing inside shrink-to-fit parents (inline-block
    // wrappers, flex-item option chips, single-note staves) — the cause of the
    // "notes won't display" bug. Rendering at natural pixel size always shows;
    // `.abc-notation svg { max-width: 100% }` (index.css) still scales it down when
    // the container is narrower.
    abcjs.renderAbc(ref.current, normalize(abc), {
      scale,
      add_classes: true, // tags noteheads with .abcjs-note so we can colour them
      paddingtop: 6,
      paddingbottom: 6,
      paddingleft: 0,
      paddingright: 0,
      staffwidth: 320,
    })
    if (highlight) {
      const notes = ref.current.querySelectorAll<SVGGElement>('.abcjs-note')
      const target = notes[highlight.index]
      // Inline style beats the global stave-colour CSS rule, so the note shows
      // green (correct), red (wrong) or brand (selected) while everything else
      // stays dark ink on the light "paper".
      target?.querySelectorAll<SVGElement>('path, ellipse').forEach((p) => {
        p.style.fill = highlight.color
        p.style.stroke = highlight.color
      })
    }
  }, [abc, scale, highlight?.index, highlight?.color])

  return (
    <div
      ref={ref}
      className={`abc-notation flex justify-center overflow-x-auto ${className}`}
      aria-label="Music notation"
    />
  )
}
