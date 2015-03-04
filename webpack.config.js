var path = require('path');
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var argv = require('yargs').argv;

module.exports = {
  entry: {
    'main': './src/main.js',
    'ie-less-than-9': './src/ie-less-than-9.js',
    'program_selection': './src/program_selection.js',
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: require.resolve("react"), loader: "expose?React" },
      { test: require.resolve("react"), loader: "imports?shim=es5-shim/es5-shim&sham=es5-shim/es5-sham" }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src/components'],
  },
  plugins: [
    new webpack.DefinePlugin({
      '__PRODUCTION__': JSON.stringify(JSON.parse(argv.production || 'false'))
    }),
    commonsPlugin
  ]
}