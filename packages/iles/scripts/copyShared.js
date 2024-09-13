import fs from 'fs-extra'
import {globbySync} from 'globby'

globbySync('src/shared/**/*.ts').forEach((file) => {
  fs.copy(file, file.replace(/^src\/shared\//, 'src/node/'))
  fs.copy(file, file.replace(/^src\/shared\//, 'src/client/'))
})
