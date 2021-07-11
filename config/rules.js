const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// test ： 所应用的规则
// exclude: 忽略处理的文件
// use ：可使用多个loader，自下向上执行

// 兼容性处理
const postcssLoader = {
  loader: "postcss-loader",
  // options: {
  //   postcssOptions: {
  //     plugins: [["postcss-preset-env", {}]],
  //   },
  // },
};

const rules = [
  {
    oneOf: [
      // css
      {
        test: /\.css$/,
        // MiniCssExtractPlugin.loader 插件将 css 提取为单独的文件
        // 和 style-loader 不同，style-loader 将css 插入到style标签
        use: [MiniCssExtractPlugin.loader, "css-loader", postcssLoader],
      },
      // less
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          postcssLoader,
          "less-loader",
        ],
      },
      // 处理图片
      {
        test: /\.(jpg|png|jpeg|gif)$/,
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
      // HTML中静态资源
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          esModule: false,
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      // 其它资源
      {
        exclude: /.(js|html|css|less|jpe?g|png|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "static/assets/others",
            },
          },
        ],
      },
    ],
  },
];

module.exports = rules;
