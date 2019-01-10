// Overriding CreateReactApp, ref: https://github.com/arackaf/customize-cra
const antdTheme = require('./src/theme.js')
const {
  override,
  fixBabelImports,
  addLessLoader,
  useEslintRc,
  addDecoratorsLegacy
} = require('customize-cra')

module.exports = override(
  addDecoratorsLegacy(),
  useEslintRc(),
  fixBabelImports('import', {
    libraryName: 'antd', libraryDirectory: 'es', style: true // change importing css to less
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: antdTheme
  })
)