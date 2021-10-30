## Webpack

#### 举例

目录结构

```
├── config
│   └── rules.js
├── package.json
├── postcss.config.js
├── scripts
│   ├── build.js
│   └── dev.js
├── src
│   ├── assets
│   ├── components
│   └── pages
│       ├── demo
│       │   ├── app.jsx
│       │   ├── main.jsx
│       │   └── model
│       │       └── store.js
│       └── demo2
│           ├── app.jsx
│           ├── main.jsx
│           └── model
│               └── store.js
├── webpack.config.js
```

关于 store，使用的是 [Mobx](https://github.com/mobxjs/mobx)

#### 业务代码

- `demo/app.jsx`

  ```jsx
  import { Button, Form, Card } from 'antd';
  import FormItem from '@components/Form';
  import store from './model/store'
  import { observer } from 'mobx-react'
  
  @observer
  export default class App extends React.Component {
    render() {
      const { total } = store;
      return <Card>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <FormItem label='数字输入' component='inputNumber' value={total}></FormItem>
          <FormItem label='输入' component='input'></FormItem>
          <FormItem label='选择器' component='select'></FormItem>
          <FormItem label='多选' component='checkbox'></FormItem>
          <Form.Item>
            <Button onClick={()=>store.changePrice()}> + </Button>
          </Form.Item>
        </Form>
      </Card>
    }
  }
  
  ```

- `demo/main.jsx`

  ```jsx
  import App from './app';
  ReactDOM.render(<App />, document.getElementById('container'));
  ```

- `demo/model/store.js`

  ```js
  import { makeAutoObservable } from 'mobx'
  
  class Store {
    price = 1;
    amount = 10;
    constructor(){
      makeAutoObservable(this); 
    }
  
    get total() {
      return this.price * this.amount;
    }
  
    changePrice() {
      this.price ++
    }
  }
  
  const store  = new Store();
  
  export default store;
  ```

##### 对常见的组件进行封装 

以 `Form` 为例

- `components/Form/const.js`

  ```js
  import {
    Input,
    InputNumber,
    DatePicker,
    Select,
    Radio,
    Checkbox,
    Rate,
    Slider,
    Time Picker,
    Upload,
    TreeSelect,
    Cascader,
    Transfer
  } from "antd";
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  export const Com = {
    'input': Input,
    'inputPassword': Input.Password,
    'textArea': TextArea,
    'inputNumber': InputNumber,
    'datePicker': DatePicker,
    'rangePicker': RangePicker,
    'select': Select,
    'radio': Radio,
    'radioGroup': Radio.Group,
    'checkbox': Checkbox,
    'rate': Rate,
    'slider': Slider,
    'timePicker': TimePicker,
    'upload': Upload,
    'treeSelect': TreeSelect,
    'cascader': Cascader,
    'transfer': Transfer
  }
  
  ```

- `components/Form/index.jsx`

  ```jsx
  import React, { Component } from 'react'
  import { Form } from 'antd';
  import { Com } from './const'
  export default class FormItem extends Component {
    render() {
      const { label, name, component, required, ...rest } = this.props;
      const ReCompont = Com[component];
      const formProps = {
        label, name, component, required
      }
      return (
        <Form.Item {...formProps} rules={required ? [{ required: true }] : []} >
          <ReCompont style={{ minWidth: '100px' }} {...rest}></ReCompont>
        </Form.Item>
      )
    }
  }
  
  ```

- `index.html` 资源使用CDN引入，例：

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/antd/4.16.9/antd.min.css" rel="stylesheet">
  </head>
  
  <body>
    <div id="container"></div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://cdn.bootcdn.net/ajax/libs/antd/4.16.9/antd.min.js"></script>
  </body>
  
  </html>
  ```

  

#### webpack 基本配置

以下为抽取静态html为例

- `webpack.config.js`

  ```js
  const { Configuration } = require("webpack");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
  const webpackDashboard = require('webpack-dashboard/plugin');
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  const path = require("path");
  const rules = require("./config/rules");
  /**
   * @type {Configuration}
   */
  
  module.exports = (env, args) => {
    const mode = args.mode;
    const pages = env.pages.split(',')
    const srcPagesDir = path.resolve(__dirname, 'src/pages/');
    const entry = {}
    pages.forEach(el => entry[el] = path.resolve(srcPagesDir, el, 'main.jsx'))
    const config = {
      entry,
      mode,
      output: {
        // 使用命令打包时，例如: npm run build demo1, demo2
        // 会在 pages 生成 demo1,demo2 文件夹，用来区分是公有资源还是私有资源
        filename: (pathData) => {
          return pages.includes(pathData.chunk.name) 
            ? 'static/[name]/[contenthash:10].js' 
          	: '/static/[name].js'
        },
        // 输出路径
        path: path.resolve(__dirname, "dist/"),
        // publicPath: mode === 'development' ? '/' : undefined,
        clean: true,
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            exclude: /node_modules/,
            uglifyOptions: {
              output: {
                comments: false,
              }
            },
          })
        ],
        // 分包，单个资源过大拆分，使其并行加载更快
        splitChunks: {
          name: 'verdors',
          minSize: 20000,
          maxSize: 1024 * 500,
          chunks: "all",
        }
      },
      // loader
      module: {
        rules,
      },
      resolve: {
        // 指定应检查的扩展
        extensions: ['.js', '.jsx'], 
        // 路径别名
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@components': path.resolve(__dirname, 'src/components')
        }
      },
      // 设置依赖，因为已经使用 CDN 引入，避免打包导致文件过大
      externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'antd': 'antd'
      },
      plugins: [
        // 打包的 html ，分目录，例如: npm run build demo1, demo2
        // dist 会生成 pages/demo1/index.html、pages/demo2/index.html
        ...pages.map((pageName) => {
          return new HtmlWebpackPlugin({
            filename: `pages/${pageName}/index.html`,
            chunks: [pageName],
            // 使用的模板文件
            template: path.resolve(__dirname, 'src/index.html'),
          });
        }),
        // 提取单独的CSS
        new MiniCssExtractPlugin({
          filename: "[name]/main.[contenthash:10].css",
        }),
        // 压缩css
        new CssMinimizerPlugin(),
        new CleanWebpackPlugin(),
        new webpackDashboard(),
        // new BundleAnalyzerPlugin({
        //   analyzerMode: mode === 'production' ? 'server' : 'disabled'
        // })
      ],
      devServer: {
        // 运行时所访问的文件夹相对路径
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        host: '127.0.0.1',
        open: true,
        hot: true,
      },
      devtool: "eval",
    };
  
    return config;
  };
  ```
  
  
  
- `config/rules.js`

  ```js
  // use 会自下而上执行 loader
  // 以 less 为例: less-loader ==> postcssLoader ==> css-loader
  const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 将css单独打包成一个文件
  const path = require("path");
  
  const postcssLoader = {
    // https://webpack.docschina.org/loaders/postcss-loader/
    loader: "postcss-loader",
    // options: {
    // postcssOptions: {
    // plugins: [["postcss-preset-env", {}]]
    // },
    // },
  };
  
  const rules = [
    {
      oneOf: [
        // css
        {
          test: /\.css$/,
          include: path.resolve(__dirname, "../src"),
          use: [MiniCssExtractPlugin.loader, "css-loader", postcssLoader],
        },
        // less
        {
          test: /\.less$/,
          include: path.resolve(__dirname, "../src"),
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            postcssLoader,
            "less-loader",
          ],
        },
        // 处理图片资源
        {
          test: /\.(jpg|png|jpeg|gif)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 1024 * 8,
                name: "[name].[ext]",
                esModule: false,
                outputPath: "static/assets/images",
              },
            },
          ],
        },
        // 处理 html
        {
          test: /\.html$ /,
          exclude: /node_modules/,
          loader: "html-loader",
          options: {
            esModule: false,
          },
        },
        {
          test: /\.js|jsx$/,
          include: path.resolve(__dirname, "../src"),
          use: {
            loader: "babel-loader",
            options: {
              // es6 => es5
              presets: ["@babel/preset-env"],
            },
          },
        },
        // 其他静态资源
        {
          exclude: /.(js|html|css|less|jpe?g|png|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                // 存放目录
                publicPath: "static/assets/others",
              },
            },
          ],
        },
      ],
    },
  ];
  
  module.exports = rules;
  ```

- `postcss.config.js`

  ```js
  module.exports = {
    plugins: {
      autoprefixer: {
        overrideBrowserslist: [
          "ie >= 8", // 兼容IE7以上浏览器
          "Firefox >= 3.5", // 兼容火狐版本号大于3.5浏览器
          "chrome  >= 35", // 兼容谷歌版本号大于35浏览器,
          "opera >= 11.5", // 兼容欧朋版本号大于11.5浏览器
        ],
      },
    },
  };
  
  ```

  

#### 执行打包命令

##### 执行命令的配置文件

- `scripts/build.js`

  ```js
  const { execSync } = require("child_process");
  if(!process.argv[2]){
    console.error('');
    return
  }
  const command = `webpack --mode=production --env pages=${process.argv[2]}`;
  execSync(command, { stdio: "inherit" });
  
  ```

- `scripts/dev.js`

  ```js
  const { execSync } = require("child_process");
  if(!process.argv[2]){
    console.error('');
    return
  }
  const command = `webpack serve --mode=development --env pages=${process.argv[2]}`;
  execSync(command, { stdio: "inherit" });
  
  ```

##### package.json

```json
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node scripts/dev.js",
    "dev": "npm start",
    "build": "webpack-dashboard -a -- node scripts/build.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.14.6",
    "@babel/plugin-transform-runtime": "^7.14.5",
    "@babel/preset-env": "^7.14.7",
    "babel-loader": "^8.2.2",
    "clean-webpack-plugin": "^4.0.0-alpha.0",
    "css-loader": "^5.2.6",
    "css-minimizer-webpack-plugin": "^3.0.2",
    "extract-loader": "^5.1.0",
    "file-loader": "^6.2.0",
    "html-loader": "^2.1.2",
    "html-webpack-plugin": "^5.3.2",
    "less": "^4.1.1",
    "less-loader": "^10.0.1",
    "mini-css-extract-plugin": "^2.1.0",
    "postcss": "^8.3.5",
    "postcss-loader": "^6.1.1",
    "postcss-preset-env": "^6.7.0",
    "progress-webpack-plugin": "^1.0.12",
    "style-loader": "^3.0.0",
    "uglifyjs-webpack-plugin": "^2.2.0",
    "url-loader": "^4.1.1",
    "webpack": "^5.44.0",
    "webpack-bundle-analyzer": "^4.4.2",
    "webpack-cli": "^4.7.2",
    "webpack-dev-server": "^3.11.2"
  },
  "dependencies": {
    "@babel/plugin-proposal-decorators": "^7.14.5",
    "@babel/preset-react": "^7.14.5",
    "antd": "^4.16.8",
    "compression-webpack-plugin": "^8.0.1",
    "customize-cra": "^1.0.0",
    "mobx": "^6.3.5",
    "mobx-react": "^7.2.0",
    "react": "^17.0.2",
    "react-app-rewired": "^2.1.8",
    "react-dom": "^17.0.2",
    "webpack-dashboard": "^3.3.6"
  }
}

```

##### 打包命令

- dev : `npm run dev 文件夹名称` 例：`npm run dev demo1,demo2`
- build: `npm run build 文件夹名称` 例：`npm run build demo1,demo2`
- 注意：默认会查找 `src/pages` 目录下的文件夹，最终打包产物会在根目录 `dist`