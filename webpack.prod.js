const path = require('path');
const merge = require('webpack-merge');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostcssSafeParser = require('postcss-safe-parser');
const BASE_CONFIG = require('./webpack.base');

module.exports = merge(BASE_CONFIG, {
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'js/[name].[chunkhash:8].js',
    filename: 'js/[name].[hash:8].js',
    publicPath: '/',
  },
  optimization: {
    minimizer: [
      new UglifyWebpackPlugin({
        sourceMap: true,
        parallel: 4,
      }),
    ],
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
        exclude: /[\\/]node_modules[\\/]/,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          // 'css-loader?modules&importLoaders=1&localIdentName=[local]_[hash:base64:6]',
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.p?css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
        // 使cssnano以 safe模式运行
        // 避免错误的转换
        // safe: true, // 已经被废弃 使用postcss需要特别的parser
        parser: PostcssSafeParser,
      },
      canPrint: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash:8].css',
    }),
  ],
});
