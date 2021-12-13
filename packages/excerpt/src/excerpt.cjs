module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/excerpt.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
