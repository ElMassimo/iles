import { fileURLToPath } from 'url'
import { dirname, join } from 'pathe'
import type { IlesModule } from 'iles'

export * from './types'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * An iles module that provides a component to generate RSS, Atom, and JSON feeds.
 */
export default function IlesFeed (): IlesModule {
  return {
    name: '@islands/feed',
    components: {
      resolvers: [
        (name) => {
          if (name === 'RenderFeed')
            return { name: 'RenderFeed', from: join(__dirname, 'render-feed') }
        },
      ],
    },
  }
}
