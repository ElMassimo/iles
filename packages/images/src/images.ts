import type { IlesModule } from 'iles'
import type { ImageApi, ImagePresets, Options } from 'vite-plugin-image-presets'

import imagePresets from 'vite-plugin-image-presets'
import { resolve } from 'path'

export * from 'vite-plugin-image-presets'

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
            return { importName: 'Picture', path: PICTURE_COMPONENT_PATH }
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
  }
}
