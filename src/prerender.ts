// Pre-render the app into static HTML.
import fs from 'fs'
import { resolve } from 'path'
import render from '../dist/server/main.js'

const toAbsolute = path => resolve(__dirname, '..', path)

const manifest = JSON.parse(fs.readFileSync(toAbsolute('./dist/client/ssr-manifest.json'), 'utf-8'))
const template = fs.readFileSync(toAbsolute('dist/client/index.html'), 'utf-8')

// determine routes to pre-render from src/pages
const files = Array.from(fs.readdirSync(toAbsolute('src/pages')))
console.log({ files: files.filter(file => !file.startsWith('.') && file.includes('.')) })

const routesToPrerender = files.map(file => {
  const name = file.replace(/\.(vue|mdx)$/, '').toLowerCase()
  return name === 'home' ? `/` : `/${name}`
})

;(async function () {
  console.log({ manifest, template, files, routesToPrerender, render })
  // pre-render each route...
for (const url of routesToPrerender) {
  const result = await render(url, { manifest, preload: true })
  console.log(result)
}
})()
