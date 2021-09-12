import chalk from 'chalk'
export function buildLog (text: string, count?: number) {
  // eslint-disable-next-line no-console
  console.log(`\n${chalk.gray('[vite-ssg]')} ${chalk.yellow(text)}${count ? chalk.blue(` (${count})`) : ''}`)
}

export function getSize (str: string) {
  return `${(str.length / 1024).toFixed(2)} KiB`
}

