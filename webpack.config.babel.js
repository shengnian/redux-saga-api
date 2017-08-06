import webpack from 'webpack'
import path from 'path'

const { NODE_ENV } = process.env

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
]

const filename = `redux-saga-api${NODE_ENV === 'production' ? '.min' : ''}.js`

// eslint-disable-next-line no-unused-expressions
NODE_ENV === 'production' && plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      screw_ie8: true,
      warnings: false
    }
  })
)

export default {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },

  entry: [
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'ReduxSagaApi',
    libraryTarget: 'umd'
  },

  plugins
}
