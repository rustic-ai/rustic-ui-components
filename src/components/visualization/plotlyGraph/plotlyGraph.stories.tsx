import type { Meta } from '@storybook/react-webpack5'
import type React from 'react'

import PlotlyGraph from './plotlyGraph'
import type { PlotlyGraphData } from './plotlyGraph.types'
/* eslint-disable no-magic-numbers */
const meta: Meta<React.ComponentType<PlotlyGraphData>> = {
  title: 'Rustic UI/Visualization/PlotlyGraph',
  component: PlotlyGraph,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta

meta.argTypes = {
  ...meta.argTypes,
  plotParams: {
    table: {
      type: {
        summary: 'PlotlyJson\n',
      },
      defaultValue: {
        summary:
          "{config:{displaylogo: false,responsive: true,editable: false,showSendToCloud: false}, className: 'rustic-plotly'}",
      },
    },
  },
}

export const GroupedBarChart = {
  args: {
    plotParams: {
      data: [
        {
          x: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          y: [20, 14, 25, 16, 18, 22, 19, 15, 12, 16, 14, 17],
          type: 'bar',
          name: 'Primary Product',
          marker: {
            color: 'rgb(49,130,189)',
            opacity: 0.7,
          },
        },
        {
          x: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          y: [19, 14, 22, 14, 16, 19, 15, 14, 10, 12, 12, 16],
          type: 'bar',
          name: 'Secondary Product',
          marker: {
            color: 'rgb(204,204,204)',
            opacity: 0.5,
          },
        },
      ],
      layout: {
        title: '2013 Sales Report',
        xaxis: {
          tickangle: -45,
        },
        barmode: 'group',
      },
    },
  },
}

export const PieChart = {
  args: {
    plotParams: {
      data: [
        {
          values: [19, 26, 55],
          labels: ['Residential', 'Non-Residential', 'Utility'],
          type: 'pie',
        },
      ],
      layout: {
        title: 'Pie chart',
      },
    },
  },
}

export const WithTitleAndDescription = {
  args: {
    plotParams: {
      data: [
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [20, 14, 23],
          type: 'bar',
        },
      ],
    },
    title: 'Population',
    description:
      'The chart below illustrates population of specific wildlife in a sanctuary',
  },
}
