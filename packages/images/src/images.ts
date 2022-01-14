import type { IlesModule } from 'iles'
import type { ImageApi, ImagePresets, Options } from 'vite-plugin-image-presets'

import imagePresets from 'vite-plugin-image-presets'
import { join } from 'path'

export * from 'vite-plugin-image-presets'

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
            return { importName: 'Picture', path: join(__dirname, 'Picture.ts') }
        },
      ],
    },
    vite: { plugins: [plugin] },
  }
}
