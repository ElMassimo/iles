import type { FeedOptions, Item, Author, Extension } from 'feed'
import { createStaticVNode, defineComponent, PropType, defineAsyncComponent, h } from 'vue'
import { useVueRenderer } from 'iles'

type AsyncContent = Parameters<ReturnType<typeof useVueRenderer>>[0]

interface AsyncItem extends Omit<Item, 'description' | 'content'> {
  description?: string | AsyncContent
  content?: string | AsyncContent
}

interface FeedProps<T = AsyncItem> {
  format?: 'atom' | 'rss' | 'json'
  options: FeedOptions
  items?: T[]
  categories?: string[]
  contributors?: Author[]
  extensions?: Extension[]
}

type FeedFormat = 'atom1' | 'rss2' | 'json1'

const formats: Record<string, FeedFormat> = {
  atom: 'atom1',
  rss: 'rss2',
  json: 'json1',
}

const isSSR = typeof window === undefined

export const RenderFeed = defineComponent({
  name: 'RenderFeed',
  props: {
    format: { type: String as PropType<'atom' | 'rss' | 'json'>, required: true },
    options: { type: Object as PropType<FeedOptions>, required: true },
    items: { type: Array as PropType<AsyncItem[]>, default: undefined },
    categories: { type: Array as PropType<string[]>, default: undefined },
    contributors: { type: Array as PropType<Author[]>, default: undefined },
    extensions: { type: Array as PropType<Extension[]>, default: undefined },
  },
  setup (props) {
    const renderContent = useVueRenderer()
    const renderComponent = isSSR ? renderFeed : renderRaw

    return () => {
      const format = formats[props.format || 'atom']
      if (!format) throw new Error(`@islands/feed: Unknown format '${props.format}'`)

      let itemPromises = (props.items || []).map(({ description, content, ...item }) => ({
        description: skipRender(description) ? description : renderContent(description),
        content: skipRender(content) ? content :  renderContent(content),
        ...item,
      }))

      console.log('itemPromises', itemPromises.map(i => i.content))

      return h(defineAsyncComponent(async () => {
        const items = await Promise.all(itemPromises.map(async (item) => ({
          ...item,
          description: await item.description,
          content: await item.content,
        })))

        return await renderComponent(format, { ...props, items })
      }))
    }
  },
})

async function renderFeed (format: FeedFormat, { options, ...props }: FeedProps<Item>) {
  const { Feed } = await import('feed')
  const feed = new Feed(options)

  props.items?.forEach(feed.addItem)
  props.categories?.forEach(feed.addCategory)
  props.contributors?.forEach(feed.addContributor)
  props.extensions?.forEach(feed.addExtension)

  return createStaticVNode(feed[format](), 1)
}

function renderRaw (_format: FeedFormat, { options, ...props }: FeedProps) {
  const json = JSON.stringify({ ...options, ...props }, null, 2)
  const style = 'word-break: break-word; white-space: pre-wrap;'
  return h('pre', { style }, h('code', null, json))
}

function skipRender (content: any): content is string | undefined {
  return content === undefined || typeof content === 'string'
}
