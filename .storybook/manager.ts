import './addons/button/logo'
import './addons/button/viewSourceButton'
import './addons/button/githubButton'

import { addons } from 'storybook/manager-api'

import rusticTheme from './rusticTheme'

addons.setConfig({
  theme: rusticTheme,
})
