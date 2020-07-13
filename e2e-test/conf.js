exports.config = {
  params: {
    basicUrl: 'http://localhost:3000/',
    incorrectBasicUrl: 'http://localhosts:3000/',
    newUser: {
      firstName: 'Shen',
      gender: 'male',
      email: 'shen@gmail.com',
      jobTitle: 'SDET',
      industry: 'Computer Software, QA, Test',
      city: 'Toronto, ON, CA',
      latitude: '43.4430753',
      longitude: '-79.2224728',
    },
    updateLocation: {
      id: '54e333ade19982b7e852edf9227485a6',
      city: 'Toronto, ON, CA',
      latitude: '43.4430753',
      longitude: '-79.2224728',
    },
    oldLocation: {
      id: '54e333ade19982b7e852edf9227485a6',
      city: 'New York, NY, USA',
      latitude: '40.7127753',
      longitude: '-74.0059728',
    },
  },
  specs: ['api-test-get-spec.js',
    'api-test-post-spec.js',
    'api-test-put-spec.js'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless',
        '--no-sandbox',
        '--disable=gpu',
        '--disable-dev-shm-usage'],
    },
  },
};
