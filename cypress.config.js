module.exports = {
  'projectId': '4b7344',
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: [
      'cypress/e2e/**/*.{coffee,feature,features,spec.js}',
    ],
    experimentalRunAllSpecs: true,
    env: {
      grepOmitFiltered: true,
      grepFilterSpecs: true,
    },
  },
}
