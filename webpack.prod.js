const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BASE_CONFIG = require('./webpack.base');

module.exports = merge(BASE_CONFIG, {
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'js/[name].[chunkhash:8].js',
    filename: 'js/[name].[hash:8].js',
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
  plugins: [new CleanWebpackPlugin(['dist'])]
});
