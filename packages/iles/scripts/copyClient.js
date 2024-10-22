import fs from 'fs-extra'
import { globSync } from 'tinyglobby'

function toDest(file) {
  return file.replace(/src\//, 'dist/')
}

globSync(['src/client/**/!(*.ts|tsconfig.json|*.vue)']).forEach((file) => {
  fs.copy(file, toDest(file)).catch(() => {})
})
