const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')


module.exports = {
  mode: 'development',
  entry: {
    editor: './src/Editor.vue',
    index: './src/index.js',
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
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          'tar -cvzf gs-paint.tar.gz --exclude="node_modules" --exclude=".git" --exclude="gs-paint.tar.gz" --exclude=".DS_Store" -C .. gs-paint',
        ],
      }
    }),
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
