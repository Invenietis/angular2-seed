const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    'main': './src/main.browser.ts',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules')],
    plugins: [
      new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
    ]
  },
  module: {
    loaders: [
      // .ts files for TypeScript
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      },
      { test: /\.css$/, loaders: ['to-string-loader', 'css-loader'] },
      { 
        test: /\.html$/, 
        loader: 'raw-loader',
        exclude: [path.resolve(__dirname, '../src/index.html')]
      }
    ]
  },
  plugins: [
      new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      path.resolve(__dirname, '../src'),
      {
        // your Angular Async Route paths relative to this root directory
      }),
      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency'
    })
  ],
  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false,
    clearImmediate: false,
    setImmediate: false
  }
};
