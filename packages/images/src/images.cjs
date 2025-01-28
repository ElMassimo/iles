module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/images.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
