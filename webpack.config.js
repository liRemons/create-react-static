const { Configuration } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ProgressPlugin = require("progress-webpack-plugin");
const path = require("path");
const rules = require("./config/rules");
/**
 * @type {Configuration}
 */

module.exports = (env, args) => {
  const mode = args.mode;
  const config = {
    entry: ["./src/index.js", "./src/index.html"],
    mode,
    output: {
      filename: "static/js/[name].[contenthash:10].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 2000,
      },
    },
    module: {
      rules,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      // 提取单独的CSS
      new MiniCssExtractPlugin({
        filename: "static/css/main.[contenthash:10].css",
      }),
      // 压缩css
      new CssMinimizerPlugin(),
      // 进度
      new ProgressPlugin(true),
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 3000,
      // open: true,
      hot: true,
    },
    devtool: "eval",
  };

  return config;
};
