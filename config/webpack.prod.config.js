var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.config.js');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

// Webpack Config
var webpackConfig = {
  entry: {
  },

  output: {
  },

  plugins: [
   
  ],

  module: {
    loaders: [
     
    ]
  }
};

module.exports = webpackMerge(commonConfig, webpackConfig);
