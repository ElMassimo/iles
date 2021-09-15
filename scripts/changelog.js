/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const execa = require('execa')
const chalk = require('chalk')

const name = args._[0]?.trim() || 'iles'

if (!name) {
  console.error(chalk.red(`Expected library name as an argument, received ${name}`))
  process.exit(1)
}

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

async function main () {
  await run('npx', [
    'conventional-changelog',
    '-p', 'angular',
    '-i', resolve('CHANGELOG.md'),
    '-s',
    '-t', `${name}@`,
    '--pkg', resolve('package.json'),
    '--commit-path', `./packages/${name}`,
  ])
}

main().catch((err) => {
  console.error(err)
})
