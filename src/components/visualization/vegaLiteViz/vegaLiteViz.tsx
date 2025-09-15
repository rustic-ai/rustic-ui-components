import './vegaLiteViz.css'

import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as vega from 'vega'
import { default as VegaEmbed, type VisualizationSpec } from 'vega-embed'

import MarkedMarkdown from '../../markdown/markedMarkdown'
import PopoverMenu, { type PopoverMenuItem } from '../../menu/popoverMenu'
import type { VegaLiteProps } from './vegaLiteViz.types'

/** The `VegaLiteViz` component is a versatile tool for visualizing data using the Vega-Lite grammar. With support for various graphic types, it empowers users to create engaging and informative data visualizations effortlessly.
 *
 * Note: `vega-embed` is not bundled, so please install the following package using npm:
 *
 * ```typescript
 * npm i vega-embed
 * ```
 */
function VegaLiteViz({
  theme = {
    dark: 'dark' as const,
  },
  ...props
}: VegaLiteProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<vega.View | null>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  const rusticTheme: Theme = useTheme()
  const isDarkTheme = rusticTheme.palette.mode === 'dark'
  const defaultFont = rusticTheme.typography.fontFamily

  const customHttpLoader = (
    url: string,
    options: RequestInit
  ): Promise<string> => {
    const axiosOptions = {
      method: (options.method as string) || 'GET',
      headers: options.headers as Record<string, string>,
      responseType: 'text' as const,
      data: options.body,
    }

    let updateRequestHeaders

    if (props.getAuthHeaders) {
      updateRequestHeaders = props.getAuthHeaders().then((authData) => {
        axiosOptions.headers = {
          ...axiosOptions.headers,
          ...authData.headers,
        }
        return axiosOptions
      })
    } else {
      updateRequestHeaders = Promise.resolve(axiosOptions)
    }

    return updateRequestHeaders
      .then((finalOptions) => {
        return axios(url, finalOptions)
      })
      .then((response) => {
        return response.data
      })
  }

  function createLoader(): vega.Loader {
    const loader = vega.loader()

    if (props.getAuthHeaders) {
      loader.http = customHttpLoader
    }

    return loader
  }

  function extractDataFromUpdates(updateData: VegaLiteProps['updatedData']) {
    const allData: Record<string, unknown>[] = []

    updateData?.forEach((format) => {
      if (format.spec?.data && 'values' in format.spec.data) {
        const values = format.spec.data.values
        if (Array.isArray(values)) {
          allData.push(...values)
        }
      }
    })
    return allData
  }

  const tooltipStyle = {
    backgroundColor: rusticTheme.palette.primary.main,
    color: rusticTheme.palette.background.paper,
    borderRadius: rusticTheme.shape.borderRadius + 'px',
    padding: '4px 8px',
    fontSize: rusticTheme.typography.caption.fontSize,
    fontFamily: defaultFont,
    fontWeight: rusticTheme.typography.caption.fontWeight,
  }

  const tooltipOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatTooltip: (value: any, sanitize: (value: any) => string) =>
      renderToStaticMarkup(
        <div
          role="tooltip"
          className="rustic-vega-lite-tooltip-content"
          style={tooltipStyle}
        >
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <strong>{sanitize(key)}:</strong> {sanitize(val)}
            </div>
          ))}
        </div>
      ),
    disableDefaultStyle: true,
    //need this id to hide and show tooltip
    id: 'rustic-vega-lite-tooltip',
  }

  const menuItems: PopoverMenuItem[] = [
    {
      label: 'Save as SVG',
    },
    {
      label: 'Save as PNG',
    },
  ]

  function renderChart() {
    if (chartRef.current && props.spec) {
      const options = {
        config: { font: defaultFont },
        ...props.options,
        theme: isDarkTheme ? theme.dark : theme.light,
        tooltip: tooltipOptions,
        actions: false,
        loader: createLoader(),
      }

      if (!props.options?.config?.font) {
        options.config.font = defaultFont
      }
      const specToRender = { ...props.spec }
      delete specToRender.title
      VegaEmbed(chartRef.current, specToRender, options)
        .then((result) => {
          const opts = result.embedOptions
          const fileName =
            result.embedOptions.downloadFileName || 'visualization'
          const formats: Array<'svg' | 'png'> = ['svg', 'png']

          formats.map((format, index) => {
            const scaleFactor =
              typeof opts.scaleFactor === 'object'
                ? opts.scaleFactor[format]
                : opts.scaleFactor

            result.view.toImageURL(format, scaleFactor).then((url) => {
              menuItems[index].href = url
              menuItems[index].downloadFileName = `${fileName}.${format}`
            })
          })

          viewRef.current = result.view
          setHasError(false)

          // Set up auto-refresh for URL data sources
          setupAutoRefresh()
        })
        .catch(() => {
          setHasError(true)
        })
    }
  }

  useEffect(() => {
    renderChart()

    function handleResize() {
      renderChart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [props.spec, isDarkTheme])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        props.updatedData &&
        props.updatedData.length > 0 &&
        viewRef.current
      ) {
        const newData = extractDataFromUpdates(props.updatedData)
        if (newData.length > 0) {
          try {
            // Get data source name from spec
            const specData = props.spec?.data
            if (
              specData &&
              typeof specData === 'object' &&
              'name' in specData &&
              specData.name
            ) {
              const changeSet = vega.changeset().insert(newData)
              viewRef.current.change(specData.name, changeSet).run()
            }
          } catch (error) {
            console.error('Failed to update streaming data:', error)
          }
        }
      }
    }, 0) // Small delay to ensure chart is ready

    return () => clearTimeout(timeoutId)
  }, [props.updatedData])

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  function getUrlDataSource(spec: VisualizationSpec) {
    if (
      spec.data &&
      typeof spec.data === 'object' &&
      'url' in spec.data &&
      'refreshInterval' in spec.data
    ) {
      return {
        url: spec.data.url,
        refreshInterval: spec.data.refreshInterval as number,
      }
    }
  }

  function setupAutoRefresh() {
    if (viewRef.current && props.spec) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }

      const urlDataSource = getUrlDataSource(props.spec)

      if (urlDataSource) {
        const interval = setInterval(async () => {
          if (viewRef.current) {
            try {
              // Manually fetch fresh data
              const loader = createLoader()
              const freshDataText = await loader.load(urlDataSource.url)
              const freshData = JSON.parse(freshDataText)

              const changeSet = vega
                .changeset()
                .remove(() => true)
                .insert(freshData)

              // Get data source name from spec
              const data = props.spec?.data
              if (
                data &&
                typeof data === 'object' &&
                'name' in data &&
                data.name
              ) {
                viewRef.current.change(data.name, changeSet).run()
              }
            } catch {
              setHasError(true)
            }
          }
        }, urlDataSource.refreshInterval)

        refreshIntervalRef.current = interval
      }
    }
  }

  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  if (hasError) {
    return <Typography variant="body2">Failed to load the chart.</Typography>
  } else {
    return (
      <Stack direction="column" className="rustic-vega-lite-container">
        <Box justifyContent="end" display="flex">
          <PopoverMenu menuItems={menuItems} ariaLabel="Download options" />
        </Box>

        {props.title && <Typography variant="h6">{props.title}</Typography>}
        {props.description && <MarkedMarkdown text={props.description} />}
        <Box textAlign="center" mt={1}>
          {typeof props.spec.title === 'string' && (
            <Typography variant="subtitle2">{props.spec.title}</Typography>
          )}
          {props.spec.description && (
            <Typography variant="caption">{props.spec.description}</Typography>
          )}
        </Box>
        <div ref={chartRef} className="rustic-vega-lite" data-cy="vega-lite" />
      </Stack>
    )
  }
}

export default VegaLiteViz
