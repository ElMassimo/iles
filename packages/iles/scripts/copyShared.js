import fs from 'fs-extra'
import { globSync } from 'tinyglobby'

globSync(['src/shared/**/*.ts']).forEach((file) => {
  fs.copy(file, file.replace(/src\/shared\//, 'src/node/')).catch(() => {})
  fs.copy(file, file.replace(/src\/shared\//, 'src/client/')).catch(() => {})
})
