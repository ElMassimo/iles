import path from 'node:path'
import fs from 'node:fs'
import minimist from 'minimist'
import { execa } from 'execa'
import { fileURLToPath } from 'url'

const args = minimist(process.argv.slice(2))
const name = args._[0]?.trim() || 'iles'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {object} opts
 */
const run = async (bin, args, opts = {}) => await execa(bin, args, { stdio: 'inherit', ...opts })

/**
 * @param {string} paths
 */
const resolve = paths => path.resolve(__dirname, `../packages/${name}/${paths}`)

const tagPrefix = name === 'iles' ? 'v' : `${name}@`

async function main () {
  await run('npx', [
    'conventional-changelog',
    '-p', 'angular',
    '-i', resolve('CHANGELOG.md'),
    '-s',
    '-t', tagPrefix,
    '--pkg', resolve('package.json'),
    '--commit-path', `./packages/${name}`,
  ])
}

main().catch((err) => {
  console.error(err)
})
