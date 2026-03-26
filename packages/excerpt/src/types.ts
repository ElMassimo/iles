import type { Node } from 'hast'
import type { VFile } from 'vfile'

export type ExtractFn = (content: string, vfile: VFile) => string | undefined

export type SeparatorFn = (node: Node, index: number) => boolean

export interface ExcerptOptions {
  /**
   * Function to extract the excerpt from an MDX document.
   */
  extract?: ExtractFn
  /**
   * Tag name(s) of the separator or a function that returns true when it finds one.
   * @default ['excerpt', 'Excerpt']
   */
  separator?: string | string[] | SeparatorFn
  /**
   * An optional max length for the extracted excerpt.
   */
  maxLength?: number
}

export interface Options {
  extract?: ExtractFn
  isSeparator: SeparatorFn
  maxLength?: number
}
