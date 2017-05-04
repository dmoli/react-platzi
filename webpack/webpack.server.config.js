const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function configFn(dir) {
  // exclude all node modules to production
  const nodeModules = fs
    .readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .reduce(
      (modules, module) => Object.assign(modules, { [module]: `commonjs ${module}` }),
      {}
    );

  const config = {
    entry: [`${dir}/source/server.jsx`],
    output: {
      filename: 'index.js',
      path: `${dir}/built/server`,
      publicPath: process.env.NOVE_ENV === 'production'
        ? 'http://platzi-react-sfs.now.sh'
        : 'http://localhost:3001',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          enforce: 'pre',
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /(node_modules)/,
          query: {
            presets: ['latest-minimal', 'react'],
            env: {
              production: {
                plugins: ['transform-regenerator', 'transform-runtime'],
                presets: ['es2015'],
              },
              development: {
                presets: ['latest-minimal'],
              },
            },
          },
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules' }),
        },
      ],
    },
    target: 'node',
    resolve: {
      extensions: ['.js', '.jsx', '.css'],
    },
    externals: nodeModules,
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      }),
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new ExtractTextPlugin('../statics/styles.css'),
    ],
  };

  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        mangle: {
          except: ['$super', '$', 'exports', 'require'],
        },
      })
    );
  }

  return config;
}

module.exports = configFn;
