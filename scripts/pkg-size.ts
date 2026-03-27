import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packagesDir = path.resolve(__dirname, '../packages')

/**
 * @param {number} bytes
 */
function formatSize (bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * @param {string} dir
 */
function getDistSizes (dir: string) {
  let js = 0
  let dts = 0

  if (!fs.existsSync(dir)) return { js, dts }

  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    if (!current) continue

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name)

      if (entry.isDirectory()) {
        stack.push(file)
        continue
      }

      const size = fs.statSync(file).size
      if (/\.(?:mjs|cjs|js)$/.test(entry.name)) js += size
      else if (/\.d\.(?:ts|mts|cts)$/.test(entry.name)) dts += size
    }
  }

  return { js, dts }
}

const packages = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(packagesDir, entry.name, 'package.json')))
  .map(entry => {
    const packagePath = path.join(packagesDir, entry.name)
    const pkg = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf-8'))
    const { js, dts } = getDistSizes(path.join(packagePath, 'dist'))
    return {
      name: pkg.name || entry.name,
      js,
      dts,
      total: js + dts,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const nameWidth = Math.max('Package'.length, ...packages.map(item => item.name.length))
const jsWidth = Math.max('Dist JS'.length, ...packages.map(item => formatSize(item.js).length))
const dtsWidth = Math.max('Dist DTS'.length, ...packages.map(item => formatSize(item.dts).length))
const totalWidth = Math.max('Total'.length, ...packages.map(item => formatSize(item.total).length))

const header = `${'Package'.padEnd(nameWidth)}  ${'Dist JS'.padStart(jsWidth)}  ${'Dist DTS'.padStart(dtsWidth)}  ${'Total'.padStart(totalWidth)}`
const separator = `${'-'.repeat(nameWidth)}  ${'-'.repeat(jsWidth)}  ${'-'.repeat(dtsWidth)}  ${'-'.repeat(totalWidth)}`

console.info(header)
console.info(separator)

for (const item of packages) {
  console.info(`${item.name.padEnd(nameWidth)}  ${formatSize(item.js).padStart(jsWidth)}  ${formatSize(item.dts).padStart(dtsWidth)}  ${formatSize(item.total).padStart(totalWidth)}`)
}

const totalJs = packages.reduce((sum, item) => sum + item.js, 0)
const totalDts = packages.reduce((sum, item) => sum + item.dts, 0)
const totalAll = totalJs + totalDts
console.info(separator)
console.info(`${'Total'.padEnd(nameWidth)}  ${formatSize(totalJs).padStart(jsWidth)}  ${formatSize(totalDts).padStart(dtsWidth)}  ${formatSize(totalAll).padStart(totalWidth)}`)
