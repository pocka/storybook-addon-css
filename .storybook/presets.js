const path = require('path')

module.exports = [
  '@storybook/addon-docs/react/preset',
  path.resolve(__dirname, '../src/preset.js')
]
