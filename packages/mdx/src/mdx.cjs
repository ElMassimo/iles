module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/mdx.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
