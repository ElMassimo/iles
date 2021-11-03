module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/frontmatter.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
