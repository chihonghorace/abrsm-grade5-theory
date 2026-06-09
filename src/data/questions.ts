import type { Question } from '../types'

// ---------------------------------------------------------------------------
// The question bank is a "database" of per-topic JSON files under
// ./questions/*.json. This loader inlines them at build time (Vite glob).
//
// Authoring / generating questions: edit the JSON files directly, or use the
// local AI pipeline (npm run questions:generate → review → questions:import).
// The static site only ever reads these files — there is no API key in the app.
// Validate the bank with: npm run questions:validate
// ---------------------------------------------------------------------------

const modules = import.meta.glob<{ default: Question[] }>('./questions/*.json', {
  eager: true,
})

export const QUESTIONS: Question[] = Object.values(modules).flatMap((m) => m.default)
