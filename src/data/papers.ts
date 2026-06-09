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

export const PAPERS: Paper[] = Object.values(modules)
  .map((m) => m.default)
  .filter((p): p is Paper => !!p && Array.isArray(p.questions) && p.questions.length > 0)
  .sort((a, b) => a.title.localeCompare(b.title))
