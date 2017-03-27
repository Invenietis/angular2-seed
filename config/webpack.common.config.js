const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    'polyfills': './src/polyfills.browser.ts',
    'vendor': './src/vendor.browser.ts',
    'main': './src/main.browser.ts',
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules')],
    plugins: [
      new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
    ]
  },
  module: {
    rules: [
      // .ts files for TypeScript
      {
        test: /\.ts$/,
        use: [
          { // MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
            loader: 'ng-router-loader',
            options: {
              loader: 'async-import',
              genDir: 'compiled',
            }
          },
          {
            loader: 'awesome-typescript-loader',
            // options: {
            //   configFileName: 'tsconfig.webpack.json'
            // }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
        exclude: [path.resolve(__dirname, '../src/index.html')]
      },
      /* 
        * File loader for supporting images, for example, in CSS files.
        */
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      },

      /* File loader for supporting fonts, for example, in CSS files.
      */
      { 
        test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    /*
     * Plugin: CheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new CheckerPlugin(),
    
    /*
     * Plugin: CommonsChunkPlugin
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
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
