const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  performance: {
    hints: false,
  },
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      buffer: require.resolve("buffer/"),
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "./tsconfig.json"),
      }),
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      "process.env.network": JSON.stringify(process.env.network),
      "process.env.platformFee": JSON.stringify(process.env.platformFee),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  // npm installs and tsc output rewrite thousands of files in node_modules/
  // and docs/ (the build output); neither is an input, so don't rebuild for them
  watchOptions: {
    ignored: ["**/node_modules/**", "**/docs/**"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "docs"),
    },
    compress: true,
    port: 9000,
    // The frontend posts to the relative URL "/server". In production nginx
    // forwards it to the backend; in dev the dev server does the same.
    proxy: [{ context: ["/server"], target: "http://localhost:5000" }],
  },
};
