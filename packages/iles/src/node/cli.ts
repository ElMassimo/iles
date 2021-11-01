/* eslint-disable @typescript-eslint/no-var-requires */
import { red, cyan, yellow, green } from 'nanocolors'
import minimist from 'minimist'
const argv: any = minimist(process.argv.slice(2))

const command = argv._[0]
const root = argv._[command ? 1 : 0]
if (root) argv.root = root

const getVersion = () => cyan(`iles v${require('../../package.json').version}`)
  + yellow(` vite v${require('vite/package.json').version}`)

const printVersion = () => console.info(getVersion())

executeCommand(!command || command === 'dev' ? 'serve' : command)
  .catch(error => { throw error })

async function executeCommand (command: string) {
  if (command === 'serve') {
    const { createServer } = await import('./server')
    createServer(root, argv)
      .then(async ({ server }) => {
        await server.listen()
        const { config: { logger } } = server
        logger.info(getVersion() + green(' dev server running at:\n'), { clear: !logger.hasWarned })
        server.printUrls()
      })
      .catch((err: any) => {
        console.error(red('error starting server:\n'), err)
        process.exit(1)
      })
  }
  else if (command === 'build') {
    printVersion()
    const { build } = await import('./build/build')
    build(root).catch((err: any) => {
      console.error(red('build error:\n'), err)
      process.exit(1)
    })
  }
  else if (command === 'info') {
    printVersion()
  }
  else {
    console.error(red(`unknown command "${command}".`))
    process.exit(1)
  }
}
