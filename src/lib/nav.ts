import type { TopicId } from '../types'

export type View = 'home' | 'learn' | 'practice' | 'mock' | 'review'

/** Describes which questions a Practice session should draw from. */
export type PracticePool =
  | { kind: 'topic'; topic: TopicId | 'all'; label: string }
  | { kind: 'ids'; ids: string[]; label: string }
