const EVENT = process.env.npm_lifecycle_event || '';
const DEFAULT_METADATA = {
  title: 'Signature WCS',
  baseUrl: '/',
  AOT: !!process.env.BUILD_AOT || hasNpmFlag('aot'),
  WATCH: hasProcessFlag('watch'),
  tsConfigPath: 'tsconfig.webpack.json',

  /**
   * This suffix is added to the environment.ts file, if not set the default environment file is loaded (development)
   * To disable environment files set this to null
   */
  envFileSuffix: ''
};
console.log(DEFAULT_METADATA)

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function ngcWebpackSetup(prod, metadata) {

  if (!metadata) {
    metadata = DEFAULT_METADATA;
  }
  const buildOptimizer = prod && metadata.AOT;
  const sourceMap = true; // TODO: apply based on tsconfig value?
  const ngcWebpackPluginOptions = {
    skipCodeGeneration: false,
    sourceMap
  };

  if (!prod && metadata.WATCH) {
    // Force commonjs module format for TS on dev watch builds.
    ngcWebpackPluginOptions.compilerOptions = {
      module: 'commonjs'
    };
  }

  const buildOptimizerLoader = {
    loader: '@angular-devkit/build-optimizer/webpack-loader',
    options: {
      sourceMap
    }
  };

  const loaders = [{
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      use: buildOptimizer ? [buildOptimizerLoader, '@ngtools/webpack'] : ['@ngtools/webpack']
    },
    ...buildOptimizer ? [{
      test: /\.js$/,
      use: [buildOptimizerLoader]
    }] : []
  ];

  return {
    loaders,
    plugin: ngcWebpackPluginOptions
  };
}

exports.ngcWebpackSetup = ngcWebpackSetup;
exports.hasNpmFlag = ngcWebpackSetup;
exports.DEFAULT_METADATA = DEFAULT_METADATA;
