const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    index: './src/index.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.pcss'],
  },
  devtool: devMode ? 'cheap-eval-source-map' : 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Antd 管理后台',
      hash: false,
      template: 'index.html',
      favicon: 'favicon.ico',
      minify: devMode
        ? null
        : {
            collapseWhitespace: true, // 去掉空白
            removeComments: true, // 去掉注释
            removeAttributeQuotes: true, // 去掉attribute value的引号
          },
    }),
    new HappyPack({
      // https://www.npmjs.com/package/happypack
      id: 'js', // loader的id
      threads: 4, // 启动线程数 默认为3
      loaders: ['babel-loader'],
    }),
  ],
};
