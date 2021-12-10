import type { IlesModule } from 'iles'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

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
            return { importName: 'RenderFeed', path: join(__dirname, 'render-feed') }
        }
      ],
    },
  }
}
