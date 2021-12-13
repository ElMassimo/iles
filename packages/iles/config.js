// NOTE: This helper file allows to provide it as a config path to Vite or
// Vitest without using the iles executable.
module.exports = async (env, root = process.cwd()) => {
  const { resolve } = require('path')
  const { mergeConfig } = require('vite')
  const { default: IslandsPlugins, resolveConfig } = require('./dist/node')

  const config = await resolveConfig(root)

  return mergeConfig(config.vite, {
    resolve: {
      alias: {
        'lib/modules': resolve(__dirname, 'lib/modules.mjs'),
      },
    },
    plugins: IslandsPlugins(config),
  })
}
