/* eslint-disable @typescript-eslint/no-var-requires */
import { red, cyan } from 'nanocolors'
import minimist from 'minimist'
import { build } from './build/build'
import { createServer } from './server'

const argv: any = minimist(process.argv.slice(2))

console.info(cyan(`iles v${require('../../package.json').version}`))
console.info(cyan(`vite v${require('vite/package.json').version}`))

const command = argv._[0]
const root = argv._[command ? 1 : 0]
if (root) argv.root = root

if (!command || command === 'dev' || command === 'serve') {
  createServer(root, argv)
    .then(({ server }) => server.listen())
    .catch((err: any) => {
      console.error(red('error starting server:\n'), err)
      process.exit(1)
    })
}
else if (command === 'build') {
  build(root).catch((err: any) => {
    console.error(red('build error:\n'), err)
    process.exit(1)
  })
}
else {
  console.error(red(`unknown command "${command}".`))
  process.exit(1)
}
