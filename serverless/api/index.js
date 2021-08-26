const path = require('path')

const manifest = require(path.join(__dirname, 'renderer', 'ssr-manifest.json'))
const render = require(path.join(__dirname, 'renderer', 'main.js')).default

// Polyfill
globalThis.fetch = require('node-fetch')

module.exports = async (req, res) => {
  try {
    const protocol =
      req.protocol || (req.headers.referer || '').split(':')[0] || 'http'
    const host = process.env.VERCEL_URL
    const url = protocol + '://' + host + req.url

    const { html } = await render(url, { manifest, preload: true })

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.setHeader(
      'Cache-Control',
      'max-age=0, s-maxage=86400, stale-while-revalidate'
    )
    res.end(html)
  } catch (error) {
    console.error(error.stack)
    res.statusCode = 500
    res.end(error.stack)
  }
}
