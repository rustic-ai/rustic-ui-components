import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Plotly from 'plotly.js/dist/plotly.js'
import createPlotlyComponent from 'react-plotly.js/factory'

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
// react-plotly.js 4's default entry imports 'plotly.js/dist/plotly' without an
// extension, which webpack rejects in ES modules; build the component from
// its factory with a fully specified bundle path instead.
const Plot = createPlotlyComponent(Plotly)

function PlotlyGraph(props: PlotlyGraphData) {
  const additionalConfig = {
    displaylogo: false,
    responsive: true,
    editable: false,
    // plotly.js 4 adds a modebar button that sends the chart data to
    // cloud.plotly.com; keep conversation data from leaving the page.
    showSendToCloud: false,
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
