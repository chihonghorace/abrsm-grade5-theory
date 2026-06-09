#!/usr/bin/env node
// Local AI question generator. Runs ONLY on your machine — the API key is read
// from .env (gitignored) via Node's --env-file flag and never leaves your box,
// never enters the repo, CI, or the hosted site.
//
//   npm run questions:generate -- --topic intervals --count 12
//   npm run questions:generate -- --topic terms-and-signs --count 10 --difficulty 2
//
// Output is written to data/proposed/<topic>-<timestamp>.json for HUMAN REVIEW.
// After you check the questions, merge them with:
//   npm run questions:import -- data/proposed/<file>.json
//
// Questions are ORIGINAL, written from the public Grade 5 syllabus/format —
// never copied from ABRSM's copyrighted papers.
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DB = join(ROOT, 'src/data/questions')
const OUT = join(ROOT, 'data/proposed')

const VALID_TOPICS = readdirSync(DB)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''))

// ---- args ----------------------------------------------------------------
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def
}
const topic = arg('topic')
const count = parseInt(arg('count', '10'), 10)
const difficulty = arg('difficulty') // optional: "1" | "2" | "3"
const model = arg('model', 'claude-opus-4-8')

if (!topic || !VALID_TOPICS.includes(topic)) {
  console.error(`Usage: --topic <one of: ${VALID_TOPICS.join(', ')}> --count N [--difficulty 1|2|3]`)
  process.exit(1)
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY not set. Create a .env file (see .env.example) — it is gitignored.')
  process.exit(1)
}

// ---- existing questions for context + de-duplication ---------------------
const existing = JSON.parse(readFileSync(join(DB, `${topic}.json`), 'utf8'))
const existingPrompts = existing.map((q) => `- ${q.prompt}`).join('\n')

const SYSTEM = `You are an expert ABRSM music-theory tutor writing practice questions for the
Grade 5 (2020+ online) Music Theory exam.

Hard rules:
- Write ORIGINAL questions from the public syllabus and exam FORMAT. Never copy,
  paraphrase, or reproduce ABRSM's actual exam or practice-paper questions.
- Each question has exactly ONE unambiguously correct answer and 4 choices.
- The correct answer MUST be choices[0] (index 0). The app shuffles choices at
  display time, so position never leaks the answer.
- The other 3 choices must be plausible distractors (the common mistakes).
- Keep musical terms (Italian/French/German) in their original language.
- explanation: one or two sentences stating WHY the answer is correct.
- Use the optional "abc" field (ABC notation, e.g. "[CE]" for a harmonic third,
  "C E G" for a melodic phrase) ONLY when notation genuinely helps the question
  (intervals, chords, rhythm). Omit it otherwise. Verify the notation is correct.
- Be musically accurate. Double-check key signatures, intervals, and chords.`

const user = `Topic: "${topic}".
Write ${count} NEW questions for this topic${difficulty ? `, all at difficulty ${difficulty}` : ', spread across difficulties 1–3'}.

Do NOT duplicate or trivially reword any of these existing prompts:
${existingPrompts}`

const itemSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    difficulty: { type: 'integer', enum: [1, 2, 3] },
    prompt: { type: 'string' },
    abc: { type: 'string' },
    choices: { type: 'array', items: { type: 'string' } },
    answer: { type: 'integer', const: 0 },
    explanation: { type: 'string' },
  },
  required: ['difficulty', 'prompt', 'choices', 'answer', 'explanation'],
}
const schema = {
  type: 'object',
  additionalProperties: false,
  properties: { questions: { type: 'array', items: itemSchema } },
  required: ['questions'],
}

// ---- call Claude ---------------------------------------------------------
const client = new Anthropic() // reads ANTHROPIC_API_KEY from env

console.log(`Generating ${count} "${topic}" question(s) with ${model}…`)
const response = await client.messages.create({
  model,
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  system: SYSTEM,
  output_config: { format: { type: 'json_schema', schema } },
  messages: [{ role: 'user', content: user }],
})

if (response.stop_reason === 'refusal') {
  console.error('Model refused the request.', response.stop_details ?? '')
  process.exit(1)
}
if (response.stop_reason === 'max_tokens') {
  console.error('Output hit max_tokens — try a smaller --count.')
  process.exit(1)
}

const textBlock = response.content.find((b) => b.type === 'text')
if (!textBlock) {
  console.error('No text block in response.')
  process.exit(1)
}

let questions
try {
  questions = JSON.parse(textBlock.text).questions
} catch (e) {
  console.error('Could not parse model output as JSON:', e.message)
  process.exit(1)
}

// Stamp the topic onto each item (kept off the model's plate).
for (const q of questions) q.topic = topic

mkdirSync(OUT, { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const outFile = join(OUT, `${topic}-${stamp}.json`)
writeFileSync(outFile, JSON.stringify(questions, null, 2) + '\n')

const usage = response.usage
console.log(`\n✓ Wrote ${questions.length} proposed question(s) to:`)
console.log(`  ${outFile.replace(ROOT + '/', '')}`)
console.log(`  (tokens: in ${usage.input_tokens}, out ${usage.output_tokens})`)
console.log('\nNext: REVIEW the file (delete/fix any weak or wrong items), then run:')
console.log(`  npm run questions:import -- ${outFile.replace(ROOT + '/', '')}`)
