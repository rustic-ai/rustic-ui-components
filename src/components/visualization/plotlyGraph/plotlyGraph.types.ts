import type { Config, Data, Frame, Layout } from 'plotly.js'
import type { PlotParams } from 'react-plotly.js'

import type { Updates, VisualizationFormat } from '../../types'

// react-plotly.js 4 types the figure fields as `unknown`; use plotly.js's own
// types so the format stays as strict as it was with @types/react-plotly.js.
export type PlotlyJson = Omit<
  PlotParams,
  'divId' | 'data' | 'layout' | 'config' | 'frames'
> & {
  data: Data[]
  layout: Partial<Layout>
  frames?: Frame[]
  config?: Partial<Config>
}

export interface PlotlyGraphFormat extends VisualizationFormat {
  /** Follow [Plotly's documentation](https://plotly.com/javascript/reference/index/) to provide a valid Plotly JSON.
   * Note: It excludes the `divId` field */
  plotParams: PlotlyJson
}

export type PlotlyGraphData = PlotlyGraphFormat & Updates<PlotlyGraphFormat>
