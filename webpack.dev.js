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
      {
        test: /\.p?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              localIdentName: '[name]_[local]--[hash:base62:5]',
            },
          },
        ],
        exclude: /[\\/]node_modules[\\/]/,
      },
    ],
  },
  devServer: {
    stats: 'errors-only', // 控制打包信息的显示
    host: '0.0.0.0', // 默认值是 localhost, 这样服务器外部也可以访问
    // port, // 默认值是 8080
    open: true, // 是否打开浏览器
    overlay: true, // 是否显示错误遮罩
    historyApiFallback: true, // 404时替换为index.html
    hot: true, // 启用HMR
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
