var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.config.js');
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

// Webpack Config
var webpackConfig = {

  devServer: {
    port: PORT,
    host: HOST,
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  }
};

module.exports = webpackMerge(commonConfig, webpackConfig);
