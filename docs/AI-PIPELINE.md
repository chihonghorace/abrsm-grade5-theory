# AI question pipeline & architecture

How new "举一反三" questions are generated with an LLM **locally**, stored in a
JSON database, and served by the static site — **without ever exposing an API
key**.

## The two planes

```
┌─ LOCAL "content studio" (your machine — HAS the key) ──────────┐
│                                                                │
│  ABRSM public syllabus/format (reference, not copied)          │
│            │                                                   │
│            ▼                                                   │
│  npm run questions:generate   ← reads ANTHROPIC_API_KEY from   │
│            │                     .env via Node --env-file       │
│            ▼                     (.env is gitignored)           │
│  data/proposed/<topic>-<ts>.json   (drafts, gitignored)        │
│            │                                                   │
│       👤 human review (fix/delete weak or wrong items)         │
│            │                                                   │
│            ▼                                                   │
│  npm run questions:import  →  src/data/questions/<topic>.json  │
│            │                     (the committed "database")     │
│            ▼                                                   │
│  npm run questions:validate   (unique ids, answer range, …)    │
└────────────┬───────────────────────────────────────────────────┘
             │  git commit + push   (only JSON data — no key)
             ▼
┌─ GitHub Pages (static site — NO key, NO LLM at runtime) ───────┐
│  CI validates the bank → builds → deploys                      │
│  App reads src/data/questions/*.json (inlined at build time)   │
│  Practice + Mock reassemble RANDOM papers from the pool        │
└────────────────────────────────────────────────────────────────┘
```

**Why this split:** GitHub Pages serves static files to the public. Any key put
in the frontend would be readable by anyone. So the LLM runs only at authoring
time on your machine; the deployed site contains nothing but pre-generated JSON.

## Where the key lives (and where it never goes)

- ✅ `./.env` on your machine only — **gitignored**, read via Node's native
  `--env-file=.env` flag (no `dotenv` dependency).
- ❌ Never in the repo, the committed code, `package.json`, CI, or the built site.
- CI (`ci.yml`, and the `deploy.yml` validate step) only runs
  `questions:validate` + `build` — **no key required**.

Setup: `cp .env.example .env`, paste your key from
<https://console.anthropic.com/settings/keys>.

## Commands

```bash
# 1. Generate drafts for a topic (Opus 4.8, structured JSON output)
npm run questions:generate -- --topic intervals --count 12
#    optional: --difficulty 2   --model claude-sonnet-4-6

# 2. Review data/proposed/<file>.json by hand — delete/fix anything off.

# 3. Merge reviewed drafts into the database (assigns ids, de-dupes)
npm run questions:import -- data/proposed/intervals-<timestamp>.json

# 4. Validate, then commit & push (auto-deploys)
npm run questions:validate
git add src/data/questions && git commit -m "Add intervals questions" && git push
```

Topics: `keys-and-scales`, `intervals`, `chords-and-cadences`, `time-and-rhythm`,
`clefs`, `transposition`, `ornaments`, `terms-and-signs`, `instruments-and-voices`.

## Model & accuracy

- Default model: **`claude-opus-4-8`** with adaptive thinking and **structured
  outputs** (`output_config.format`) so every draft already matches the question
  schema (correct answer pinned at index 0).
- The model is told to write **original** questions from the public syllabus and
  **never** reproduce ABRSM's copyrighted papers (see [QUESTIONS.md](QUESTIONS.md)).
- **Human review is mandatory** — music theory has subtle errors (enharmonics,
  interval quality) an LLM can get wrong. `questions:import` + `questions:validate`
  catch structural problems; only a human catches musical ones.

## "Reassemble different exams"

The app already builds a **fresh, randomly-assembled paper every time**: Mock
Exam shuffles the pool and draws Quick/Standard/Full sets, and Practice shuffles
per session (and per-question choices). A bigger database simply means more
varied papers — no extra wiring needed. (A future option: save named fixed
papers for repeatable practice.)
