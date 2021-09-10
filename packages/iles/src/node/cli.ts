/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk'
import minimist from 'minimist'
import { build } from './build/build'

const argv: any = minimist(process.argv.slice(2))

console.log(chalk.cyan(`iles v${require('../../package.json').version}`))
console.log(chalk.cyan(`vite v${require('vite/package.json').version}`))

const command = argv._[0]
const root = argv._[command ? 1 : 0]
if (root) argv.root = root

if (command === 'build') {
  build(root, argv).catch((err: any) => {
    console.error(chalk.red('build error:\n'), err)
    process.exit(1)
  })
}
else {
  console.log(chalk.red(`unknown command "${command}".`))
  process.exit(1)
}
