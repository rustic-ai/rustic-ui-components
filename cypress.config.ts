import { defineConfig } from 'cypress'

import webpackConfig from './webpack.config'

export default defineConfig({
  allowCypressEnv: false,
  experimentalWebKitSupport: true,
  chromeWebSecurity: false,
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: {
        ...webpackConfig,
        devServer: {
          allowedHosts: 'all',
        },
        resolve: {
          ...webpackConfig.resolve,
          extensionAlias: {
            '.js': ['.ts', '.js'],
          },
        },
        module: {
          ...webpackConfig.module,
          rules: [
            ...(webpackConfig.module?.rules ?? []),
            {
              test: /\.tsx?$/,
              include: /node_modules\/@perspective-dev/,
              use: {
                loader: 'ts-loader',
                options: { transpileOnly: true },
              },
            },
            {
              test: /\.wasm$/,
              type: 'asset/resource',
            },
          ],
        },
      },
    },
  },
})
