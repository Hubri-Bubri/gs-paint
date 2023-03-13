const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')


module.exports = {
  mode: 'development',
  entry: {
    editor: './src/Editor.vue',
    demo: './src/demo/index.js',
  },
  module: {
    rules: [
      {test: /\.vue$/, loader: 'vue-loader'},
      {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],

  devServer: {
    static: [
      {directory: path.join(__dirname, 'sandbox')},
      {directory: path.join(__dirname, 'dist')},
    ],
    port: 9000,
  },

  devtool: 'inline-source-map',
}