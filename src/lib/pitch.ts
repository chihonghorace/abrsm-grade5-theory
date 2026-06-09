// Small pitch helpers shared by the interactive "build a note" question.
// A note is an absolute diatonic index (0 = middle C, 1 = D … 7 = c, -1 = B,)
// plus an accidental in semitones (−2 … +2).

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/** Build an ABC token, e.g. (1, -1) → "_d"  (D♭ just above middle C). */
export function abcToken(absIdx: number, acc: number): string {
  const within = ((absIdx % 7) + 7) % 7
  const oct = Math.floor(absIdx / 7)
  let letter = LETTERS[within]
  if (oct >= 1) letter = letter.toLowerCase()
  const mark = oct >= 2 ? "'".repeat(oct - 1) : oct <= -1 ? ','.repeat(-oct) : ''
  const a = acc > 0 ? '^'.repeat(acc) : acc < 0 ? '_'.repeat(-acc) : ''
  return a + letter + mark
}

/** Parse an ABC note token back into { absIdx, acc }. */
export function parseToken(t: string): { absIdx: number; acc: number } {
  let acc = 0
  let i = 0
  while (i < t.length && (t[i] === '^' || t[i] === '_' || t[i] === '=')) {
    if (t[i] === '^') acc++
    else if (t[i] === '_') acc--
    i++
  }
  const ch = t[i] ?? 'C'
  i++
  const upper = ch.toUpperCase()
  const within = Math.max(0, LETTERS.indexOf(upper))
  let oct = ch === upper ? 0 : 1
  while (i < t.length) {
    if (t[i] === ',') oct--
    else if (t[i] === "'") oct++
    i++
  }
  return { absIdx: oct * 7 + within, acc }
}

/** Pretty note name, e.g. (8, -1) → "B♭" (octave ignored). */
export function noteName(absIdx: number, acc: number): string {
  const within = ((absIdx % 7) + 7) % 7
  return LETTERS[within] + (acc > 0 ? '♯'.repeat(acc) : acc < 0 ? '♭'.repeat(-acc) : '')
}

/** Same staff position AND spelling (exact note identity, including octave). */
export function samePitch(aTok: string, bTok: string): boolean {
  const a = parseToken(aTok)
  const b = parseToken(bTok)
  return a.absIdx === b.absIdx && a.acc === b.acc
}
