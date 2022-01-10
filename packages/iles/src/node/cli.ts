/* eslint-disable @typescript-eslint/no-var-requires */
import pc from 'picocolors'
import minimist from 'minimist'
const argv: any = minimist(process.argv.slice(2))

const command = argv._[0]
const root = argv._[command ? 1 : 0]
if (root) argv.root = root

const getVersion = () => pc.cyan(`iles v${require('../../package.json').version}`)
  + pc.yellow(` vite v${require('vite/package.json').version}`)

const printVersion = () => console.info(getVersion())

executeCommand(!command || command === 'dev' ? 'serve' : command)
  .catch((error) => { throw error })

async function executeCommand (command: string) {
  if (command === 'serve') {
    const { createServer } = await import('./server')
    createServer(root, argv)
      .then(async ({ server }) => {
        await server.listen()
        const { config: { logger } } = server
        logger.info(getVersion() + pc.green(' dev server running at:\n'), { clear: !logger.hasWarned })
        server.printUrls()
      })
      .catch((err: any) => {
        console.error(pc.red('error starting server:\n'), err)
        process.exit(1)
      })
  }
  else if (command === 'build') {
    printVersion()
    const { build } = await import('./build/build')
    build(root).catch((err: any) => {
      console.error(pc.red('build error:\n'), err)
      process.exit(1)
    })
  }
  else if (command === 'preview') {
    printVersion()
    const { preview } = await import('./preview')
    preview(root, argv).catch((err: any) => {
      console.error(pc.red('error starting preview:\n'), err)
      process.exit(1)
    })
  }
  else if (command === 'info') {
    printVersion()
  }
  else if (command === 'test') {
    const { CONFIG_PATH } = await import('./alias')
    const { spawn } = await import('child_process')
    const args = process.argv.slice(2 + argv._.length)
    spawn('vitest', ['--config', CONFIG_PATH, ...args], { stdio: 'inherit' })
      .on('exit', code => process.exit(code || 0))
  }
  else {
    console.error(pc.red(`unknown command "${command}".`))
    process.exit(1)
  }
}
