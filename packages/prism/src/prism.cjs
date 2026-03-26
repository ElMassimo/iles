module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/prism.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
