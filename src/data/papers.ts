import type { Paper } from '../types'

// ---------------------------------------------------------------------------
// Past-paper (真题) database — LOCAL ONLY.
//
// Paper definitions live in `data/papers/*.json` (gitignored) and their cropped
// notation images in `public/papers/<id>/` (gitignored). ABRSM papers are
// copyright, so they are NEVER committed or bundled into the published build —
// they exist only on the machine that ran `npm run questions:extract`.
//
// This glob inlines whatever local papers exist at dev/build time. On a fresh
// clone (or the hosted site) there are none, so PAPERS is simply empty and the
// Papers view shows setup instructions instead.
// ---------------------------------------------------------------------------

const modules = import.meta.glob<{ default: Paper }>('../../data/papers/*.json', {
  eager: true,
})

// Past papers are a LOCAL-ONLY study aid: only ever surfaced under `npm run dev`.
// A production build exposes none of them, so the hosted site can never display
// ABRSM copyright material even if someone builds with local papers present.
export const PAPERS: Paper[] = import.meta.env.DEV
  ? Object.values(modules)
      .map((m) => m.default)
      .filter((p): p is Paper => !!p && Array.isArray(p.questions) && p.questions.length > 0)
      .sort((a, b) => a.title.localeCompare(b.title))
  : []
