const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfigFactory = require('./webpack.common.config.js');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const EvalSourceMapDevToolPlugin = require('webpack/lib/EvalSourceMapDevToolPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const commonConfig = commonConfigFactory({
  ENV
});
// Webpack Config
const webpackConfig = {
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].chunk.js',
    library: 'ac_[name]',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      /**
       * Css loader support for *.css files (styles directory only)
       * Loads external css styles into the DOM, supports HMR
       *
       */
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [path.resolve(__dirname, '../src', 'styles')]
      },

      /**
       * Sass loader support for *.scss files (styles directory only)
       * Loads external sass styles into the DOM, supports HMR
       *
       */
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: [path.resolve(__dirname, '../src', 'styles')]
      },

    ]
  },
  plugins: [
    new EvalSourceMapDevToolPlugin({
      moduleFilenameTemplate: '[resource-path]',
      sourceRoot: 'webpack:///'
    }),
    /**
     * Plugin: NamedModulesPlugin (experimental)
     * Description: Uses file names as module name.
     *
     * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
     */
    new NamedModulesPlugin(),
    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new LoaderOptionsPlugin({
      debug: true,
      options: {}
    }),
  ],

  devServer: {
    port: PORT,
    host: HOST,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    }
  },
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

module.exports = webpackMerge(commonConfig, webpackConfig);
