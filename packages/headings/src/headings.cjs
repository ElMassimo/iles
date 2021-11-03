module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/headings.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
