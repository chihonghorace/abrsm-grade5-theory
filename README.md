# 🎼 ABRSM Grade 5 Music Theory Trainer

A free, mobile-friendly web app for revising **ABRSM Grade 5 Music Theory** and
sitting timed mock exams. Everything runs in the browser — no account, no
server, no cost. Progress is saved locally on the device.

> Built to be hosted for free on **GitHub Pages**.

## ✨ Features

- **Learn** — 9 concise revision topics (keys & scales, intervals, chords &
  cadences, time & rhythm, clefs, transposition, ornaments, terms & signs,
  instruments & voices) with real music notation rendered on a stave.
- **Practice** — 175+ questions; answer by topic or mixed (choose a 10 / 20 /
  All set length), with **instant feedback** and an explanation for every answer.
- **Mock exam** — timed (Quick / Standard / Full), no peeking, flag-and-revisit,
  a question palette, auto-submit when the clock runs out, then a **per-topic
  score breakdown** using the real ABRSM thresholds (66% Pass · 80% Merit ·
  90% Distinction).
- **Review** — automatically collects the questions you got wrong plus anything
  you bookmark, so revision targets the weak spots.
- **Progress tracking** — accuracy, coverage and mock history persist in
  `localStorage`.

## 🧰 Tech stack

Vite · React · TypeScript · Tailwind CSS · [abcjs](https://www.abcjs.net/) for
notation. The app uses in-app (state-based) navigation, so there are no
client-side routes to break on GitHub Pages.

## 🚀 Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Build a production bundle:

```bash
npm run build
npm run preview
```

## 🌐 Deploy to GitHub Pages (free)

1. Create a new repository on GitHub and push this project to the `main` branch.
2. In the repo, go to **Settings → Pages** and set **Source = GitHub Actions**.
3. That's it. The included workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
   builds the site and publishes it on every push to `main`. Your sister gets a
   URL like `https://<your-username>.github.io/<repo-name>/`.

`vite.config.ts` uses a relative `base` (`'./'`), so the build works whether
it's hosted at a project path, a user page, or a custom domain — no extra
config needed.

## ➕ Adding or editing questions

The question bank is a **JSON database**: one file per topic under
[`src/data/questions/`](src/data/questions/). The app loads them at build time;
validate any change with `npm run questions:validate`.

Two ways to add questions:

1. **By hand** — append an object to the relevant `src/data/questions/<topic>.json`:

   ```json
   {
     "id": "iv-25",
     "topic": "intervals",
     "difficulty": 2,
     "prompt": "C up to D is a:",
     "abc": "[CD]",
     "choices": ["Major 2nd", "Minor 2nd", "Major 3rd", "Perfect 4th"],
     "answer": 0,
     "explanation": "C–D is two semitones — a major 2nd."
   }
   ```

2. **With the local AI generator** — `npm run questions:generate` drafts new
   "举一反三" questions with Claude, you review them, then `questions:import`
   merges them in. The API key stays on your machine and never reaches the
   hosted site. Full flow + the safe-key architecture: [`docs/AI-PIPELINE.md`](docs/AI-PIPELINE.md).

See [`docs/QUESTIONS.md`](docs/QUESTIONS.md) for the authoring guide, Grade 5
coverage checklist, and the **copyright note** (we reference ABRSM's public
syllabus/format, never their actual questions).

Notes:

- Always put the **correct answer at index 0**; the app shuffles choices for
  display, so position never gives the answer away.
- Study notes live in [`src/data/topics.ts`](src/data/topics.ts) and use the
  same optional `abc` field for notation examples.
- The `abc` field accepts standard [ABC notation](https://abcnotation.com/).
  A bare snippet like `[CE]` is auto-wrapped with a sensible header; for full
  control, start the string with `X:1`.

## 🗺️ Roadmap ideas

- More questions per topic and a larger "Full" mock.
- Audio playback of notation (abcjs supports MIDI).
- An optional AI tutor ("explain my mistake" / auto-generate questions) via a
  bring-your-own-key panel, keeping the site fully static.

---

Made with ❤️ for exam revision. Not affiliated with ABRSM.
