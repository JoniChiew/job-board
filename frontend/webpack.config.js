const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
 
module.exports = { 
  entry: './src/index.js', 
  output: { 
    path: path.resolve(__dirname, 'build'), 
    filename: 'bundle.js', 
  }, 
  module: { 
    rules: [ 
      { 
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/, 
        use: 'babel-loader', 
      }, 
      { 
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'], 
      }, 
    ], 
  }, 
  resolve: { 
    extensions: ['.js', '.jsx'], 
  }, 
  devServer: { 
    contentBase: path.join(__dirname, 'build'), 
    compress: true, 
    port: 3000, 
    hot: true, 
  }, 
  plugins: [ 
    new HtmlWebpackPlugin({ 
      template: './public/index.html', 
    }), 
  ], 
  mode: 'development' 
}; 
