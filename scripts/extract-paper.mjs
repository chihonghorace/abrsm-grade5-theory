#!/usr/bin/env node
// Local past-paper (真题) extractor. Runs ONLY on your machine.
//
// Turns ONE of YOUR OWN downloaded ABRSM PDFs into a set of interactive
// practice questions for the "Papers" tab. Output is LOCAL ONLY:
//   - data/papers/<id>.json        (gitignored)
//   - public/papers/<id>/<qid>.png (gitignored, cropped notation excerpts)
// ABRSM papers are copyright, so nothing here is ever committed or published —
// this is for your personal study on this machine.
//
//   npm run questions:extract -- \
//     --pdf "ABRSM 官网材料/music-theory-grade-5-sample-paper-200722.pdf" \
//     --id grade5-2020-sample \
//     --title "Grade 5 — 2020 sample paper"
//
// Optional: --pages 1-6  --dpi 200  --model claude-opus-4-8  --source "..."
//
// HOW IT WORKS
//   1. Renders each PDF page to PNG with `pdftoppm` (poppler).
//   2. Sends the page images to Claude, which returns structured questions,
//      each tagged with its page + the vertical band the notation occupies.
//   3. Crops that band out of the page into a PNG and links it to the question.
//
// THE OUTPUT IS A FIRST DRAFT. Music notation and wording are hard to read
// perfectly — ALWAYS review data/papers/<id>.json and the crops before relying
// on them. Re-run with a tighter --dpi or fix the JSON by hand as needed.
//
// Requires: poppler (`brew install poppler`) and ANTHROPIC_API_KEY in .env.
import Anthropic from '@anthropic-ai/sdk'
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, mkdirSync, writeFileSync, openSync, readSync, closeSync, rmSync, mkdtempSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename } from 'node:path'
import { tmpdir } from 'node:os'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DB = join(ROOT, 'src/data/questions')
const PAPERS_DIR = join(ROOT, 'data/papers')
const PUBLIC_DIR = join(ROOT, 'public/papers')

const TOPICS = readdirSync(DB).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))

// ---- args ----------------------------------------------------------------
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def
}
const pdf = arg('pdf')
const id = arg('id')
const title = arg('title')
const source = arg('source', pdf ? `${basename(pdf)} (local copy)` : undefined)
const dpi = parseInt(arg('dpi', '150'), 10)
const pagesArg = arg('pages') // e.g. "1-6"
const model = arg('model', 'claude-opus-4-8')

function die(msg) {
  console.error(msg)
  process.exit(1)
}

if (!pdf || !id || !title) {
  die('Usage: --pdf <path> --id <slug> --title "<name>" [--pages 1-6] [--dpi 150] [--source "..."]')
}
if (!/^[a-z0-9-]+$/.test(id)) die(`--id must be kebab-case [a-z0-9-]; got "${id}"`)
if (!process.env.ANTHROPIC_API_KEY) {
  die('ANTHROPIC_API_KEY not set. Create a .env file (see .env.example) — it is gitignored.')
}
const pdfPath = join(ROOT, pdf)
try {
  readFileSync(pdfPath)
} catch {
  die(`Cannot read PDF: ${pdf}`)
}

// ---- poppler check -------------------------------------------------------
function hasCmd(cmd) {
  const r = spawnSync(cmd, ['-v'], { encoding: 'utf8' })
  return !(r.error && r.error.code === 'ENOENT')
}
if (!hasCmd('pdftoppm')) {
  die('`pdftoppm` not found. Install poppler first:  brew install poppler')
}

// ---- read PNG width/height from the IHDR chunk ---------------------------
function pngSize(path) {
  const fd = openSync(path, 'r')
  const buf = Buffer.alloc(24)
  readSync(fd, buf, 0, 24, 0)
  closeSync(fd)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

// ---- 1. render pages -----------------------------------------------------
const tmp = mkdtempSync(join(tmpdir(), 'abrsm-paper-'))
const pageRange = []
if (pagesArg) {
  const m = /^(\d+)-(\d+)$/.exec(pagesArg)
  if (m) {
    for (let p = parseInt(m[1], 10); p <= parseInt(m[2], 10); p++) pageRange.push(p)
  } else if (/^\d+$/.test(pagesArg)) {
    pageRange.push(parseInt(pagesArg, 10))
  } else {
    die('--pages must look like "3" or "2-7"')
  }
}

function renderPage(page, outPrefix, crop) {
  const args = ['-png', '-r', String(dpi), '-f', String(page), '-l', String(page), '-singlefile']
  if (crop) args.push('-x', String(crop.x), '-y', String(crop.y), '-W', String(crop.w), '-H', String(crop.h))
  args.push(pdfPath, outPrefix)
  const r = spawnSync('pdftoppm', args, { encoding: 'utf8' })
  if (r.status !== 0) die(`pdftoppm failed (page ${page}): ${r.stderr || r.error?.message || 'unknown'}`)
  return `${outPrefix}.png`
}

// How many pages? Render the whole doc once into the temp dir, then list them.
{
  const r = spawnSync('pdftoppm', ['-png', '-r', String(dpi), pdfPath, join(tmp, 'page')], { encoding: 'utf8' })
  if (r.status !== 0) die(`pdftoppm failed: ${r.stderr || r.error?.message || 'unknown'}`)
}
const pageFiles = readdirSync(tmp)
  .filter((f) => f.startsWith('page') && f.endsWith('.png'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((f) => join(tmp, f))
const totalPages = pageFiles.length
if (totalPages === 0) die('No pages rendered from the PDF.')

const wanted = pageRange.length ? pageRange.filter((p) => p >= 1 && p <= totalPages) : pageFiles.map((_, i) => i + 1)
console.log(`Rendered ${totalPages} page(s) at ${dpi} DPI; sending ${wanted.length} to ${model}…`)

// ---- 2. ask Claude for structured questions ------------------------------
const SYSTEM = `You extract questions from a music-theory exam paper that the user has
legally downloaded, turning them into structured practice items for their own study.

You are given the rendered pages of ONE paper. Read every question and transcribe
it faithfully and accurately. For each question return:
- page: the 1-based page number it appears on (as labelled in the input).
- yTop / yBottom: the vertical extent of the printed MUSIC / DIAGRAM for this
  question, as fractions of the page height (0 = top edge, 1 = bottom edge).
  Bound JUST the staves/figure the question refers to, with a little margin.
  If the question has no printed music to show, set hasNotation: false and put
  yTop: 0, yBottom: 0.
- hasNotation: true only if there is printed music/diagram to display.
- topic: the single best-fitting id from this list: ${TOPICS.join(', ')}.
- difficulty: 1, 2 or 3 (your estimate).
- type: "mc" (single best answer), "fill" (type a short answer) or "multi"
  (several labelled blanks sharing one option list).
- prompt: the question as the student should read it. If the original relies on
  the printed music, keep the wording but assume the image is shown above it.
- For type "mc": "choices" = 2–4 options, with the CORRECT option FIRST.
- For type "fill": "blanks" = [{ answer, alt?, prefix?, suffix? }] (alt = other
  accepted spellings; prefix/suffix = fixed text around the input).
- For type "multi": "options" = the shared choice list, "items" = [{ label, answer }].
- explanation: one or two sentences on WHY the answer is correct.

Rules:
- Be musically accurate; double-check keys, intervals, chords and rhythm.
- If a question can't be turned into a self-contained item (e.g. "compose a
  melody"), skip it rather than inventing an answer.
- Prefer "mc" where the paper offers options; otherwise "fill".`

const itemSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    page: { type: 'integer' },
    yTop: { type: 'number' },
    yBottom: { type: 'number' },
    hasNotation: { type: 'boolean' },
    topic: { type: 'string', enum: TOPICS },
    difficulty: { type: 'integer', enum: [1, 2, 3] },
    type: { type: 'string', enum: ['mc', 'fill', 'multi'] },
    prompt: { type: 'string' },
    choices: { type: 'array', items: { type: 'string' } },
    blanks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          answer: { type: 'string' },
          alt: { type: 'array', items: { type: 'string' } },
          prefix: { type: 'string' },
          suffix: { type: 'string' },
        },
        required: ['answer'],
      },
    },
    options: { type: 'array', items: { type: 'string' } },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: { label: { type: 'string' }, answer: { type: 'string' } },
        required: ['label', 'answer'],
      },
    },
    explanation: { type: 'string' },
  },
  required: ['page', 'yTop', 'yBottom', 'hasNotation', 'topic', 'difficulty', 'type', 'prompt', 'explanation'],
}
const schema = {
  type: 'object',
  additionalProperties: false,
  properties: { questions: { type: 'array', items: itemSchema } },
  required: ['questions'],
}

const content = [{ type: 'text', text: `Paper: "${title}". Extract every answerable question.` }]
for (const p of wanted) {
  const b64 = readFileSync(pageFiles[p - 1]).toString('base64')
  content.push({ type: 'text', text: `--- Page ${p} ---` })
  content.push({ type: 'image', source: { type: 'base64', media_type: 'image/png', data: b64 } })
}

const client = new Anthropic()
const response = await client.messages.create({
  model,
  max_tokens: 32000,
  thinking: { type: 'adaptive' },
  system: SYSTEM,
  output_config: { format: { type: 'json_schema', schema } },
  messages: [{ role: 'user', content }],
})

if (response.stop_reason === 'refusal') die('Model refused the request.')
if (response.stop_reason === 'max_tokens') die('Output hit max_tokens — try fewer --pages.')
const textBlock = response.content.find((b) => b.type === 'text')
if (!textBlock) die('No text block in response.')

let items
try {
  items = JSON.parse(textBlock.text).questions
} catch (e) {
  die(`Could not parse model output as JSON: ${e.message}`)
}
if (!Array.isArray(items) || items.length === 0) die('Model returned no questions.')

// ---- 3. crop notation + assemble the paper -------------------------------
mkdirSync(PAPERS_DIR, { recursive: true })
const imgDir = join(PUBLIC_DIR, id)
mkdirSync(imgDir, { recursive: true })

const questions = []
let n = 0
let cropped = 0
for (const it of items) {
  n++
  const qid = `${id}-q${String(n).padStart(2, '0')}`
  const q = {
    id: qid,
    topic: it.topic,
    difficulty: it.difficulty ?? 2,
    prompt: it.prompt,
    explanation: it.explanation ?? '',
  }

  // crop the notation band, if any
  if (it.hasNotation && it.yBottom > it.yTop && it.page >= 1 && it.page <= totalPages) {
    const { width, height } = pngSize(pageFiles[it.page - 1])
    const pad = Math.round(0.015 * height)
    const y = Math.max(0, Math.round(it.yTop * height) - pad)
    const hRaw = Math.round((it.yBottom - it.yTop) * height) + 2 * pad
    const h = Math.min(height - y, hRaw)
    if (h > 8) {
      renderPage(it.page, join(imgDir, qid), { x: 0, y, w: width, h })
      q.imageSrc = `/papers/${id}/${qid}.png`
      cropped++
    }
  }

  // type-specific payload
  if (it.type === 'fill' && Array.isArray(it.blanks) && it.blanks.length) {
    q.type = 'fill'
    q.blanks = it.blanks
  } else if (it.type === 'multi' && Array.isArray(it.items) && it.items.length) {
    q.type = 'multi'
    q.options = it.options ?? []
    q.items = it.items
  } else {
    // default to MC; model was told to put the correct choice first.
    q.choices = Array.isArray(it.choices) && it.choices.length >= 2 ? it.choices : ['(fix me)', '(fix me)']
    q.answer = 0
  }
  questions.push(q)
}

const paper = { id, title, ...(source ? { source } : {}), questions }
const outFile = join(PAPERS_DIR, `${id}.json`)
writeFileSync(outFile, JSON.stringify(paper, null, 2) + '\n')
rmSync(tmp, { recursive: true, force: true })

const usage = response.usage
console.log(`\n✓ Extracted ${questions.length} question(s); cropped ${cropped} notation image(s).`)
console.log(`  ${outFile.replace(ROOT + '/', '')}`)
console.log(`  images → ${imgDir.replace(ROOT + '/', '')}/`)
console.log(`  (tokens: in ${usage.input_tokens}, out ${usage.output_tokens})`)
console.log('\n⚠ FIRST DRAFT — review the JSON and crops, fix anything wrong, then open the Papers tab.')
