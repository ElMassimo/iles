import { sync as spawn } from 'cross-spawn'
import { IlesModule } from 'iles'

export default () => ({
  name: 'git-last-updated-at',
  extendFrontmatter (frontmatter, filename) {
    const lastUpdated = lastUpdatedFromGit(filename)
    if (lastUpdated)
      frontmatter.meta.lastUpdated = lastUpdated
  },
}) as IlesModule

function lastUpdatedFromGit (filename: string) {
  try {
    const result = spawn('git', ['log', '-1', '--format=%at', filename])
    return new Date(parseInt(result.stdout) * 1000)
  }
  catch {
    return null
  }
}
