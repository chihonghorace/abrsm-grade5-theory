import { useState, type ReactNode } from 'react'
import { usePaperStyle } from '../../lib/examStyle'

// Full-screen exam chrome: neutral-branded top bar (Prev/Nav/Next · Change Style
// · End Test · timer), a paper-coloured content area, and a bottom question
// palette. Layout/interaction only — no third-party branding.
export interface PaletteCell {
  label: string
  state: 'current' | 'answered' | 'flagged' | 'info' | 'plain'
  onClick?: () => void
}

interface Props {
  brand?: string
  timer?: string
  onPrev?: () => void
  onNav?: () => void
  onNext?: () => void
  onEnd: () => void
  onFlag?: () => void
  onClear?: () => void
  palette?: PaletteCell[]
  children: ReactNode
}

export default function ExamShell({
  brand = '♪ Theory',
  timer,
  onPrev,
  onNav,
  onNext,
  onEnd,
  onFlag,
  onClear,
  palette,
  children,
}: Props) {
  const { style, setId, styles } = usePaperStyle()
  const [picking, setPicking] = useState(false)

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col bg-[#f1f2f4] text-[#1f2937]"
      style={{ ['--paper-bg' as string]: style.bg, ['--paper-ink' as string]: style.ink }}
    >
      <header className="flex items-center justify-between gap-2 border-b border-[#e5e7eb] bg-[#f7f7f8] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="mr-2 text-lg font-black tracking-tight text-rose-500">{brand}</span>
          {onPrev && <ChromeBtn onClick={onPrev}>Prev</ChromeBtn>}
          {onNav && <ChromeBtn onClick={onNav}>Nav</ChromeBtn>}
          {onNext && <ChromeBtn onClick={onNext}>Next</ChromeBtn>}
        </div>
        <div className="flex items-center gap-2">
          <ChromeBtn onClick={() => setPicking(true)}>Change Style</ChromeBtn>
          <ChromeBtn onClick={onEnd}>✕ End Test</ChromeBtn>
          {timer && (
            <span className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-bold tabular-nums text-white">
              {timer}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-5xl space-y-4">{children}</div>
      </main>

      {(palette || onFlag || onClear) && (
        <footer className="flex items-center gap-2 border-t border-[#e5e7eb] bg-[#f7f7f8] px-3 py-2">
          <div className="flex flex-1 flex-wrap items-center gap-1 overflow-x-auto">
            {palette?.map((c, i) => (
              <button key={i} onClick={c.onClick} disabled={!c.onClick} className={paletteCls(c.state)}>
                {c.label}
              </button>
            ))}
          </div>
          {onClear && <ChromeBtn onClick={onClear}>↻ Clear</ChromeBtn>}
          {onFlag && <ChromeBtn onClick={onFlag}>⚑ Flag</ChromeBtn>}
        </footer>
      )}

      {picking && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setPicking(false)}
        >
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 text-lg font-bold text-[#1f2937]">Choose the colour for your test</h3>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setId(s.id)
                    setPicking(false)
                  }}
                  className={`rounded-lg border-2 px-4 py-6 text-left text-sm font-bold transition ${
                    s.id === style.id ? 'border-rose-400 ring-2 ring-rose-200' : 'border-[#e5e7eb]'
                  }`}
                  style={{ background: s.bg, color: s.ink }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ChromeBtn({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#f3f4f6]"
    >
      {children}
    </button>
  )
}

function paletteCls(state: PaletteCell['state']): string {
  const base = 'h-8 min-w-[2rem] rounded border px-1.5 text-xs font-bold transition-colors disabled:cursor-default'
  switch (state) {
    case 'current':
      return `${base} border-rose-500 bg-rose-500 text-white`
    case 'answered':
      return `${base} border-emerald-300 bg-emerald-100 text-emerald-700`
    case 'flagged':
      return `${base} border-amber-400 bg-amber-100 text-amber-700`
    case 'info':
      return `${base} border-[#d1d5db] bg-[#eef0f2] text-[#6b7280]`
    default:
      return `${base} border-[#d1d5db] bg-white text-[#6b7280]`
  }
}
