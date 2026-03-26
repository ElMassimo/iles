module.exports = (...args) => new Promise((resolve, reject) => {
  import('../dist/feed.js')
    .then(m => resolve(m.default(...args)))
    .catch(reject)
})
