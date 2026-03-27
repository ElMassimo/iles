import { promises as fs } from 'fs'
import { resolve } from 'path'
import { beforeAll, describe, expect, test } from 'vite-plus/test'

import { execa } from 'execa'

const projectRoot = resolve(__dirname, '../../..')

const packageNames = ['excerpt', 'feed', 'headings', 'icons', 'images', 'prism', 'pwa']
const expectedTypes = {
  excerpt: ['excerpt.d.ts'],
  feed: ['feed.d.ts', 'render-feed.d.ts', 'types.d.ts'],
  headings: ['headings.d.ts'],
  icons: ['icons.d.ts'],
  images: ['images.d.ts'],
  prism: ['prism.d.ts'],
  pwa: ['pwa.d.ts'],
}

describe('package type outputs', () => {
  beforeAll(async () => {
    await execa('pnpm', ['nx', 'run-many', '--target=build', '--projects', packageNames.map(name => `@islands/${name}`).join(',')], {
      cwd: projectRoot,
      stdio: process.env.DEBUG ? 'inherit' : undefined,
    })
  }, 120000)

  test('uses .d.ts outputs for migrated packages', async () => {
    for (const packageName of packageNames) {
      const distPath = resolve(projectRoot, `packages/${packageName}/dist`)
      const files = await fs.readdir(distPath)
      const dtsFiles = files.filter(file => file.endsWith('.d.ts')).sort()

      expect(dtsFiles).toEqual(expectedTypes[packageName as keyof typeof expectedTypes])
      expect(files.some(file => file.endsWith('.d.mts'))).toBe(false)
    }
  })
})
