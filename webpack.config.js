const path = require('path') // utility for working with file and directory paths
const HtmlWebpackPlugin = require('html-webpack-plugin') // for webpack to bundle your html
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
}

module.exports = {
  entry: [
    `${PATHS.app}/index.js`,
  ],
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?modules,localIdentName="[name]-[local]-[hash:base64:6]",camelCase',
      }),
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Alzheimer Genetic Database',
      template: `${PATHS.app}/index.html`,
    }),
    new ExtractTextPlugin('styles.css'), // webpack automatically looks for build folder
  ],
}
