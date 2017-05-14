require('dotenv').config(); // import environmental variables from .env file
var Path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssOutputPath = '/styles/app.css';
var jsOutputPath = '/scripts/app.js';
var ExtractSASS = new ExtractTextPlugin(cssOutputPath);


// ------------------------------------------
// Base
// ------------------------------------------
var webpackConfig = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
        ENV_URL: JSON.stringify(process.env.ENV_URL || 'http://hr-xmen.herokuapp.com'),
        PORT: JSON.stringify(process.env.PORT || 80)
      },
    }),
    new HtmlWebpackPlugin({
      template: Path.join(__dirname, './client/index.html'),
    }),
  ],
  module: {
    loaders: [{
      test: /.jsx?$/,
      include: Path.join(__dirname, './client/app'),
      loader: 'babel',
    }],
  },
};

// ------------------------------------------
// Entry points
// ------------------------------------------
webpackConfig.entry = [Path.join(__dirname, './client/app/index')];

// ------------------------------------------
// Bundle output
// ------------------------------------------
webpackConfig.output = {
  publicPath: '/app',
  path: Path.join(__dirname, './dist'),
  filename: jsOutputPath,
};

// ------------------------------------------
// Devtool
// ------------------------------------------
webpackConfig.devtool = 'source-map';

// ------------------------------------------
// Module
// ------------------------------------------
webpackConfig.module.loaders.push({
  test: /\.scss$/,
  loader: ExtractSASS.extract(['css', 'sass']),
});

// ------------------------------------------
// Plugins
// ------------------------------------------
webpackConfig.plugins.push(
  new Webpack.optimize.OccurenceOrderPlugin(),
  new Webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }),
  ExtractSASS
);

module.exports = webpackConfig;
