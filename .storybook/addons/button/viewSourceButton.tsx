// Storybook builds manager addons with the classic JSX runtime, so React must
// be in scope here even though the library uses react-jsx.
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import React, { useEffect, useState } from 'react'
import { Button } from 'storybook/internal/components'
import type { API_LeafEntry } from 'storybook/internal/types'
import { addons, type API, types } from 'storybook/manager-api'

const ADDON_ID = 'github-source-link'
const TOOL_ID = `${ADDON_ID}/tool`

function ViewSourceButton({ api }: Readonly<{ api: API }>) {
  const [storyData, setStoryData] = useState<API_LeafEntry>()

  useEffect(() => {
    const updateStoryData = () => {
      const uiSettleTimeout = 100
      setTimeout(() => {
        try {
          const currentStoryData = api.getCurrentStoryData()
          if (currentStoryData && currentStoryData.importPath) {
            setStoryData(currentStoryData)
          }
        } catch (error) {
          console.error('Error getting story data:', error)
        }
      }, uiSettleTimeout)
    }

    updateStoryData()

    const removeStoryChangedListener = api.on('storyChanged', updateStoryData)
    const removeRenderedListener = api.on('STORY_RENDERED', updateStoryData)

    return () => {
      removeStoryChangedListener()
      removeRenderedListener()
    }
  }, [api])

  if (!storyData || !storyData.importPath) {
    return null
  }

  const url = [
    'https://github.com/rustic-ai/rustic-ui-components/blob/main',
    storyData.importPath.replace(/\.\//, ''),
  ].join('/')

  return (
    <Button
      title="View source on GitHub"
      onClick={() => window.open(url, '_blank')}
      size="small"
    >
      View source
    </Button>
  )
}

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'View source on GitHub',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <ViewSourceButton api={api} />,
  })
})
