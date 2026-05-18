import './perspectiveViz.css'
import '@perspective-dev/viewer-datagrid'
import '@perspective-dev/viewer-d3fc'
import '@perspective-dev/viewer/dist/css/pro.css'
import '@perspective-dev/viewer/dist/css/pro-dark.css'

import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'
import type { Client, View } from '@perspective-dev/client'
import type {
  ColumnConfigValues,
  HTMLPerspectiveViewerElement,
  ViewerConfigUpdate,
} from '@perspective-dev/viewer'
import React, { useEffect, useRef, useState } from 'react'

import MarkedMarkdown from '../../markdown/markedMarkdown'
import type {
  TableConfig,
  TableData,
  TableFilter,
  TableHeader,
  TableSort,
} from '../../types'
import { globalPerspectiveWorker } from './perspectiveInit'

function createHeaderMap(headers?: Array<TableHeader>): Record<string, string> {
  if (!headers) {
    return {}
  }

  return headers.reduce(
    (map, header) => {
      const { dataKey, label } = header
      map[dataKey] = label || dataKey
      return map
    },
    {} as Record<string, string>
  )
}

export function transformTableData(
  originalData: Array<Record<string, string | number>>,
  headers?: TableHeader[]
) {
  const headerMap = createHeaderMap(headers)
  return originalData.map((record) => {
    const newData: Record<string, string | number> = {}
    for (const [key, value] of Object.entries(record)) {
      const newKey = headerMap[key] || key
      newData[newKey] = value
    }
    return newData
  })
}

/** The PerspectiveViz component is designed to efficiently display and process large datasets, supporting interactive features such as filtering, sorting, and aggregating data for enhanced analysis and visualization. It integrates with the [Perspective library](https://perspective.finos.org/) to render data in various formats, including datagrids(pivot tables) and charts.
 *
 * Note: [Perspective](https://perspective-dev.github.io/) libraries are not bundled, so they must be included in the application's build process:
 *
 * ```node
 * npm i @perspective-dev/server @perspective-dev/client @perspective-dev/viewer @perspective-dev/viewer-d3fc @perspective-dev/viewer-datagrid
 * ```
 *
 * * **Important**: You must call `initPerspective()` once at the root level of your application before using this component. Additionally, ensure your Webpack configuration supports WebAssembly (WASM) files by adding the following settings:
 * ```javascript
 *   // Reference - https://perspective-dev.github.io/guide/how_to/javascript/importing.html#webpack
 *   {
 *     // ...
 *     module: {
 *         // ...
 *         rules: [
 *             // ...
 *             {
 *                 test: /\.wasm$/,
 *                 type: "asset/resource"
 *             },
 *         ]
 *     },
 *     experiments: {
 *         // ...
 *         asyncWebAssembly: false,
 *         syncWebAssembly: false,
 *     },
 * }
 * ```
 */
function PerspectiveViz(props: TableData) {
  if (props.data.length === 0) {
    return <Typography variant="body2">No data available.</Typography>
  }

  const isLoadedRef = useRef<boolean>(false)
  const viewerRef = useRef<HTMLPerspectiveViewerElement | null>(null)
  const depthRetryRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rusticTheme = useTheme()
  const [hasError, setHasError] = useState<boolean>(false)
  const [worker, setWorker] = useState<Client>()
  const currentTheme = rusticTheme.palette.mode
  const perspectiveTheme = currentTheme === 'dark' ? 'Pro Dark' : 'Pro Light'

  const headerMap = createHeaderMap(props.headers)

  const perspectiveVizAdditionalStyles = `
  /* General Button Styles */
  button, .button:hover, #editor-container, .editable, #settings_button {
    border-radius: 16px !important;
    color: ${rusticTheme.palette.text.primary} !important;
    /* TODO: add background color after updating the theme */
  }
  
  #settings_button {
    border: 1px solid ${rusticTheme.palette.primary.light} !important;
  }
  
  /* Hide border for aggregate Selector */
  .aggregate-selector:hover {
    border: none !important;
  }
  
  /* Input and Select Elements */
  input, select, .noselect, #add-expression, .dropdown-width-container, 
  .pivot-column-border, .pivot-column, .column-selector-column-border {
    border-radius: 8px !important;
  }
  
  /* Change background color */
  #settings_panel, #column_settings_sidebar {
    background: ${currentTheme === 'dark' ? 'dark' : 'white'} !important;
    background-image: none !important;
  }
  
  /* Expression Edit Button */
  .expression-edit-button {
    display: none;
  }
  
  /* Add padding to expression input */
  #editor-container, .editable {
    padding: 8px !important;
  }
  
  /* Change Button Font Size */
  .button select, .button {
    font-size: 12px !important;
  }
  
  /* Button and Icon Colors */
  #status_bar .hover-target:hover .button>span {
    display:none !important;
  }
  
  #status_bar .hover-target.modal-target .button>span {
    display:none !important;
  }
  
  .button select:hover, .psp-expression-editor__button:hover, 
  .sidebar_close_button_inner:hover {
    background-color: ${rusticTheme.palette.primary.light} !important;
  }
  
  /* Hide unused buttons */
  #debug_open_button.sidebar_close_button, .reset-default-style-disabled, 
  .expression-edit-button, #theme, #status, #status_bar .input-sizer {
    display: none !important;
  }
  
  #status_bar .hover-target:hover, #status_bar .hover-target.modal-target {
    height: fit-content !important;
  }

  /* Enable Scrolling */
  #plugin_selector_container.open, #status_bar, #menu-bar, #app_panel {
    overflow: auto !important;
  }

  #settings_button:hover {
    color: ${rusticTheme.palette.primary.contrastText} !important;
    background-color: ${rusticTheme.palette.primary.main} !important;
  }
  `

  function formatFilterConfig(filter: Array<TableFilter>): Array<TableFilter> {
    return filter.map((filterItem) => {
      const filterColumn = headerMap[filterItem[0]] || filterItem[0]
      const filterOperation = filterItem[1]

      const filterValue = filterItem[filterItem.length - 1]
      return [filterColumn, filterOperation, filterValue]
    })
  }

  function transformTableConfig(config: TableConfig) {
    const { groupBy, splitBy, aggregates, sort, filter, columns } = config

    const formattedSortConfig = sort?.map((sortItem) => {
      const sortColumn = headerMap[sortItem[0]] || sortItem[0]
      const sortDirection = sortItem[1]
      return [sortColumn, sortDirection] as TableSort
    })

    const formattedAggregates =
      aggregates &&
      Object.fromEntries(
        Object.entries(aggregates).map(([dataKey, aggregateOption]) => [
          headerMap[dataKey] || dataKey,
          aggregateOption,
        ])
      )

    const transformedConfig = {
      group_by: groupBy?.map((dataKey) => headerMap[dataKey] || dataKey),
      split_by: splitBy?.map((dataKey) => headerMap[dataKey] || dataKey),
      aggregates: formattedAggregates,
      sort: formattedSortConfig,
      filter: filter && formatFilterConfig(filter),
      columns: columns?.map((dataKey) => headerMap[dataKey] || dataKey),
    }

    return transformedConfig
  }

  useEffect(() => {
    setWorker(globalPerspectiveWorker)
  }, [])

  const transformedConfig = props.config && transformTableConfig(props.config)

  useEffect(() => {
    let isMounted = true
    isLoadedRef.current = false
    const viewer = viewerRef.current

    if (worker) {
      worker
        .table(transformTableData(props.data, props.headers))
        .then((newTable) => {
          if (viewer) {
            if (viewer.shadowRoot) {
              const sheet = new CSSStyleSheet()
              sheet.replaceSync(perspectiveVizAdditionalStyles)
              viewer.shadowRoot.adoptedStyleSheets.push(sheet)
            }

            const dateColConfig = {
              date_format: {
                dateStyle: props.config?.dateStyle || 'medium',
              },
            }
            const colConfigs: { [columnName: string]: ColumnConfigValues } = {}
            props.config?.dateColumns?.forEach((column_name) => {
              // @ts-expect-error other fields are not needed for date formatting
              colConfigs[column_name] = dateColConfig
            })
            viewer
              .load(newTable)
              .then(() => {
                if (!isMounted) {
                  return
                }
                isLoadedRef.current = true

                return viewer
                  .restore({
                    ...transformedConfig,
                    theme: perspectiveTheme,
                    title: props.title,
                    settings: false,
                    columns_config: colConfigs,
                  } as ViewerConfigUpdate)
                  .then(() => {
                    if (!isMounted) {
                      return
                    }
                    const expansionDepth = props.config?.expansionDepth
                    if (typeof expansionDepth === 'number') {
                      const trySetDepth = () => {
                        if (!isMounted) {
                          if (depthRetryRef.current) {
                            clearInterval(depthRetryRef.current)
                          }
                          return
                        }
                        viewer
                          .getView()
                          .then((view: View) => {
                            if (!isMounted || !view) {
                              return
                            }
                            if (depthRetryRef.current) {
                              clearInterval(depthRetryRef.current)
                              depthRetryRef.current = null
                            }
                            view.set_depth(expansionDepth).then(() => {
                              viewer.resize()
                            })
                          })
                          .catch(() => {
                            // getView failed due to a race condition, will retry
                          })
                      }
                      trySetDepth()
                      // eslint-disable-next-line
                      depthRetryRef.current = setInterval(trySetDepth, 1000)
                    }
                  })
              })
              .catch(() => {
                setHasError(true)
              })
          }
        })
    }

    return () => {
      isMounted = false
      if (depthRetryRef.current) {
        clearInterval(depthRetryRef.current)
        depthRetryRef.current = null
      }
      if (isLoadedRef.current && viewer && typeof viewer.eject === 'function') {
        viewer
          .eject()
          .then(() => (isLoadedRef.current = false))
          .catch(() => {})
      }
      isLoadedRef.current = false
    }
  }, [worker, props.data, perspectiveTheme, props.config])

  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      if (event.reason?.message === 'No `Table` attached') {
        event.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', handler)
    return () => {
      window.removeEventListener('unhandledrejection', handler)
      const viewer = viewerRef.current
      if (
        isLoadedRef.current &&
        viewer &&
        typeof viewer.delete === 'function'
      ) {
        viewer.delete().catch(() => {})
      }
    }
  }, [])

  if (hasError) {
    return (
      <Typography variant="body2">Failed to create table from data.</Typography>
    )
  } else {
    return (
      <Stack direction="column" className="rustic-perspective-viz">
        {props.title && (
          <Typography variant="h6" data-cy="table-title">
            {props.title}
          </Typography>
        )}
        {props.description && (
          <MarkedMarkdown
            text={props.description}
            data-cy="table-description"
          />
        )}
        <perspective-viewer
          ref={viewerRef}
          style={{
            fontFamily: rusticTheme.typography.fontFamily,
          }}
        ></perspective-viewer>
      </Stack>
    )
  }
}

export default PerspectiveViz
