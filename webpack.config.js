module.exports = {
    entry: './src/program_selection.js',
    output: {
        filename: 'bundle.js',
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
          { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    externals: {


        'react': 'React'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
