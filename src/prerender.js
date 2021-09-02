// Pre-render the app into static HTML.
const fs = require('fs')
const glob = require('fast-glob')
const { resolve } = require('path')
const render = require('../dist/server/main.js').default

const toAbsolute = path => resolve(__dirname, '..', path)

const manifest = JSON.parse(fs.readFileSync(toAbsolute('./dist/client/ssr-manifest.json'), 'utf-8'))

// determine routes to pre-render from src/pages
const routesToPrerender = glob.sync('**/*.{md,mdx,vue}', { cwd: toAbsolute('src/pages') })
  .map(file => {
    return `/${file.replace(/\.(vue|mdx|md)$/, '').toLowerCase()}`
      .replace('/index', '/')
  })
  .filter(file => !file.includes(':') && !file.includes('['))

// pre-render each route...
async function prerenderRoutes (routes) {
  for (const url of routes) {
    const filePath = `dist/client${url === '/' ? '/index' : url}.html`
    try {
      console.log({ url })
      let { html } = await render(url, { manifest, preload: true })
      html = html.replace(/<script\s*([^>]*?)>.*?<\/script>/sg, (script, attrs) => {
        if (script.includes('client-keep')) return script
        return ''
      })
      html = html.replace(/<link\s*([^>]*?)>/sg, (link, attrs) => {
        if (attrs.includes('modulepreload') && attrs.includes('.js')) return ''
        return link
      })
      fs.writeFileSync(toAbsolute(filePath), html)
      console.log('pre-rendered:', filePath)
    } catch (error) {
      console.error('could not prerender', filePath)
    }
  }
}

prerenderRoutes(routesToPrerender)
