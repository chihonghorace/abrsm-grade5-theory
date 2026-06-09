#!/usr/bin/env node
// Validate the question "database" (src/data/questions/*.json).
// Exits non-zero on any problem so it can gate CI and the import step.
//
//   node scripts/validate.mjs
//
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src/data/questions')

const TOPICS = new Set([
  'keys-and-scales',
  'intervals',
  'chords-and-cadences',
  'time-and-rhythm',
  'clefs',
  'transposition',
  'ornaments',
  'terms-and-signs',
  'instruments-and-voices',
])

const errors = []
const seenIds = new Map() // id -> file
let total = 0

const files = readdirSync(DIR).filter((f) => f.endsWith('.json'))
if (files.length === 0) errors.push(`No JSON files found in ${DIR}`)

for (const file of files) {
  const topicFromName = file.replace('.json', '')
  let data
  try {
    data = JSON.parse(readFileSync(join(DIR, file), 'utf8'))
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${e.message}`)
    continue
  }
  if (!Array.isArray(data)) {
    errors.push(`${file}: top-level value must be an array`)
    continue
  }

  data.forEach((q, i) => {
    const at = `${file}[${i}]${q?.id ? ` (${q.id})` : ''}`
    total++

    // id
    if (typeof q.id !== 'string' || !q.id.trim()) errors.push(`${at}: missing string "id"`)
    else if (seenIds.has(q.id)) errors.push(`${at}: duplicate id, also in ${seenIds.get(q.id)}`)
    else seenIds.set(q.id, file)

    // topic
    if (!TOPICS.has(q.topic)) errors.push(`${at}: invalid topic "${q.topic}"`)
    else if (q.topic !== topicFromName)
      errors.push(`${at}: topic "${q.topic}" does not match file "${topicFromName}"`)

    // difficulty
    if (![1, 2, 3].includes(q.difficulty)) errors.push(`${at}: difficulty must be 1, 2 or 3`)

    // prompt
    if (typeof q.prompt !== 'string' || !q.prompt.trim()) errors.push(`${at}: missing "prompt"`)

    // choices
    if (!Array.isArray(q.choices) || q.choices.length < 2)
      errors.push(`${at}: "choices" must be an array of 2+ options`)
    else {
      if (q.choices.some((c) => typeof c !== 'string' || !c.trim()))
        errors.push(`${at}: every choice must be a non-empty string`)
      if (new Set(q.choices).size !== q.choices.length)
        errors.push(`${at}: choices contain duplicates`)
      // answer
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length)
        errors.push(`${at}: "answer" (${q.answer}) out of range for ${q.choices.length} choices`)
    }

    // explanation
    if (typeof q.explanation !== 'string' || !q.explanation.trim())
      errors.push(`${at}: missing "explanation"`)

    // abc is optional, but if present must be a string
    if (q.abc !== undefined && typeof q.abc !== 'string') errors.push(`${at}: "abc" must be a string`)
  })
}

if (errors.length) {
  console.error(`✖ Validation failed with ${errors.length} problem(s):\n`)
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}

console.log(`✓ Question bank valid: ${total} questions across ${files.length} topics, all ids unique.`)
