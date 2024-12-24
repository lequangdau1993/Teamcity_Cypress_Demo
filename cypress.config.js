module.exports = {
  video: false,
  e2e: {
    // baseUrl: 'http://localhost:8080',
    specPattern: [
      'cypress/e2e/**/*.{coffee,feature,features,spec.js}',
    ],
    experimentalRunAllSpecs: true,
    env: {
      grepOmitFiltered: true,
      grepFilterSpecs: true,

    },
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  },
}
