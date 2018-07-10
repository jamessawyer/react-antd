const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const BASE_CONFIG = require('./webpack.base');

module.exports = merge(BASE_CONFIG, {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'happypack/loader?id=js', // 使用happypack提供的babel-loader
        exclude: /[\\/]node_modules[\\/]/,
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
  devServer: {
    stats: 'errors-only',
    host: '0.0.0.0', // 默认值是 localhost
    // port, // 默认值是 8080
    open: true,
    overlay: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
