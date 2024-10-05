import fs from 'fs-extra'
import { globbySync } from 'globby'

function toDest(file) {
  return file.replace(/^src\//, 'dist/')
}

globbySync('src/client/**/!(*.ts|tsconfig.json)').forEach((file) => {
  fs.copy(file, toDest(file))
})
