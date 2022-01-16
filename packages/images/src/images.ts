import type { IlesModule } from 'iles'
import type { ImageApi, ImagePresets, Options } from 'vite-plugin-image-presets'

import imagePresets from 'vite-plugin-image-presets'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export * from 'vite-plugin-image-presets'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const PICTURE_COMPONENT_PATH = resolve(__dirname, '../src/Picture.vue')

/**
 * An iles module that configures vite-plugin-image-presets to easily optimize
 * and transform images in an iles site.
 */
export default function IlesImagePresets (presets: ImagePresets, options?: Options): IlesModule & { api: ImageApi } {
  const plugin = imagePresets(presets, { ...options, writeToBundle: false })

  return {
    name: '@islands/images',
    get api () {
      return plugin.api
    },
    ssg: {
      async onSiteRendered ({ config }) {
        await plugin.api.writeImages(config.outDir)
      },
    },
    components: {
      resolvers: [
        (name) => {
          if (name === 'Picture')
            return { path: PICTURE_COMPONENT_PATH }
        },
      ],
    },
    vite: {
      plugins: [
        plugin,
        {
          name: '@islans/images:inject-mdx-component',
          transform (code, id) {
            if (id.endsWith('composables/mdxComponents.js')) {
              code = code.replace('inject(mdxComponentsKey)', '{ img: _Picture, ...inject(mdxComponentsKey) }')
              return `import _Picture from '${PICTURE_COMPONENT_PATH}'\n${code}`
            }
          },
        }
      ]
    },
    vue: {
      template: {
        transformAssetUrls: {
          tags: {
            video: ['src', 'poster'],
            source: ['src', 'srcset'],
            img: ['src', 'srcset'],
            image: ['xlink:href', 'href'],
            use: ['xlink:href', 'href'],
            Picture: ['src'],
          },
        },
      },
    },
  }
}
