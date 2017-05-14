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
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        ENV_URL: JSON.stringify(process.env.ENV_URL || 'http://localhost'),
        PORT: JSON.stringify(process.env.PORT || 8080)
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
webpackConfig.entry = process.env.CLIENT_DEV === 'true'
  ? ['webpack-dev-server/client?http://localhost:' + process.env.CLIENT_DEV_PORT,
     'webpack/hot/dev-server',
     Path.join(__dirname, './client/app/index')]
  : [Path.join(__dirname, './client/app/index')];

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
webpackConfig.devtool = 'cheap-eval-source-map';

// ------------------------------------------
// Module
// ------------------------------------------
webpackConfig.module.loaders.push({
  test: /\.scss$/,
  loaders: ['style', 'css', 'sass'],
});

// ------------------------------------------
// Plugins
// ------------------------------------------
webpackConfig.plugins.push(
  new Webpack.HotModuleReplacementPlugin()
);

// ------------------------------------------
// Client Dev Server
// ------------------------------------------
if (process.env.CLIENT_DEV === 'true') {
  webpackConfig.devServer = {
    contentBase: Path.join(__dirname, './'),
    hot: true,
    port: process.env.CLIENT_DEV_PORT,
    inline: true,
    progress: true,
    historyApiFallback: true,
  };
}


module.exports = webpackConfig;
