const { Configuration } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ProgressPlugin = require("progress-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackDashboard = require('webpack-dashboard/plugin');
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
      filename: (pathData) => {
        return pages.includes(pathData.runtime) ? 'static/[name]/js/[contenthash:10].js' : 'static/[name].js'
      },
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
      splitChunks: {
        name: mode,
        minSize: 20000,
        maxSize: 1024 * 500,
        chunks: "all",
      }
    },
    module: {
      rules,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components')
      }
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'antd': 'antd'
    },
    plugins: [
      ...pages.map((pageName) => {
        return new HtmlWebpackPlugin({
          filename: `${pageName}/index.html`,
          chunks: [pageName],
          template: path.resolve(__dirname, 'src/index.html'),
        });
      }),
      // 提取单独的CSS
      new MiniCssExtractPlugin({
        filename: "[name]/main.[contenthash:10].css",
      }),
      // 压缩css
      new CssMinimizerPlugin(),
      // 进度
      new ProgressPlugin(true),
      new CleanWebpackPlugin(),
      new webpackDashboard(),
      // new BundleAnalyzerPlugin({
      //   analyzerMode: mode === 'production' ? 'server' : 'disabled'
      // })
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 3000,
      open: true,
      hot: true,
    },
    devtool: "eval",
  };

  return config;
};
