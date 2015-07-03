var path = require('path');
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var argv = require('yargs').argv;

module.exports = {
  entry: {
    'main': './src/main.js',
    'ie-less-than-9': './src/ie-less-than-9.js',
    'program_selection': './src/program_selection.js',
    'program_selection_stats': './src/program_selection_stats.js',
    'oos_listing': './src/oos_listing.js',
    'program_edit': './src/program_edit.js',
    'unit_bulk_edit_table': './src/unit_bulk_edit_table.js',
    'unit_table': './src/unit_table.js',
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.css$/, loader: 'style-loader!css-loader' },
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
  ],
  devtool: 'inline-source-map'
}