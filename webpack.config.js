const path = require('path')
const fs = require('fs')

function getComponentEntries(dirPath) {
  const entries = {}

  function collectEntries(currentPath, parentPath = '') {
    fs.readdirSync(currentPath).forEach((file) => {
      const filePath = path.resolve(currentPath, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        const componentName = path.join(parentPath, file)
        const indexPath = path.resolve(filePath, 'index.ts')
        if (fs.existsSync(indexPath)) {
          entries[componentName] = path.resolve(filePath, 'index.ts')
        }
        collectEntries(filePath, componentName) // Recursively collect entries in nested directories
      }
    })
  }

  collectEntries(dirPath)
  return entries
}

function getOutputFilename(pathData) {
  if (pathData.chunk.name === 'library') {
    return 'index.js'
  } else if (pathData.chunk.name === 'theme') {
    return 'rusticTheme.js'
  }
  return `components/${pathData.chunk.name}/index.js`
}
const commonConfig = {
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  entry: {
    library: path.resolve(__dirname, 'src/components/index.ts'),
    theme: path.resolve(__dirname, 'src/rusticTheme.ts'),
    ...getComponentEntries(path.resolve(__dirname, 'src/components')),
  },
  output: {
    filename: getOutputFilename,
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: '@rustic-ai/ui-components',
      type: 'umd',
    },
    clean: true,
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: false,
  },
}

module.exports = {
  ...commonConfig,
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}

exports.commonConfig = commonConfig
