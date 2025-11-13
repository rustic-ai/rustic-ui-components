/* eslint-disable no-magic-numbers */
import type { Meta, StoryFn } from '@storybook/react-webpack5'
import React, { useEffect, useRef, useState } from 'react'

import { UpdateType } from '../../types'
import VegaLiteViz from './vegaLiteViz'
const meta: Meta<React.ComponentProps<typeof VegaLiteViz>> = {
  title: 'Rustic UI/Visualization/VegaLiteViz',
  component: VegaLiteViz,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
meta.argTypes = {
  ...meta.argTypes,
  theme: {
    description:
      'Refer to the [vega-themes](https://github.com/vega/vega-themes) documentation for more information.',
    table: {
      type: {
        summary: 'Theme object.\n',
        detail:
          'A theme object has the following fields:\n' +
          '  light: A light theme string that is supported by vega-themes.\n' +
          '  dark: A dark theme string that is supported by vega-themes.',
      },
    },
  },
  options: {
    description:
      'The options object is passed directly to Vega-Lite. Refer to the [Vega-lite documentation](https://vega.github.io/vega-lite/) for more information.',
  },
}

const decorators = [
  (Story: StoryFn) => {
    return (
      <div
        style={{
          width: 'clamp(250px, 70vw, 1000px)',
          height: 'clamp(150px, 40vh, 400px)',
        }}
      >
        <Story />
      </div>
    )
  },
]

export const BarChart = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 'container',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
          { a: 'C', b: 43 },
          { a: 'D', b: 91 },
          { a: 'E', b: 81 },
          { a: 'F', b: 53 },
          { a: 'G', b: 19 },
          { a: 'H', b: 87 },
          { a: 'I', b: 52 },
        ],
      },
      mark: 'bar',
      encoding: {
        x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
        y: { field: 'b', type: 'quantitative' },
      },
    },
  },
  decorators,
}

export const PieChart = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 'container',
      padding: 8,
      data: {
        values: [
          { category: 1, value: 4 },
          { category: 2, value: 6 },
          { category: 3, value: 10 },
          { category: 4, value: 3 },
          { category: 5, value: 7 },
          { category: 6, value: 8 },
        ],
      },
      mark: {
        type: 'arc',
        tooltip: true,
      },
      encoding: {
        theta: { field: 'value', type: 'quantitative', stack: 'normalize' },
        color: { field: 'category', type: 'nominal' },
      },
    },
  },
  decorators,
}

export const WithTitleAndDescription = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: '200',
      title: 'Number of Orders by Product',
      description:
        'This chart shows the number of orders by product in the last month.',
      data: {
        values: [
          { product: 'a', orders: 40 },
          { product: 'b', orders: 55 },
          { product: 'c', orders: 43 },
          { product: 'd', orders: 91 },
          { product: 'e', orders: 81 },
          { product: 'f', orders: 53 },
        ],
      },
      mark: 'bar',
      encoding: {
        x: {
          field: 'product',
          type: 'nominal',
          axis: { labelAngle: 0 },
        },
        y: {
          field: 'orders',
          type: 'quantitative',
          axis: { title: 'Orders(in thousands)' },
        },
      },
    },
    title: 'Product Order Volumes for X Company',
    description:
      "The chart below illustrates the distribution of orders across different products in the last month for X Company. Each product's order count is displayed in thousands, providing a clear comparison of product performance.",
  },
}

export const InvalidChart = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
        ],
      },
      encoding: {
        x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
        y: { field: 'b', type: 'quantitative' },
      },
    },
  },
}

export const InteractiveMap = {
  args: {
    getAuthHeaders: () =>
      Promise.resolve({
        headers: {
          Authorization: 'Bearer example-token',
        },
      }),
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 'container',
      title: 'Connections among Major U.S. Airports',
      layer: [
        {
          mark: {
            type: 'geoshape',
            fill: '#ddd',
            stroke: '#fff',
            strokeWidth: 1,
          },
          data: {
            url: 'vegaLiteData/mapData.json',
            format: { type: 'topojson', feature: 'states' },
          },
        },
        {
          mark: { type: 'rule', color: '#000', opacity: 0.35 },
          data: { url: 'vegaLiteData/flightsAirport.csv' },
          transform: [
            { filter: { param: 'org', empty: false } },
            {
              lookup: 'origin',
              from: {
                data: { url: 'vegaLiteData/airports.csv' },
                key: 'iata',
                fields: ['latitude', 'longitude'],
              },
            },
            {
              lookup: 'destination',
              from: {
                data: { url: 'vegaLiteData/airports.csv' },
                key: 'iata',
                fields: ['latitude', 'longitude'],
              },
              as: ['lat2', 'lon2'],
            },
          ],
          encoding: {
            latitude: { field: 'latitude' },
            longitude: { field: 'longitude' },
            latitude2: { field: 'lat2' },
            longitude2: { field: 'lon2' },
          },
        },
        {
          mark: { type: 'circle' },
          data: { url: 'vegaLiteData/flightsAirport.csv' },
          transform: [
            { aggregate: [{ op: 'count', as: 'routes' }], groupby: ['origin'] },
            {
              lookup: 'origin',
              from: {
                data: { url: 'vegaLiteData/airports.csv' },
                key: 'iata',
                fields: ['state', 'latitude', 'longitude'],
              },
            },
            { filter: "datum.state !== 'PR' && datum.state !== 'VI'" },
          ],
          params: [
            {
              name: 'org',
              select: {
                type: 'point',
                on: 'pointerover',
                nearest: true,
                fields: ['origin'],
              },
            },
          ],
          encoding: {
            latitude: { field: 'latitude' },
            longitude: { field: 'longitude' },
            size: {
              field: 'routes',
              type: 'quantitative',
              scale: { rangeMax: 1000 },
              legend: null,
            },
            order: {
              field: 'routes',
              sort: 'descending',
            },
          },
        },
      ],
      projection: { type: 'albersUsa' },
    },
  },
  decorators,
}

export const Map = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 700,
      height: 700,
      title: 'London Tube Lines',
      view: {
        stroke: 'transparent',
      },
      layer: [
        {
          data: {
            url: 'vegaLiteData/londonBoroughs.json',
            format: {
              type: 'topojson',
              feature: 'boroughs',
            },
          },
          mark: {
            type: 'geoshape',
            stroke: 'white',
            strokeWidth: 2,
          },
          encoding: {
            color: {
              value: '#eee',
            },
          },
        },
        {
          data: {
            url: 'vegaLiteData/londonCentroids.json',
            format: {
              type: 'json',
            },
          },
          transform: [
            {
              calculate:
                "indexof (datum.name,' ') > 0  ? substring(datum.name,0,indexof(datum.name, ' ')) : datum.name",
              as: 'bLabel',
            },
          ],
          mark: 'text',
          encoding: {
            longitude: {
              field: 'cx',
              type: 'quantitative',
            },
            latitude: {
              field: 'cy',
              type: 'quantitative',
            },
            text: {
              field: 'bLabel',
              type: 'nominal',
            },
            size: {
              value: 8,
            },
            opacity: {
              value: 0.6,
            },
          },
        },
        {
          data: {
            url: 'vegaLiteData/londonTubeLines.json',
            format: {
              type: 'topojson',
              feature: 'line',
            },
          },
          mark: {
            type: 'geoshape',
            filled: false,
            strokeWidth: 2,
          },
          encoding: {
            color: {
              field: 'id',
              type: 'nominal',
              legend: {
                title: null,
                orient: 'bottom-right',
                offset: 0,
              },
              scale: {
                domain: [
                  'Bakerloo',
                  'Central',
                  'Circle',
                  'District',
                  'DLR',
                  'Hammersmith & City',
                  'Jubilee',
                  'Metropolitan',
                  'Northern',
                  'Piccadilly',
                  'Victoria',
                  'Waterloo & City',
                ],
                range: [
                  'rgb(137,78,36)',
                  'rgb(220,36,30)',
                  'rgb(255,206,0)',
                  'rgb(1,114,41)',
                  'rgb(0,175,173)',
                  'rgb(215,153,175)',
                  'rgb(106,114,120)',
                  'rgb(114,17,84)',
                  'rgb(0,0,0)',
                  'rgb(0,24,168)',
                  'rgb(0,160,226)',
                  'rgb(106,187,170)',
                ],
              },
            },
          },
        },
      ],
    },
  },
}

export const GlobeVisualization = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      title: ['Globe Visualization', 'of Earthquakes'],

      width: 'container',
      height: 300,
      projection: {
        type: 'orthographic',
        rotate: { expr: '[rotate0, rotate1, 0]' },
      },
      params: [
        {
          name: 'rotate0',
          value: 0,
          bind: { input: 'range', min: -90, max: 90, step: 1 },
        },
        {
          name: 'rotate1',
          value: 0,
          bind: { input: 'range', min: -90, max: 90, step: 1 },
        },
        {
          name: 'earthquakeSize',
          value: 6,
          bind: { input: 'range', min: 0, max: 12, step: 0.1 },
        },
      ],
      layer: [
        {
          data: { sphere: true },
          mark: { type: 'geoshape', fill: 'aliceblue' },
        },
        {
          data: {
            name: 'world',
            url: 'vegaLiteData/world110m.json',
            format: { type: 'topojson', feature: 'countries' },
          },
          mark: { type: 'geoshape', fill: 'mintcream', stroke: 'black' },
        },
        {
          data: {
            name: 'earthquakes',
            url: 'vegaLiteData/earthquakes.json',
            format: { type: 'json', property: 'features' },
          },
          transform: [
            { calculate: 'datum.geometry.coordinates[0]', as: 'longitude' },
            { calculate: 'datum.geometry.coordinates[1]', as: 'latitude' },
            {
              filter:
                '(rotate0 * -1) - 90 < datum.longitude && datum.longitude < (rotate0 * -1) + 90 && (rotate1 * -1) - 90 < datum.latitude && datum.latitude < (rotate1 * -1) + 90',
            },
            { calculate: 'datum.properties.mag', as: 'magnitude' },
          ],
          mark: { type: 'circle', color: 'red', opacity: 0.25 },
          encoding: {
            longitude: { field: 'longitude', type: 'quantitative' },
            latitude: { field: 'latitude', type: 'quantitative' },
            size: {
              legend: null,
              field: 'magnitude',
              type: 'quantitative',
              scale: {
                type: 'sqrt',
                domain: [0, 100],
                range: [0, { expr: 'pow(earthquakeSize, 3)' }],
              },
            },
            tooltip: [{ field: 'magnitude' }],
          },
        },
      ],
    },
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div
          style={{
            width: 'clamp(250px, 70vw, 1000px)',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}
export const Heatmap = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 'container',
      data: {
        url: 'vegaLiteData/seattleWeather.csv',
      },
      title: 'Daily Temperatures in Seattle',
      config: {
        view: {
          strokeWidth: 0,
          step: 13,
        },
        axis: {
          domain: false,
        },
      },
      mark: 'rect',
      encoding: {
        x: {
          field: 'date',
          timeUnit: 'date',
          type: 'ordinal',
          title: 'Day',
          axis: {
            labelAngle: 0,
            format: '%e',
          },
        },
        y: {
          field: 'date',
          timeUnit: 'month',
          type: 'ordinal',
          title: 'Month',
        },
        color: {
          field: 'temp_max',
          aggregate: 'max',
          type: 'quantitative',
          legend: {
            title: null,
          },
        },
      },
    },
  },
  decorators,
}

export const WeatherPlot = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 'container',
      config: {
        style: {
          hilo: {
            size: 20,
          },
        },
      },
      title: {
        text: ['Weekly Weather', 'Observations and Predictions'],
        frame: 'group',
      },
      data: {
        url: 'vegaLiteData/weather.json',
      },
      encoding: {
        x: {
          field: 'id',
          type: 'ordinal',
          axis: {
            domain: false,
            ticks: false,
            labels: false,
            title: null,
            titlePadding: 25,
            orient: 'top',
          },
        },
        y: {
          type: 'quantitative',
          scale: { domain: [10, 70] },
          axis: { title: 'Temperature (F)' },
        },
      },
      layer: [
        {
          mark: { type: 'bar', size: 20, color: '#ccc' },
          encoding: {
            y: { field: 'record.low' },
            y2: { field: 'record.high' },
          },
        },
        {
          mark: { type: 'bar', size: 20, color: '#999' },
          encoding: {
            y: { field: 'normal.low' },
            y2: { field: 'normal.high' },
          },
        },
        {
          mark: { type: 'bar', size: 12, color: '#000' },
          encoding: {
            y: { field: 'actual.low' },
            y2: { field: 'actual.high' },
          },
        },
        {
          mark: { type: 'bar', size: 12, color: '#000' },
          encoding: {
            y: { field: 'forecast.low.low' },
            y2: { field: 'forecast.low.high' },
          },
        },
        {
          mark: { type: 'bar', size: 3, color: '#000' },
          encoding: {
            y: { field: 'forecast.low.high' },
            y2: { field: 'forecast.high.low' },
          },
        },
        {
          mark: { type: 'bar', size: 12, color: '#000' },
          encoding: {
            y: { field: 'forecast.high.low' },
            y2: { field: 'forecast.high.high' },
          },
        },
        {
          mark: { type: 'text', align: 'center', baseline: 'bottom', y: -5 },
          encoding: {
            text: { field: 'day' },
          },
        },
      ],
    },
  },
  decorators,
}

const streamingSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container' as const,
  height: 'container' as const,
  data: {
    values: [
      { x: -4, y: Math.sin(-4 * 0.1) * 50 + 40, category: 'stream' },
      { x: -3, y: Math.sin(-3 * 0.1) * 50 + 45, category: 'stream' },
      { x: -2, y: Math.sin(-2 * 0.1) * 50 + 52, category: 'stream' },
      { x: -1, y: Math.sin(-1 * 0.1) * 50 + 48, category: 'stream' },
      { x: 0, y: 50, category: 'stream' },
    ],
  },
  mark: {
    type: 'line' as const,
    interpolate: 'linear' as const,
    strokeWidth: 2,
    point: {
      filled: true,
      size: 50,
    },
  },
  encoding: {
    x: {
      field: 'x',
      type: 'quantitative' as const,
      scale: { zero: false },
      axis: { title: 'Time' },
    },
    y: {
      field: 'y',
      type: 'quantitative' as const,
      axis: { title: 'Value' },
    },
    color: { field: 'category', type: 'nominal' as const },
  },
}

export const IsotypeGrid = {
  args: {
    title: 'Isotype Grid',
    description: '**Drag region to select**.',
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 'container',
      data: {
        values: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
          { id: 11 },
          { id: 12 },
          { id: 13 },
          { id: 14 },
          { id: 15 },
          { id: 16 },
          { id: 17 },
          { id: 18 },
          { id: 19 },
          { id: 20 },
          { id: 21 },
          { id: 22 },
          { id: 23 },
          { id: 24 },
          { id: 25 },
          { id: 26 },
          { id: 27 },
          { id: 28 },
          { id: 29 },
          { id: 30 },
          { id: 31 },
          { id: 32 },
          { id: 33 },
          { id: 34 },
          { id: 35 },
          { id: 36 },
          { id: 37 },
          { id: 38 },
          { id: 39 },
          { id: 40 },
          { id: 41 },
          { id: 42 },
          { id: 43 },
          { id: 44 },
          { id: 45 },
          { id: 46 },
          { id: 47 },
          { id: 48 },
          { id: 49 },
          { id: 50 },
          { id: 51 },
          { id: 52 },
          { id: 53 },
          { id: 54 },
          { id: 55 },
          { id: 56 },
          { id: 57 },
          { id: 58 },
          { id: 59 },
          { id: 60 },
          { id: 61 },
          { id: 62 },
          { id: 63 },
          { id: 64 },
          { id: 65 },
          { id: 66 },
          { id: 67 },
          { id: 68 },
          { id: 69 },
          { id: 70 },
          { id: 71 },
          { id: 72 },
          { id: 73 },
          { id: 74 },
          { id: 75 },
          { id: 76 },
          { id: 77 },
          { id: 78 },
          { id: 79 },
          { id: 80 },
          { id: 81 },
          { id: 82 },
          { id: 83 },
          { id: 84 },
          { id: 85 },
          { id: 86 },
          { id: 87 },
          { id: 88 },
          { id: 89 },
          { id: 90 },
          { id: 91 },
          { id: 92 },
          { id: 93 },
          { id: 94 },
          { id: 95 },
          { id: 96 },
          { id: 97 },
          { id: 98 },
          { id: 99 },
          { id: 100 },
        ],
      },
      transform: [
        { calculate: 'ceil (datum.id/10)', as: 'col' },
        { calculate: 'datum.id - datum.col*10', as: 'row' },
      ],
      mark: { type: 'point', filled: true },
      encoding: {
        x: { field: 'col', type: 'ordinal', axis: null },
        y: { field: 'row', type: 'ordinal', axis: null },
        shape: {
          value:
            'M1.7 -1.7h-0.8c0.3 -0.2 0.6 -0.5 0.6 -0.9c0 -0.6 -0.4 -1 -1 -1c-0.6 0 -1 0.4 -1 1c0 0.4 0.2 0.7 0.6 0.9h-0.8c-0.4 0 -0.7 0.3 -0.7 0.6v1.9c0 0.3 0.3 0.6 0.6 0.6h0.2c0 0 0 0.1 0 0.1v1.9c0 0.3 0.2 0.6 0.3 0.6h1.3c0.2 0 0.3 -0.3 0.3 -0.6v-1.8c0 0 0 -0.1 0 -0.1h0.2c0.3 0 0.6 -0.3 0.6 -0.6v-2c0.2 -0.3 -0.1 -0.6 -0.4 -0.6z',
        },
        color: {
          condition: { param: 'highlight', value: 'rgb(194,81,64)' },
          value: 'rgb(167,165,156)',
        },
        size: { value: 15 },
      },
      params: [{ name: 'highlight', select: 'interval' }],
    },
  },
  decorators,
}

export const StreamingLineChartWithAppend: StoryFn = () => {
  const [newPoints, setNewPoints] = useState<
    Array<{ x: number; y: number; category: string }>
  >([])

  const counterRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      counterRef.current += 1
      const newPoint = {
        x: counterRef.current,
        y: Math.sin(counterRef.current * 0.1) * 50 + Math.random() * 20,
        category: 'stream',
      }

      // Only send the new single point
      setNewPoints([newPoint])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const updatedData =
    newPoints.length > 0
      ? [
          {
            title: `Streaming Line Chart - v${counterRef.current}`,
            description: `This chart demonstrates real-time data streaming with new points added every second. Data is updated at point ${counterRef.current}.`,
            spec: {
              ...streamingSpec,
              data: {
                values: newPoints,
              },
            },
            theme: {
              dark: 'dark' as const,
            },
            updateType: UpdateType.Append,
          },
        ]
      : undefined

  return (
    <div
      style={{
        width: 'clamp(250px, 70vw, 1000px)',
        height: 'clamp(150px, 40vh, 400px)',
      }}
    >
      <VegaLiteViz
        spec={streamingSpec}
        updatedData={updatedData}
        updateType={UpdateType.Append}
        theme={{
          dark: 'dark',
        }}
        title="Streaming Line Chart"
        description="This chart demonstrates real-time data streaming with new points added every second."
      />
    </div>
  )
}

export const StreamingLineChartWithReplace: StoryFn = () => {
  const [newPoints, setNewPoints] = useState<
    Array<{ x: number; y: number; category: string }>
  >([])
  const counterRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      counterRef.current += 1
      const newPoint = {
        x: counterRef.current,
        y: Math.sin(counterRef.current * 0.1) * 50 + Math.random() * 20,
        category: 'stream',
      }

      // Only send the new single point
      setNewPoints([newPoint])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const updatedData =
    newPoints.length > 0
      ? [
          {
            title: `Streaming Line Chart - v${counterRef.current}`,
            description: `This chart demonstrates real-time data streaming with new points replace old ones every second. Data is replaced at point ${counterRef.current}.`,
            spec: {
              ...streamingSpec,
              data: {
                values: newPoints,
              },
            },
            theme: {
              dark: 'dark' as const,
            },
            updateType: UpdateType.Replace,
          },
        ]
      : undefined

  return (
    <div
      style={{
        width: 'clamp(250px, 70vw, 1000px)',
        height: 'clamp(150px, 40vh, 400px)',
      }}
    >
      <VegaLiteViz
        spec={streamingSpec}
        updatedData={updatedData}
        updateType={UpdateType.Replace}
        theme={{
          dark: 'dark',
        }}
        title="Streaming Line Chart"
        description="This chart demonstrates real-time data streaming with new points replace old ones every second."
      />
    </div>
  )
}
