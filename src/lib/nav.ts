import type { TopicId } from '../types'

export type View = 'home' | 'learn' | 'practice' | 'mock' | 'review'

/**
 * Describes which questions a Practice session should draw from.
 * `limit` optionally caps the session length (after shuffling); omit for "all".
 */
export type PracticePool =
  | { kind: 'topic'; topic: TopicId | 'all'; label: string; limit?: number }
  | { kind: 'ids'; ids: string[]; label: string; limit?: number }
