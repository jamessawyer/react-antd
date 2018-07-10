webpack版本为 **`V4.15.0`**, webpack的设置一般分为：
  - development配置
  - production配置

然后一般webpack处理文件类型一般分为：
  - js文件的处理
  - devServer的设置
  - css文件的处理
  - images资源的处理
  - fonts字体方面的处理
  - sourceMaps的处理 (devtool) 的设置
    - js sourceMaps
    - css sourceMaps
  - production阶段的优化
    - 单独提取 'manifest' 文件
    - 使用 'optimization.splitChunk' 对打包文件进行拆包处理
  - 使用一些多核并行的处理方式，比如使用 'HappyPack'


## 1.设置配置和安装依赖

首先先安装webpack和webpack-cli, webpack-dev-server && webpack-merge
```
# webpack-dev-server 开发时在内存中启用的服务器
# webpack-merge 对配置文件进行合并操作
yarn add -D webpack webpack-cli webpack-dev-server webpack-merge
```

创建webpack配置文件
```
# webpack.base.js 公共配置
# webpack.dev.js 开发配置
# webpack.prod.js production配置
> touch webpack.dev.js webpack.prod.js webpack.base.js
```
在后面再配置

> 安装react react-dom antd

先将项目依赖下载进行调试
```
yarn add react react-dom prop-types antd
```

> 安装babel 和 配置 .babelrc

采用babel6, babel7尝试后发现跑不通，后面再升级
```
# babel 6.x
# babel-plugin-import 主要是用于antd中 待会再设置
yarn add -D babel-core babel-preset-react babel-preset-env babel-preset-react-hmre babel-plugin-import
```

配置 **`.babelrc`**
```
{
  "presets": ["env", "react"],
  "env": {
    "development": {
      "presets": ["react-hmre"]
    }
  }
}
```

## 2.使用HtmlWebpackPlugin生成HTML

使用 **`html-webpack-plugin`** 配合自定义模板将打好的包的js css插入到html中

```
# cross-env 用来设置环境变量 支持跨平台 比如windows MacOS 设置保持一致
yarn add -D html-webpack-plugin cross-env
```

> 设置 **`webpack.base.js`**

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const devMode = process.env.NODE_ENV === 'development'; // 是否是开发环境

module.exports = {
  mode: devMode ? 'development' : 'production', // 模式
  // 入口文件
  entry: {
    index: './src/index.js',
  },
  // 可以解析的扩展
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.pcss'],
  },
  // 公共插件
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Antd 管理后台',
      hash: false,
      template: 'index.html',
      favicon: 'favicon.ico',
      // production 时进行压缩
      // https://github.com/kangax/html-minifier#options-quick-reference
      minify: devMode
        ? null
        : {
            collapseWhitespace: true, // 去掉空白
            removeComments: true, // 去掉注释
            removeAttributeQuotes: true, // 去掉attribute value的引号
          },
    }),
  // ...
};
```
创建 "index.html"
```
> touch index.html

# index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>
    <%= htmlWebpackPlugin.options.title %>
  </title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

设置完上面的

> 设置基础的架子

```
> touch src/index.js src/App.js

# index.js
import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(<App name="hoho" />, document.getElementById('root'));


# App.js
import React from 'react';

export default ({ name }) => <h1>Hello webpack! {name}</h1>;
```

配置完这些之后，项目依旧不能运行，下面将设置js对应的loader

## 3.使用babel-loader 和 happypack 对js文件进行加载

```
# babel-loader 是js的加载器
# happypack 是一个对打包进行优化的多线程工具
# clean-webpack-plugin 用于清理文件目录 主要用于production阶段 在生成的dist文件夹之前先将其删除
> yarn add -D babel-loader happypack clean-webpack-plugin
```

配置在 **`webpack.base.js`** 中设置 [happypack](https://github.com/amireh/happypack)

```
# webpack.base.js
module.exports = {
  // ...
  plugins: [
    // ...
    new HappyPack({
      // https://www.npmjs.com/package/happypack
      id: 'js', // loader的id 会在webpackOptions.module.rules中使用
      threads: 4, // 启动线程数 默认为3
      loaders: ['babel-loader'], // 使用HappyPack 代理的loader
    }),
  ],
};
```

设置 **`webpack.dev.js`** 和 **`webpack.prod.js`**，此时两个配置暂时设置成一样的,后面可能有所不同

```
# webpack.dev.js 和 webpack.prod.js
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const BASE_CONFIG = require('./webpack.base');

module.exports = merge(BASE_CONFIG, {
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
});
```

另外 **`webpack.prod.js`** 添加clean-webpack-plugin 对生成的dist进行清理：
```
# webpack.prod.js
// ...
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(BASE_CONFIG, {
  module: {
    // ...
  },
  plugins: [
    new CleanWebpackPlugin(['dist']), // 对 'dist' 目录进行清理
  ]
});
```

此时应用依旧无法跑起来，下面设置开发服务

## 4.devServer的设置

devServer一般使用的是 **`webpack-dev-server`**

设置 **`webpack.dev.js`**
```
module.exports = merge(BASE_CONFIG, {
  // ...
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
```


配置参考：
  - [A tale of Webpack 4 and how to finally configure it in the right way hackernoon](https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1)
  - [ireader liumin1128 github webpack](https://github.com/liumin1128/ireader/blob/v2/webpack.config.js)
  - [react-mobx-react-router4 boilerplate webpack github](https://github.com/mhaagens/react-mobx-react-router4-boilerplate/blob/master/webpack.config.js)
  - [favesound redux webpack github](https://github.com/rwieruch/favesound-redux/blob/master/package.json)