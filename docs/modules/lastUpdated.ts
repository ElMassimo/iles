import { sync as spawn } from 'cross-spawn'
import type { IlesModule } from 'iles'

export default () => ({
  name: 'git-last-updated-at',
  extendFrontmatter(frontmatter, filename) {
    const lastUpdated = lastUpdatedFromGit(filename)
    if (lastUpdated) { frontmatter.meta.lastUpdated = lastUpdated }
  },
}) as IlesModule

function lastUpdatedFromGit(filename: string) {
  try {
    const result = spawn('git', ['log', '-1', '--format=%at', filename])
    const date = new Date(Number.parseInt(result.stdout as any) * 1000)
    return Number.isNaN(Number(date)) ? null : date
  }
  catch {
    return null
  }
}
