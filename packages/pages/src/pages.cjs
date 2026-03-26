module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/pages.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
