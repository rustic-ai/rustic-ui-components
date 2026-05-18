import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider } from '@mui/material/styles'
import {
  ArgTypes,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks'
import type { StoryContext, StoryFn } from '@storybook/react-webpack5'
import React from 'react'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'

import { rusticDarkTheme, rusticLightTheme } from '../src/rusticTheme'

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      title: 'Theme',
      items: ['light', 'dark'],
      showName: true,
    },
  },
}

const withMuiTheme = (Story: StoryFn, context: StoryContext) => {
  const theme =
    context.globals.theme === 'light' ? rusticLightTheme : rusticDarkTheme

  React.useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default
  }, [context.globals.theme])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {/* add a div wrapper to show dark mode properly. Otherwise the background color would be white. */}
        <div
          style={{
            backgroundColor: theme.palette.background.paper,
            padding: '24px',
            borderRadius: '8px',
          }}
        >
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0"
          />
          <CssBaseline />
          <Story />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

const preview = {
  globalTypes,
  decorators: [withMuiTheme],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
    controls: { expanded: true },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgTypes />
          <Stories />
        </>
      ),
      argTypes: {
        sort: 'requiredFirst',
      },
    },
  },
}

export const webpackFinal = async (config: any) => {
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    include: '../',
  })

  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: 'Inter-VariableFont_slnt,wght.ttf',
        },
      },
    ],
    type: 'asset/resource',
  })

  return config
}

export default preview
