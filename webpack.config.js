const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  performance: {
    hints: false
  },
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json')
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    compress: true,
    port: 9000
  }
};
