const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'), // Output files will be in the 'docs' folder
  },
  devServer: {
    static: path.join(__dirname, 'docs'), // Serve content from the 'docs' folder
    compress: true,
    port: 9000,
  },
};
