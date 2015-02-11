module.exports = {
  entry: {
    app: './public/modules/app.js',
    oos: './public/modules/oos.js'
  },
  output: {
    path: './public/js',
    filename: '[name].js' // Template based on keys in entry above
  }
};