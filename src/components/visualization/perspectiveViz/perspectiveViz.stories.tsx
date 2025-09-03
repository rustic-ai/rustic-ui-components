/* eslint-disable no-magic-numbers */
import type { Meta, StoryFn } from '@storybook/react-webpack5'
import React from 'react'

import { initPerspective } from './perspectiveInit'
import PerspectiveViz from './perspectiveViz'

initPerspective()

const meta: Meta<React.ComponentProps<typeof PerspectiveViz>> = {
  title: 'Rustic UI/Visualization/PerspectiveViz',
  component: PerspectiveViz,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
meta.argTypes = {
  ...meta.argTypes,
  headers: {
    description: 'Optional array to assign labels',
    table: {
      type: {
        summary: 'Array of TableHeader.',
        detail:
          'Each TableHeader has the following fields:\n' +
          '  dataKey: Field in table data for this header. \n' +
          '  label: Optional label for this header.\n',
      },
      defaultValue: {
        summary:
          'If no headers are provided, the keys from data are used to generate this.',
      },
    },
  },
  config: {
    table: {
      type: {
        summary: 'TableConfig.',
        detail:
          'TableConfig has the following optional fields:\n' +
          '  expansionDepth: A number that specifies how \n' +
          '    many levels deep the pivot table should expand\n' +
          '    initially. By default, all of the rows are \n' +
          '    expanded. Larger numbers expand more levels.\n' +
          '  columns: An array of data key strings used to\n' +
          '    specify the columns to be included and their\n' +
          '    order. If not provided, all columns from the\n' +
          '    data will be included in their default order.\n' +
          '  groupBy: An array of data key strings used to\n' +
          '    aggregate data and create total rows per group.\n' +
          '    Applied in the specified order to create nested\n' +
          '    groupings.\n' +
          '  splitBy: An array of data key strings used to\n' +
          '    create new columns without aggregation and\n' +
          '    segment data by unique values Applied in the\n' +
          '    specified order to create nested groupings.\n' +
          '  aggregates: An object where each key is a column\n' +
          '    name and each value is an aggregation option.\n' +
          '    `TableAggregateOption` determines how data in\n' +
          '    the specified columns should be aggregated,\n' +
          '  sort: An array of sorting criteria, where each\n' +
          '    criterion is structured as \n' +
          '    `[string, TableSortOption]`.\n' +
          '  filter: An array of filter criteria, where each\n' +
          '    criterion is defined as a tuple containing: \n' +
          '    - Column data key string.\n' +
          '    - `FilterOperation` specifies how the filter\n' +
          '      is applied to the column data. The following\n' +
          '      operations are supported:\n' +
          '      "<"|">"|"<="|">="|"=="|"!="|"is null"|\n' +
          '      "is not null"|"in"|"not in"|"begins with"|\n' +
          '      "contains"\n' +
          '    - The value or an array of values used as\n' +
          '      criteria for filtering.\n' +
          '  dateColumns: An array of columns which are of datetype. \n' +
          '    Useful if you want to specify the format to show dates in \n' +
          '  dateStyle: dateStyle option of Intl.DateTimeFormat - \n' +
          '    "full" | "long" | "medium" | "short" | "disabled" \n' +
          '\n' +
          '`TableAggregateOption` supports the following values:\n' +
          '  `abs sum`|`and`|`any`|`avg`|`count`|`distinct count`\n' +
          '  |`distinct leaf`|`dominant`|`first`|`high`|`last`\n' +
          '  |`low`|`or`|`median`|`pct sum grand total`|\n' +
          '  `pct sum parent`|`stddev`|`sum`|`sum abs`|\n' +
          '  `sum not null`|`unique`|`var`|\n' +
          '  `["weighted mean", string]`|\n' +
          '\n' +
          '`TableSortOption` supports the following values:\n' +
          '  `asc`|`desc`|`col asc`|`col desc`',
      },
      defaultValue: {
        summary:
          'If no headers are provided, the keys from data are used to generate this.',
      },
    },
  },
}

const regions: ('East' | 'West' | 'South' | 'Midwest')[] = [
  'East',
  'West',
  'South',
  'Midwest',
]
const regionsAndStates: Record<
  'East' | 'West' | 'South' | 'Midwest',
  string[]
> = {
  East: ['New York', 'Pennsylvania'],
  West: ['California', 'Washington'],
  South: ['Texas', 'Florida'],
  Midwest: ['Illinois'],
}
const categories: (
  | 'Technology'
  | 'Furniture'
  | 'Office Supplies'
  | 'Apparel'
  | 'Food and Beverage'
)[] = [
  'Technology',
  'Furniture',
  'Office Supplies',
  'Apparel',
  'Food and Beverage',
]
const subCategories: Record<
  | 'Technology'
  | 'Furniture'
  | 'Office Supplies'
  | 'Apparel'
  | 'Food and Beverage',
  string[]
> = {
  Technology: ['Phones', 'Computers', 'Tablets'],
  Furniture: ['Chairs', 'Desks', 'Tables'],
  'Office Supplies': ['Pens', 'Paper', 'Binders'],
  Apparel: ['Shirts', 'Pants', 'Shoes'],
  'Food and Beverage': ['Snacks', 'Drinks', 'Candy'],
}

function generateFakeData(numEntries: number) {
  const newData = []
  for (let i = 0; i < numEntries; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)]
    const validStates = regionsAndStates[region]
    const state = validStates[Math.floor(Math.random() * validStates.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const subCategory =
      subCategories[category][
        Math.floor(Math.random() * subCategories[category].length)
      ]
    const sales = Math.floor(Math.random() * 20000) + 1000
    const profit =
      Math.floor(Math.random() * (sales * 0.4)) * (Math.random() < 0.5 ? -1 : 1)
    const orderDate = `${2021 + Math.floor(Math.random() * 3)}/${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}`

    newData.push({
      region: region,
      state: state,
      category: category,
      subCategory: subCategory,
      sales: sales,
      profit: profit,
      orderDate: orderDate,
    })
  }
  return newData
}

const decorators = [
  (Story: StoryFn) => {
    return (
      <div
        style={{
          width: 'clamp(250px, 70vw, 900px)',
          height: 'clamp(150px, 80vh, 500px)',
        }}
      >
        <Story />
      </div>
    )
  },
]

const tableHeaders = [
  { dataKey: 'region', label: 'Region' },
  { dataKey: 'state', label: 'State' },
  { dataKey: 'category', label: 'Category' },
  { dataKey: 'subCategory', label: 'Sub-Category' },
  { dataKey: 'sales', label: 'Sales' },
  { dataKey: 'profit', label: 'Profit' },
  { dataKey: 'orderDate', label: 'Order Date' },
]

export const PivotTable = {
  args: {
    data: generateFakeData(100),
    config: {
      groupBy: ['region', 'state'],
      splitBy: ['category', 'subCategory'],
      aggregates: { sales: 'any', profit: 'any' },
      columns: ['sales', 'profit'],
    },
    headers: tableHeaders,
    title: 'Superstore Table',
    description:
      "This table displays data for sales and profit under each category. It's also grouped based on regions and states, making it useful for comparison purposes.",
  },
  decorators,
}

export const ExpandOneLevel = {
  args: {
    data: generateFakeData(100),
    config: {
      groupBy: ['region', 'state'],
      splitBy: ['category', 'subCategory'],
      aggregates: { sales: 'any', profit: 'any' },
      columns: ['sales', 'profit'],
      expansionDepth: 0,
    },
    headers: tableHeaders,
    title: 'Superstore Table',
    description:
      "This table displays data for sales and profit under each category. It's also grouped based on regions and states, making it useful for comparison purposes.",
  },
  decorators,
}

export const NormalTable = {
  args: {
    data: generateFakeData(100),
    headers: tableHeaders,
    title: 'Superstore Table',
  },
  decorators,
}

export const NoData = {
  args: {
    data: [],
  },
}

export const TableWithSimplerDate = {
  args: {
    data: generateFakeData(5),
    headers: tableHeaders,
    title: 'Table With Default Date Format',
    config: {
      dateColumns: ['Order Date'],
    },
  },
  decorators,
}

export const TableWithFullDateFormat = {
  args: {
    data: generateFakeData(10),
    headers: tableHeaders,
    title: 'Table With Full Date',
    config: {
      dateColumns: ['Order Date'],
      dateStyle: 'full',
    },
  },
  decorators,
}
