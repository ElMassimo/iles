module.exports = {
  viewportWidth: 1280,
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3050',
  },
}
