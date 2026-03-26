import type { FeedOptions, Item as ResolvedItem, Author, Extension } from 'feed'
import type { VueRenderable } from 'iles'

export type AsyncContent = string | VueRenderable

export type { FeedOptions, ResolvedItem, Author, Extension }

export interface FeedItem extends Omit<ResolvedItem, 'description' | 'content'> {
  description?: AsyncContent
  content?: AsyncContent
}

export type FeedFormat = 'atom1' | 'rss2' | 'json1'
