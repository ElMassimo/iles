import type { PropType } from 'vue'
import { createStaticVNode, defineAsyncComponent, defineComponent, h } from 'vue'
import { useVueRenderer } from 'iles'
import type { Author, Extension, FeedFormat, FeedItem, FeedOptions, ResolvedItem } from './types'

const formats: Record<string, FeedFormat> = {
  atom: 'atom1',
  rss: 'rss2',
  json: 'json1',
}

type MaybeAsync<T> = Promise<T> | T

export interface FeedProps<T = FeedItem> {
  format?: 'atom' | 'rss' | 'json'
  options: FeedOptions
  items?: MaybeAsync<T>[]
  categories?: string[]
  contributors?: Author[]
  extensions?: Extension[]
}

export const RenderFeed = defineComponent({
  name: 'RenderFeed',
  props: {
    format: { type: String as PropType<'atom' | 'rss' | 'json'>, required: true },
    options: { type: Object as PropType<FeedOptions>, required: true },
    items: { type: Array as PropType<MaybeAsync<FeedItem>[]>, default: undefined },
    categories: { type: Array as PropType<string[]>, default: undefined },
    contributors: { type: Array as PropType<Author[]>, default: undefined },
    extensions: { type: Array as PropType<Extension[]>, default: undefined },
  },
  setup(props) {
    const renderContent = useVueRenderer()
    const renderComponent = import.meta.env.SSR ? renderFeed : renderRaw

    return () => {
      const format = formats[props.format || 'atom']
      if (!format) { throw new Error(`@islands/feed: Unknown format '${props.format}'`) }

      return h(defineAsyncComponent(async () => {
        const maybeItems = props.items || []

        const items = await Promise.all(maybeItems.map(async (maybeItem) => {
          const { description, content, ...item } = await maybeItem
          return {
            ...item,
            description: skipRender(description) ? description : await renderContent(description),
            content: skipRender(content) ? content : await renderContent(content),
          }
        }))

        return await renderComponent(format, { ...props, items })
      }))
    }
  },
})

async function renderFeed(format: FeedFormat, { options, ...props }: FeedProps<ResolvedItem>) {
  const { Feed } = await import('feed')
  const feed = new Feed(options)

  if (props.items) { (await Promise.all(props.items)).forEach(feed.addItem) }
  props.categories?.forEach(feed.addCategory)
  props.contributors?.forEach(feed.addContributor)
  props.extensions?.forEach(feed.addExtension)

  return createStaticVNode(feed[format](), 1)
}

function renderRaw(_format: FeedFormat, { options, ...props }: FeedProps) {
  const json = JSON.stringify({ ...options, ...props }, null, 2)
  const style = 'word-break: break-word; white-space: pre-wrap;'
  return h('pre', { style }, h('code', null, json))
}

function skipRender(content: any): content is string | undefined {
  return content === undefined || typeof content === 'string'
}
