import type { StorybookConfig } from '@storybook/react-webpack5'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx)', '../docs/*.mdx'],
  addons: [
    'storybook-addon-mock',
    {
      name: '@storybook/addon-docs',
      options: { transcludeMarkdown: true },
    },
    '@storybook/addon-webpack5-compiler-swc',
    './addons/button',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
    reactDocgen: 'react-docgen',
    check: false,
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
  staticDirs: [
    '../public',
    {
      from: path.resolve(
        __dirname,
        '../node_modules/emoji-picker-element-data'
      ),
      to: 'node_modules/emoji-picker-element-data',
    },
  ],

  webpackFinal: async (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: false,
    }

    return config
  },
}
export default config
