import './table.css'

import { useTheme } from '@mui/material'
import Stack from '@mui/material/Stack'
import { default as MuiTable } from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type React from 'react';
import { useState } from 'react'

import { capitalizeFirstLetter } from '../helper'
import Icon from '../icon/icon'
import MarkedMarkdown from '../markdown/markedMarkdown'
import type { TableData, TableHeader } from '../types'

const paginationThreshold = 10

enum Order {
  Ascending = 'asc',
  Descending = 'desc',
}

type SortingCriteria = { [dataKey: string]: Order }

function SortIcon() {
  return <Icon name="expand_all" />
}

/** The `Table` component provides a simple and customizable table display for presenting structured data. It supports rendering data rows with associated headers and allows for easy customization of table title, description, and column headers. Pagination is enabled when the number of rows exceeds 10. */
export default function Table(props: TableData) {
  if (props.data.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  }

  const isPaginationEnabled = props.data.length > paginationThreshold
  const [sortingCriteria, setSortingCriteria] = useState<SortingCriteria>({})
  const [rowsPerPage, setRowsPerPage] = useState(
    isPaginationEnabled ? paginationThreshold : -1
  )
  const [currentPage, setCurrentPage] = useState(0)
  const theme = useTheme()

  const dataKeys = Array.from(
    new Set(props.data.flatMap((rowData) => Object.keys(rowData)))
  )
  const headers: TableHeader[] =
    props.headers || dataKeys.map((key) => ({ dataKey: key }))

  function handleSortRequest(dataKey: string) {
    setSortingCriteria((prevCriteria) => {
      const currentOrder = prevCriteria[dataKey]
      let newSortingCriteria: SortingCriteria

      switch (currentOrder) {
        case Order.Ascending:
          newSortingCriteria = { [dataKey]: Order.Descending }
          break
        case Order.Descending:
          newSortingCriteria = {}
          break
        default:
          newSortingCriteria = { [dataKey]: Order.Ascending }
          break
      }

      return newSortingCriteria
    })
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  function sortData(array: Record<string, string | number>[]) {
    const sortingKey = Object.keys(sortingCriteria)[0]
    const sortingOrder = sortingCriteria[sortingKey]

    if (!sortingKey || !sortingOrder) {
      return array
    }

    return array.slice().sort((firstItem, secondItem) => {
      const sortingKey = Object.keys(sortingCriteria)[0]
      const sortingOrder = sortingCriteria[sortingKey]
      if (firstItem[sortingKey] < secondItem[sortingKey]) {
        return sortingOrder === Order.Descending ? 1 : -1
      }
      if (firstItem[sortingKey] > secondItem[sortingKey]) {
        return sortingOrder === Order.Descending ? -1 : 1
      }
      return 0
    })
  }

  const sortedData = sortData(props.data)

  const dataOfCurrentPage = sortedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  )

  const dataToDisplay = rowsPerPage > 0 ? dataOfCurrentPage : sortedData

  function getHeaderIcon(dataKey: string) {
    if (!sortingCriteria[dataKey]) {
      return SortIcon
    }
  }

  function getTooltipTitle(dataKey: string): string {
    const sortDirection = sortingCriteria[dataKey]

    if (sortDirection) {
      //get Enum name
      return Object.keys(Order)[Object.values(Order).indexOf(sortDirection)]
    } else {
      return 'Sort'
    }
  }

  return (
    <Stack className="rustic-table" spacing={1}>
      {props.title && (
        <Typography
          variant="h6"
          data-cy="table-title"
          className="rustic-table-title"
        >
          {props.title}
        </Typography>
      )}
      {props.description && (
        <MarkedMarkdown text={props.description} data-cy="table-description" />
      )}
      <TableContainer className="rustic-table-container">
        <MuiTable
          aria-label={props.title || 'a table of data'}
          size="small"
          stickyHeader
        >
          {headers.length > 0 && (
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell
                    key={`header-${index}`}
                    //for adding aria label
                    sortDirection={sortingCriteria[header.dataKey] || false}
                  >
                    <Tooltip title={getTooltipTitle(header.dataKey)}>
                      <TableSortLabel
                        active={true}
                        direction={sortingCriteria[header.dataKey]}
                        onClick={() => handleSortRequest(header.dataKey)}
                        className="rustic-table-header"
                        IconComponent={getHeaderIcon(header.dataKey)}
                      >
                        {header.label || capitalizeFirstLetter(header.dataKey)}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {dataToDisplay.map((rowData, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {headers.map((header, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                    {rowData[header.dataKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {isPaginationEnabled && (
        <TablePagination
          className="rustic-table-pagination"
          data-cy="table-pagination"
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Rows:"
          page={currentPage}
          onPageChange={(
            event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
            newPage: number
          ) => setCurrentPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-selectLabel': {
              color: theme.palette.text.disabled,
            },
          }}
          classes={{
            toolbar: 'rustic-table-toolbar',
            input: 'rustic-table-input',
            spacer: 'rustic-table-spacer',
            displayedRows: 'rustic-table-displayed-rows',
            actions: 'rustic-table-actions',
          }}
        />
      )}
    </Stack>
  )
}
