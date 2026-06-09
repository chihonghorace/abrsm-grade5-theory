import { useEffect, useRef } from 'react'
import abcjs from 'abcjs'
import type { BuildQuestion, FillQuestion, MultiQuestion } from '../../types'
import { questionType } from '../../types'
import type { Prepared } from '../../lib/quiz'
import { isAnswered, isCorrect, type Answer } from '../../lib/answer'
import { abcToken, parseToken, noteName, samePitch } from '../../lib/pitch'
import Notation from '../Notation'

// Exam-styled question body: flat paper cards, radio options, an "Answer" button.
// Mirrors a standard online-exam layout (no topic chips / difficulty / bookmark).
const paper = { background: 'var(--paper-bg)', color: 'var(--paper-ink)' } as const

interface Props {
  prepared: Prepared
  answer: Answer
  onChange: (a: Answer) => void
  revealed: boolean
  onAnswer?: () => void
  // Timed-exam mode: collect the answer only — no per-question "Answer" button
  // and no correct/wrong feedback (grading happens at submit).
  examMode?: boolean
}

export default function ExamQuestion({ prepared, answer, onChange, revealed, onAnswer, examMode }: Props) {
  const q = prepared.question
  const type = questionType(q)
  const answered = isAnswered(q, answer)

  return (
    <>
      <section className="rounded-lg border border-black/10 p-5 shadow-sm" style={paper}>
        <p className="text-[15px] leading-relaxed">{q.prompt}</p>
        {q.abc && (
          // Block (not inline-block) container: abcjs `responsive:'resize'` needs a
          // definite parent width, or the staff collapses to nothing. max-w keeps a
          // single-note stave from stretching the full column.
          <div className="mt-3 max-w-xl rounded bg-white/70 px-3 py-2">
            <Notation abc={q.abc} scale={1.5} />
          </div>
        )}
        {q.imageSrc && (
          <img src={q.imageSrc} alt="Notation for this question" className="mt-3 w-full max-w-xl rounded bg-white/70 object-contain p-1" />
        )}
      </section>

      <section className="rounded-lg border border-black/10 p-5 shadow-sm" style={paper}>
        {type === 'fill' ? (
          <ExamFill q={q as FillQuestion} value={answer as string[]} revealed={revealed} onChange={onChange} />
        ) : type === 'multi' ? (
          <ExamMulti
            q={q as MultiQuestion}
            options={prepared.multiOptions ?? (q as MultiQuestion).options}
            value={answer as (string | null)[]}
            revealed={revealed}
            onChange={onChange}
          />
        ) : type === 'build' ? (
          <ExamBuild q={q as BuildQuestion} value={answer as string} revealed={revealed} onChange={onChange} />
        ) : (
          <ExamMC prepared={prepared} value={answer as number | null} revealed={revealed} onSelect={onChange} />
        )}

        {!revealed && !examMode && (
          <button
            onClick={onAnswer}
            disabled={!answered}
            className="mt-5 rounded-md bg-rose-400 px-6 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-40"
          >
            Answer
          </button>
        )}
        {revealed && (
          <div
            className={`mt-4 rounded-md px-4 py-3 text-sm ${
              isCorrect(prepared, answer) ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
            }`}
          >
            <b>{isCorrect(prepared, answer) ? 'Correct. ' : 'Not quite. '}</b>
            {q.explanation}
          </div>
        )}
      </section>
    </>
  )
}

function ExamMC({
  prepared,
  value,
  revealed,
  onSelect,
}: {
  prepared: Prepared
  value: number | null
  revealed: boolean
  onSelect: (i: number) => void
}) {
  const mc = prepared.mc!
  return (
    <div className="space-y-2">
      {mc.choices.map((choice, i) => {
        const picked = value === i
        const correct = revealed && i === mc.answer
        const wrong = revealed && picked && i !== mc.answer
        return (
          <button
            key={i}
            disabled={revealed}
            onClick={() => onSelect(i)}
            className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition ${
              correct
                ? 'border-emerald-400 bg-emerald-50'
                : wrong
                ? 'border-rose-400 bg-rose-50'
                : picked
                ? 'border-rose-400 bg-rose-50/50'
                : 'border-black/15 hover:bg-black/[0.03]'
            }`}
          >
            <span
              className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                picked || correct ? 'border-rose-500' : 'border-black/30'
              }`}
            >
              {(picked || correct) && <span className="h-2 w-2 rounded-full bg-rose-500" />}
            </span>
            {mc.choicesAbc?.[i] ? (
              <span className="rounded bg-white/70 px-2 py-1">
                <Notation abc={mc.choicesAbc[i]!} scale={1.2} />
              </span>
            ) : (
              <span>{choice}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function ExamFill({
  q,
  value,
  revealed,
  onChange,
}: {
  q: FillQuestion
  value: string[]
  revealed: boolean
  onChange: (a: string[]) => void
}) {
  const v = value ?? q.blanks.map(() => '')
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
  return (
    <div className="space-y-3">
      {q.blanks.map((b, i) => {
        const ok = [b.answer, ...(b.alt ?? [])].map(norm).includes(norm(v[i] ?? ''))
        return (
          <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
            {b.prefix && <span>{b.prefix}</span>}
            <input
              value={v[i] ?? ''}
              disabled={revealed}
              onChange={(e) => {
                const n = v.slice()
                n[i] = e.target.value
                onChange(n)
              }}
              className={`w-32 rounded border bg-white px-3 py-1.5 text-center ${
                revealed ? (ok ? 'border-emerald-400' : 'border-rose-400') : 'border-black/20'
              }`}
            />
            {b.suffix && <span>{b.suffix}</span>}
            {revealed && !ok && <span className="font-semibold text-emerald-700">→ {b.answer}</span>}
          </div>
        )
      })}
    </div>
  )
}

function ExamMulti({
  q,
  options,
  value,
  revealed,
  onChange,
}: {
  q: MultiQuestion
  options: string[]
  value: (string | null)[]
  revealed: boolean
  onChange: (a: (string | null)[]) => void
}) {
  const v = value ?? q.items.map(() => null)
  return (
    <div className="space-y-2.5">
      {q.items.map((it, i) => {
        const ok = v[i] === it.answer
        return (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-16 flex-none font-semibold">{it.label}</span>
            <select
              value={v[i] ?? ''}
              disabled={revealed}
              onChange={(e) => {
                const n = v.slice()
                n[i] = e.target.value || null
                onChange(n)
              }}
              className={`flex-1 rounded border bg-white px-3 py-1.5 ${
                revealed ? (ok ? 'border-emerald-400' : 'border-rose-400') : 'border-black/20'
              }`}
            >
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {revealed && !ok && <span className="font-semibold text-emerald-700">{it.answer}</span>}
          </div>
        )
      })}
    </div>
  )
}

// Staff-note builder in exam paper style: shows the given note(s) plus the
// learner's note; ↑/↓ + accidental buttons set the pitch (no dragging). On
// reveal the correct note is shown in green.
function ExamBuild({
  q,
  value,
  revealed,
  onChange,
}: {
  q: BuildQuestion
  value: string
  revealed: boolean
  onChange: (a: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const given = q.abc ?? 'C'
  const cur = value || q.startAbc
  const { absIdx, acc } = parseToken(cur)
  const ok = samePitch(cur, q.answerAbc)
  const shown = revealed && !ok ? q.answerAbc : cur
  const color = revealed ? '#10b981' : '#e11d48'

  useEffect(() => {
    if (!ref.current) return
    abcjs.renderAbc(ref.current, `X:1\nL:1/1\nM:none\nK:C\n${given} ${shown}|`, {
      scale: 1.7,
      add_classes: true,
      staffwidth: 280,
      paddingtop: 6,
      paddingbottom: 10,
      paddingleft: 0,
      paddingright: 0,
    } as any)
    const notes = ref.current.querySelectorAll<SVGGElement>('.abcjs-note')
    notes[1]?.querySelectorAll<SVGElement>('path, ellipse').forEach((p) => {
      p.style.fill = color
      p.style.stroke = color
    })
  }, [given, shown, color])

  const ACCS: [string, number][] = [
    ['𝄫', -2],
    ['♭', -1],
    ['♮', 0],
    ['♯', 1],
    ['𝄪', 2],
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center rounded bg-white/70 px-3 py-3" style={{ minHeight: 120 }}>
        <div ref={ref} className="flex justify-center" aria-label="Build the note" />
      </div>
      {!revealed ? (
        <>
          <p className="text-center text-sm font-semibold">
            Your note: <b>{noteName(absIdx, acc)}</b>
            <span className="ml-2 font-normal opacity-60">— use the buttons to set the pitch</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm font-bold hover:bg-black/[0.03]"
              onClick={() => onChange(abcToken(absIdx + 1, acc))}
              aria-label="Up a step"
            >
              ↑
            </button>
            <button
              className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm font-bold hover:bg-black/[0.03]"
              onClick={() => onChange(abcToken(absIdx - 1, acc))}
              aria-label="Down a step"
            >
              ↓
            </button>
            <div className="flex gap-1 rounded-md bg-black/[0.04] p-1">
              {ACCS.map(([lbl, a]) => (
                <button
                  key={a}
                  onClick={() => onChange(abcToken(absIdx, a))}
                  className={`rounded px-3 py-1.5 text-sm font-bold transition ${
                    acc === a ? 'bg-white text-rose-500 shadow-sm' : 'opacity-70'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : ok ? (
        <p className="text-center text-sm font-bold text-emerald-700">Correct — {q.answerName}</p>
      ) : (
        <p className="text-center text-sm font-bold">
          <span className="text-rose-600">Your note: {noteName(absIdx, acc)}</span>
          <span className="mx-2 opacity-50">·</span>
          <span className="text-emerald-700">Correct: {q.answerName}</span>
        </p>
      )}
    </div>
  )
}
