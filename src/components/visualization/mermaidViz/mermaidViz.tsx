import './mermaidViz.css'

import Stack from '@mui/material/Stack'
import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/system/useTheme'
import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'
import { v4 as getUUID } from 'uuid'

import MarkedMarkdown from '../../markdown/markedMarkdown'
import type { MermaidData } from './mermaidViz.types'

/** The `MermaidViz` component leverages [Mermaid.js](https://mermaid.js.org/) to create dynamic and interactive diagrams, including flowcharts, sequence diagrams, class diagrams, and more. It is ideal for visualizing complex data and processes in a clear and structured manner.
 *
 * Note: `mermaid` and `uuid` are not bundled, so please install the following packages using npm:
 *
 * ```typescript
 * npm i mermaid uuid
 * ```
 */
function MermaidViz(props: MermaidData) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState<string>()
  const rusticTheme: Theme = useTheme()
  const mermaidId = getUUID()

  useEffect(() => {
    const mermaidTheme =
      rusticTheme.palette.mode === 'dark' ? 'dark' : 'neutral'
    const defaultFont = rusticTheme.typography.fontFamily
    if (mermaidRef.current) {
      mermaid.initialize({
        theme: mermaidTheme,
        themeVariables: { fontFamily: defaultFont },
        // Mermaid 12 defaults to the ELK layout and a new look; keep the
        // layout and look diagrams had before. `config` can still override.
        layout: 'dagre',
        look: 'classic',
        ...props.config,
      })

      mermaid
        .render(`mermaid-svg-${mermaidId}`, props.diagram, mermaidRef.current)
        .then((result) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg
          }
          setErrorMessage('')
        })
        .catch(() => {
          mermaidRef.current?.replaceChildren()
          setErrorMessage('Failed to render the diagram.')
        })
    }
  })

  return (
    <Stack className={`rustic-mermaid-container`} data-cy="mermaid-container">
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <div className="rustic-mermaid" ref={mermaidRef}></div>
      {errorMessage && <Typography variant="body2">{errorMessage}</Typography>}
    </Stack>
  )
}

export default MermaidViz
