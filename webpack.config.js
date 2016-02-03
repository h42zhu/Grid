var path = require('path')

var output = {
  path: path.join(__dirname, 'output'),
  filename: 'bundle.js',
  publicPath: '/'
}

var assetsLoaders = [
  {test: /\.css$/, loader: 'style!css!autoprefixer?browsers=last 2 versions'},
  {test: /\.json$/, loader: 'json'}
]



var babelLoader = {
  loader: 'babel-loader',
  include: [
    path.resolve(__dirname, 'js')
  ],
  test: /\.jsx?$/,
  // Options to configure babel
  query: {
    cacheDirectory: true,
    plugins: ['transform-runtime', 'babel-plugin-add-module-exports'],
    presets: ['es2015', 'stage-0', 'react']
  }
}


var production = {
    entry: "./js/main.js",
    output: output,
    
    module: {
        loaders: [].concat(
            assetsLoaders, babelLoader
        )
    },
    
    standard: {
      parser: 'babel-eslint'
    },
    
    resolve: {
      extensions: ['', '.js', '.styl']
    },
    
    stats: {
      colors: true
    }

}

module.exports = production