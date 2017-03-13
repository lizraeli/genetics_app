const { resolve } = require('path') // utility for working with file and directory paths
const HtmlWebpackPlugin = require('html-webpack-plugin') // html bundler, picks up your bundle.js file too
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const srcDir = resolve(__dirname, 'src') // __dirname is the directory path of the current module
/*
test: /\.css$/,
use: [{
  loader: 'style-loader',
}, {
  loader: 'css-loader',
  options: {
    modules: true,
    localIdentName: '[name]-[local]-[hash:base64:6]', // declare naming format for css class
    camelCase: true, // heading-one becomes headingOne in javascript
  },
}],
*/
module.exports = {
  entry: [
    `${srcDir}/index.js`,
  ],
  output: {
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
      template: `${srcDir}/index.html`,
    }),
    new ExtractTextPlugin('styles.css'),
  ],
}
