/* eslint-disable no-unused-expressions */
import yargs from 'yargs'
import { createServer, build, preview } from '.'

yargs
  .scriptName('vite-islands')
  .usage('$0 [args]')
  .command(
    'build [root]',
    'Build Static Site with Islands of Interactivity',
    args => args
      .option('mock', {
        type: 'boolean',
        describe: 'Mock browser globals (window, document, etc.) for SSG',
      }),
    async (argv) => {
      await build(argv).catch(error => {
        console.error(chalk.red(`build error:\n`), error)
        process.exit(1)
      })
    },
  )
  .command(
    ['dev [root]', 'serve [root]', '$0 [root]'],
    'Serve for Development',
    async (argv) => {
      await createServer(argv)
        .then(server => server.listen())
        .catch(error => {
          console.error(chalk.red(`failed to start server. error:\n`), error)
          process.exit(1)
        })
    },
  )
  .command(
    'preview [root]',
    'Preview the built site',
    async (argv) => {
      await preview(argv).catch((error) => {
        console.error(chalk.red(`failed to start server. error:\n`), error)
        process.exit(1)
      })
    },
  )
  .argv
  .showHelpOnFail(false)
  .help()
  .argv
