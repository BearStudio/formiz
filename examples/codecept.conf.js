exports.config = {
  tests: './tests/*.test.js',
  output: './output',
  helpers: {
    TestCafe: {
      url: 'http://localhost:3010',
      browser: 'chrome',
      show: true,
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'examples',
  plugins: {
    retryFailedStep: {
      enabled: false,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
