import { createServer } from './server'
import { build } from './build'
import chalk from 'chalk'
import minimist from 'minimist'

const argv: any = minimist(process.argv.slice(2))

console.log(chalk.cyan(`vite-islands v${require('../../package.json').version}`))
console.log(chalk.cyan(`vite v${require('vite/package.json').version}`))

const command = argv._[0]

if (command === 'build') {
  build(argv).catch((err) => {
    console.error(chalk.red(`build error:\n`), err)
    process.exit(1)
  })
} else {
  console.log(chalk.red(`unknown command "${command}".`))
  process.exit(1)
}

