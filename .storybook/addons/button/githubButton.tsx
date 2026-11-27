import { GithubIcon } from '@storybook/icons'
import { Button } from 'storybook/internal/components'
import { addons, types } from 'storybook/manager-api'

const ADDON_ID = 'github-link'
const TOOL_ID = `${ADDON_ID}/tool`

const REPO_URL = 'https://github.com/rustic-ai/rustic-ui-components'

function GitHubButton() {
  return (
    <Button
      title="View on GitHub"
      onClick={() => window.open(REPO_URL, '_blank')}
      size="small"
    >
      <GithubIcon />
    </Button>
  )
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'View on GitHub',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <GitHubButton />,
  })
})
