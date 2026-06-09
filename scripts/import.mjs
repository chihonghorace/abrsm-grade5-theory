#!/usr/bin/env node
// Merge a reviewed proposals file into the question database.
//
//   npm run questions:import -- data/proposed/intervals-2026-....json
//
// - Assigns unique ids (<prefix>-<n>) continuing each topic's numbering.
// - Skips items whose prompt already exists in that topic (exact match).
// - Appends to src/data/questions/<topic>.json.
// Run `npm run questions:validate` afterwards (this script also validates shape).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DB = join(ROOT, 'src/data/questions')

// Topic → id prefix (matches the ids already in the bank).
const PREFIX = {
  'keys-and-scales': 'ks',
  intervals: 'iv',
  'chords-and-cadences': 'cc',
  'time-and-rhythm': 'tr',
  clefs: 'cl',
  transposition: 'tp',
  ornaments: 'or',
  'terms-and-signs': 'ts',
  'instruments-and-voices': 'in',
}

const file = process.argv[2]
if (!file) {
  console.error('Usage: npm run questions:import -- <path-to-proposed.json>')
  process.exit(1)
}

const proposed = JSON.parse(readFileSync(join(ROOT, file), 'utf8'))
if (!Array.isArray(proposed) || proposed.length === 0) {
  console.error('Proposed file must be a non-empty JSON array.')
  process.exit(1)
}

// Group proposed questions by topic.
const byTopic = new Map()
for (const q of proposed) {
  if (!PREFIX[q.topic]) {
    console.error(`Item has invalid/missing topic: ${JSON.stringify(q).slice(0, 80)}…`)
    process.exit(1)
  }
  let arr = byTopic.get(q.topic)
  if (!arr) {
    arr = []
    byTopic.set(q.topic, arr)
  }
  arr.push(q)
}

let added = 0
let skipped = 0

for (const [topic, items] of byTopic) {
  const path = join(DB, `${topic}.json`)
  if (!existsSync(path)) {
    console.error(`No database file for topic "${topic}"`)
    process.exit(1)
  }
  const bank = JSON.parse(readFileSync(path, 'utf8'))
  const prefix = PREFIX[topic]
  const existingPrompts = new Set(bank.map((q) => q.prompt.trim().toLowerCase()))
  let maxN = bank.reduce((m, q) => {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(q.id)
    return match ? Math.max(m, parseInt(match[1], 10)) : m
  }, 0)

  for (const q of items) {
    // shape checks
    if (!q.prompt || !Array.isArray(q.choices) || q.choices.length < 2 || !q.explanation) {
      console.warn(`  skip (bad shape): ${JSON.stringify(q).slice(0, 60)}…`)
      skipped++
      continue
    }
    if (existingPrompts.has(q.prompt.trim().toLowerCase())) {
      console.warn(`  skip (duplicate prompt): "${q.prompt}"`)
      skipped++
      continue
    }
    const id = `${prefix}-${++maxN}`
    bank.push({
      id,
      topic,
      difficulty: q.difficulty ?? 2,
      prompt: q.prompt,
      ...(q.abc ? { abc: q.abc } : {}),
      choices: q.choices,
      answer: q.answer ?? 0,
      explanation: q.explanation,
    })
    existingPrompts.add(q.prompt.trim().toLowerCase())
    added++
  }

  writeFileSync(path, JSON.stringify(bank, null, 2) + '\n')
  console.log(`  ${topic}.json → now ${bank.length} questions`)
}

console.log(`\n✓ Imported ${added} question(s), skipped ${skipped}.`)
console.log('Now run:  npm run questions:validate')
