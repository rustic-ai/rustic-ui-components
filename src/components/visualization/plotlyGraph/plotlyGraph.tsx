import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Plot from 'react-plotly.js'

import MarkedMarkdown from '../../markdown/markedMarkdown'
import type { PlotlyGraphData } from './plotlyGraph.types'
/** The `PlotlyGraph` component enables interactive charts and maps using [Plotly](https://plotly.com/javascript/),
 *  offering rich features such as zooming, panning, and downloading graphs. It supports customization of graph
 *  parameters and configurations to suit various visualization needs.
 *
 * Note: Required dependencies are not bundled, so please install them using npm:
 *
 * ```typescript
 * npm i react-plotly.js plotly.js
 * ```
 */
function PlotlyGraph(props: PlotlyGraphData) {
  const additionalConfig = {
    displaylogo: false,
    responsive: true,
    editable: false,
  }

  const plotParams = { ...props.plotParams, className: 'rustic-plotly' }
  plotParams.config = { ...plotParams.config, ...additionalConfig }

  return (
    <Box className={'rustic-plotly-container'} data-cy="plotly">
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <Plot {...plotParams}></Plot>
    </Box>
  )
}

export default PlotlyGraph
