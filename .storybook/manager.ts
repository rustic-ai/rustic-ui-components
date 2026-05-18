import './addons/button/logo.tsx'
import './addons/button/viewSourceButton.tsx'
import './addons/button/githubButton.tsx'

import { addons } from 'storybook/manager-api'

import rusticTheme from './rusticTheme'

addons.setConfig({
  theme: rusticTheme,
})
