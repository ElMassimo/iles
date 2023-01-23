import { fileURLToPath } from 'url'
import { dirname, resolve } from 'pathe'
import type { IlesModule } from 'iles'
import type { ImageApi, ImagePresets, Options } from 'vite-plugin-image-presets'

import imagePresets from 'vite-plugin-image-presets'

export * from 'vite-plugin-image-presets'

const _dirname = typeof __dirname === 'undefined'
  ? dirname(fileURLToPath(import.meta.url))
  : __dirname

export const PICTURE_COMPONENT_PATH = resolve(_dirname, '../src/Picture.vue')

const imagePresetsPlugin: typeof import('vite-plugin-image-presets').default
  = (imagePresets as any).default ?? imagePresets

/**
 * An iles module that configures vite-plugin-image-presets to easily optimize
 * and transform images in an iles site.
 */
export default function IlesImagePresets (presets: ImagePresets, options?: Options): IlesModule & { api: ImageApi } {
  const plugin = imagePresetsPlugin(presets, { ...options, writeToBundle: false })

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
            return { from: PICTURE_COMPONENT_PATH }
        },
      ],
    },
    vite: {
      plugins: [
        plugin,
        {
          name: '@islans/images:inject-mdx-component',
          transform (code, id) {
            if (id.includes('/composables/mdxComponents.js')) {
              code = code.replace('inject(mdxComponentsKey)', '{ img: _Picture, ...inject(mdxComponentsKey) }')
              return `import _Picture from '${PICTURE_COMPONENT_PATH}'\n${code}`
            }
          },
        },
      ],
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
