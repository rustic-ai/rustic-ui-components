import './perspectiveViz.css'
import '@finos/perspective-viewer-datagrid'
import '@finos/perspective-viewer-d3fc'
import '@finos/perspective-viewer/dist/css/pro.css'
import '@finos/perspective-viewer/dist/css/pro-dark.css'

import type { Client, Table, View } from '@finos/perspective'
import type { HTMLPerspectiveViewerElement } from '@finos/perspective-viewer'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'
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
 * Note: [Perspective](https://perspective.finos.org/) libraries are not bundled, so they must be included in the application's build process:
 *
 * ```typescript
 * npm i @finos/perspective @finos/perspective-viewer @finos/perspective-viewer-d3fc @finos/perspective-viewer-datagrid
 * ```
 *
 * **Important**: You must call `initPerspective()` once at the root level of your application before using this component. Additionally, ensure your Webpack configuration supports WebAssembly (WASM) files by adding the following settings:
 * ```
 *   experiments: {
 *     asyncWebAssembly: true,
 *     syncWebAssembly: false,
 *  }
 * ```
 */
function PerspectiveViz(props: TableData) {
  if (props.data.length === 0) {
    return <Typography variant="body2">No data available.</Typography>
  }

  const viewerRef = useRef<HTMLPerspectiveViewerElement | null>(null)
  const rusticTheme = useTheme()
  const [hasError, setHasError] = useState<boolean>(false)
  const [worker, setWorker] = useState<Client>(globalPerspectiveWorker)
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
  }, [globalPerspectiveWorker])

  const transformedConfig = props.config && transformTableConfig(props.config)

  useEffect(() => {
    let table: Table | null = null
    let viewInstance: View | null = null
    let isMounted = true

    if (worker) {
      const viewer = viewerRef.current
      worker
        .table(transformTableData(props.data, props.headers))
        .then((newTable) => {
          table = newTable
          if (!isMounted) {
            if (table) {
              table.delete({ lazy: true })
              table = null
            }
          } else {
            if (viewer) {
              if (viewer.shadowRoot) {
                const sheet = new CSSStyleSheet()
                sheet.replaceSync(perspectiveVizAdditionalStyles)
                viewer.shadowRoot.adoptedStyleSheets.push(sheet)
              }

              return viewer.load(table)
            }
          }
        })
        .then(() => {
          if (isMounted && viewer) {
            return viewer.restore({
              ...transformedConfig,
              theme: perspectiveTheme,
              title: props.title,
              settings: false,
            })
          }
        })
        .then(() => {
          if (isMounted && viewer) {
            return viewer.getView()
          }
        })
        .then((view) => {
          if (!isMounted) {
            if (view) {
              view.delete()
            }
          } else {
            viewInstance = view

            const expansionDepth = props.config?.expansionDepth
            if (typeof expansionDepth === 'number' && viewInstance) {
              return viewInstance.set_depth(expansionDepth).then(() => {
                if (viewerRef.current) {
                  viewerRef.current.resize()
                }
              })
            }
          }
        })
        .catch(() => {
          setHasError(true)
        })
    }

    return () => {
      isMounted = false

      if (viewInstance) {
        viewInstance.delete()
      }
      if (table) {
        table.delete({ lazy: true })
      }
    }
  }, [worker, props.data, perspectiveTheme, props.config])

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
