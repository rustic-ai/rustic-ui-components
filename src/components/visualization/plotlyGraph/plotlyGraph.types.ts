import type {PlotParams} from "react-plotly.js";

import type {Updates, VisualizationFormat} from "../../types";


export type PlotlyJson = Omit<PlotParams, "divId">

export interface PlotlyGraphFormat extends VisualizationFormat {
    /** Follow [Plotly's documentation](https://plotly.com/javascript/reference/index/) to provide a valid Plotly JSON.
     * Note: It excludes the `divId` field */
    plotParams: PlotlyJson,
}

export type PlotlyGraphData = PlotlyGraphFormat & Updates<PlotlyGraphFormat>