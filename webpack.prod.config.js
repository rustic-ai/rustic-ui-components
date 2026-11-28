const fs = require('fs')
const path = require('path')

const commonConfig = require('./webpack.config.js')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ts = require('typescript')
function removeJsxAttributesTransformer(attributes) {
  return (context) => {
    const visitor = (node) => {
      if (ts.isJsxAttribute(node) && attributes.includes(node.name.getText())) {
        return undefined
      }
      return ts.visitEachChild(node, visitor, context)
    }
    return (node) => ts.visitNode(node, visitor, context)
  }
}

// The vendored uniforms-mui is MIT licensed, and its code is compiled into
// the bundles, so its license has to ship in the package too. The build drops
// source comments, so copy the LICENSE file next to its type declarations.
const VENDORED_LICENSES = ['vendor/uniforms-mui/LICENSE']
class CopyVendoredLicensesPlugin {
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack
    compiler.hooks.thisCompilation.tap(
      'CopyVendoredLicenses',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'CopyVendoredLicenses',
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            for (const license of VENDORED_LICENSES) {
              const sourcePath = path.resolve(__dirname, 'src', license)
              compilation.fileDependencies.add(sourcePath)
              compilation.emitAsset(
                license,
                new sources.RawSource(fs.readFileSync(sourcePath))
              )
            }
          }
        )
      }
    )
  }
}

function getCssFilename(pathData) {
  if (pathData.chunk.name === 'library') {
    return 'index.css'
  }
  return `components/${pathData.chunk.name}/index.css`
}

module.exports = {
  ...commonConfig,
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.prod.json',
            getCustomTransformers: () => ({
              before: [removeJsxAttributesTransformer(['data-cy'])],
            }),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  externalsPresets: { node: true },
  externals: [nodeExternals({})],
  plugins: [
    new CopyVendoredLicensesPlugin(),
    new MiniCssExtractPlugin({
      filename: getCssFilename,
    }),
  ],
}
