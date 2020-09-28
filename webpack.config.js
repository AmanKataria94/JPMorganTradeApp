const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

//require("babel-register");
// Webpack Configuration
const config = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  // Output
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  // Loaders
  module: {
    rules: [
      // JavaScript/JSX Files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react']
            }
          }
        ]
      },
      // CSS Files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.glsl$/,
        use: [{
          loader: path.resolve('loader/loader.js')
        }]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },
  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      hash: true
    })
  ],

  watch: false,
  devtool: 'source-map',
};
// Exports
module.exports = config;