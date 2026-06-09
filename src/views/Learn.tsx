import { useState } from 'react'
import type { PracticePool } from '../lib/nav'
import type { TopicNote } from '../types'
import { TOPICS, TOPIC_BY_ID } from '../data/topics'
import { QUESTIONS } from '../data/questions'
import Notation from '../components/Notation'

interface Props {
  startPractice: (pool: PracticePool) => void
}

export default function Learn({ startPractice }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (openId) {
    const topic = TOPIC_BY_ID[openId as keyof typeof TOPIC_BY_ID]
    const count = QUESTIONS.filter((q) => q.topic === topic.id).length
    return (
      <div className="space-y-4">
        <button onClick={() => setOpenId(null)} className="btn-ghost px-4 py-2 text-sm">
          ← All topics
        </button>

        <header className="clay-card p-5">
          <div className="text-4xl">{topic.icon}</div>
          <h1 className="mt-2 text-2xl font-black text-ink">{topic.title}</h1>
          <p className="mt-1 text-ink-soft">{topic.blurb}</p>
        </header>

        <div className="space-y-3">
          {topic.notes.map((note, i) => (
            <NoteCard key={i} note={note} />
          ))}
        </div>

        <button
          className="btn-primary w-full"
          onClick={() => startPractice({ kind: 'topic', topic: topic.id, label: topic.title })}
        >
          ✏️ Practise this topic ({count} questions)
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-ink">Learn</h1>
        <p className="text-ink-soft">Nine bite-sized revision topics for Grade 5.</p>
      </header>
      <div className="grid gap-3 stagger">
        {TOPICS.map((t, i) => {
          const count = QUESTIONS.filter((q) => q.topic === t.id).length
          return (
            <button
              key={t.id}
              style={{ ['--i' as string]: i }}
              onClick={() => setOpenId(t.id)}
              className="clay-card flex items-center gap-4 p-4 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="flex-1">
                <span className="block text-lg font-extrabold text-ink">{t.title}</span>
                <span className="block text-sm text-ink-soft">{t.blurb}</span>
              </span>
              <span className="chip bg-surface-2 text-ink-soft">{count} Q</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function NoteCard({ note }: { note: TopicNote }) {
  return (
    <div className="clay-soft p-5">
      <h3 className="text-lg font-extrabold text-brand-700">{note.heading}</h3>
      <NoteBody body={note.body} />
      {note.abc && (
        <div className="paper mt-3 px-3 py-3">
          <Notation abc={note.abc} scale={1.3} />
        </div>
      )}
    </div>
  )
}

/** Renders a note body: blank lines split paragraphs; "- " lines become bullets. */
function NoteBody({ body }: { body: string }) {
  const blocks: { type: 'p' | 'ul'; lines: string[] }[] = []
  for (const raw of body.split('\n')) {
    const line = raw.trimEnd()
    const isBullet = line.trimStart().startsWith('- ')
    const last = blocks[blocks.length - 1]
    if (isBullet) {
      const text = line.trimStart().slice(2)
      if (last && last.type === 'ul') last.lines.push(text)
      else blocks.push({ type: 'ul', lines: [text] })
    } else if (line.trim() === '') {
      // paragraph break — ignore, next non-empty starts a new block
    } else {
      if (last && last.type === 'p') last.lines.push(line)
      else blocks.push({ type: 'p', lines: [line] })
    }
  }
  return (
    <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-ink-soft">
      {blocks.map((b, i) =>
        b.type === 'ul' ? (
          <ul key={i} className="space-y-1.5">
            {b.lines.map((l, j) => (
              <li key={j} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-300" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>{b.lines.join(' ')}</p>
        ),
      )}
    </div>
  )
}
