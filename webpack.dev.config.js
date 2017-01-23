const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const resolve = path.resolve

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './index_dev.js'
    // the entry point of our app, for dev, the real one is index.js
  ],
  output: {
    filename: 'bundle.js',
    // the output bundle

    path: resolve(__dirname, 'dist'),

    publicPath: '/'
    // necessary for HMR to know where to load the hot update chunks
  },

  context: resolve(__dirname, 'src'),

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    // activate hot reloading

    contentBase: resolve(__dirname, 'dist'),
    // match the output path

    publicPath: '/'
    // match the output `publicPath`
  },
  resolve: {
    // extensions: ['', '.js'], // this was breaking the map gl stuff?
    alias: {
      webworkify: 'webworkify-webpack',
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
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
      // for map gl XXX add to prod
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
    // postLoaders: [{
    //   include: /node_modules\/mapbox-gl/,
    //   loader: 'transform-loader',
    //   query: 'brfs',
    // }],

  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
  node: {
    fs: 'empty',
  },
};


// removed from babelrc, appears not to be needed and of course broke prod build
//
// "plugins": [
//   "react-hot-loader/babel"
//   // Enables React code to work with HMR.
// ]
