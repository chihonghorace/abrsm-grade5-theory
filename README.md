# 🎼 ABRSM Grade 5 Music Theory Trainer

A free, mobile-friendly web app for revising **ABRSM Grade 5 Music Theory** and
sitting timed mock exams. Everything runs in the browser — no account, no
server, no cost. Progress is saved locally on the device.

> Built to be hosted for free on **GitHub Pages**.

## ✨ Features

- **Learn** — 9 concise revision topics (keys & scales, intervals, chords &
  cadences, time & rhythm, clefs, transposition, ornaments, terms & signs,
  instruments & voices) with real music notation rendered on a stave.
- **Practice** — answer questions by topic or mixed, with **instant feedback**
  and an explanation for every answer.
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

The whole app is data-driven. To add questions, append to
[`src/data/questions.ts`](src/data/questions.ts):

```ts
{
  id: 'iv-13',                 // unique id
  topic: 'intervals',          // must match a TopicId
  difficulty: 2,               // 1–3
  prompt: 'C up to D is a:',
  abc: '[CD]',                 // optional — renders a stave (ABC notation)
  choices: ['Major 2nd', 'Minor 2nd', 'Major 3rd', 'Perfect 4th'],
  answer: 0,                   // index of the CORRECT choice
  explanation: 'C–D is two semitones — a major 2nd.',
}
```

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
