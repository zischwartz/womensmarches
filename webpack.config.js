const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const resolve = path.resolve


module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: './dist'
  },
  context: resolve(__dirname, 'src'),
  module: {
    loaders: [
      { test: /\.js$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
          // 'postcss-loader',
        ],
      },
      // for mapbox gl js
      {
        test: /\.json$/,
        exclude: path.resolve(__dirname, 'data/gear.json'),
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
        loader: 'worker'
      },
      {
        // test: /mapbox-gl.+\.js$/,
        // include: /node_modules\/mapbox-gl/,
        include: path.resolve(__dirname, 'node_modules/mapbox-gl/js/render/shaders.js'),
        loader: 'transform/cacheable?brfs',
        enforce: 'post'
      }

    ],
  },
  resolve: {
    // extensions: ['', '.js'], // this was breaking the map gl stuff?
    alias: {
      webworkify: 'webworkify-webpack',
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // activates HMR
    //html
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      filename: 'index.html'
    }),

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
  ],
}
