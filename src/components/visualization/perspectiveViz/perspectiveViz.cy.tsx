import { initPerspective } from './perspectiveInit'
import PerspectiveViz from './perspectiveViz'
const sampleData = [
  {
    Region: 'East',
    State: 'New York',
    Category: 'Technology',
    'Sub-Category': 'Phones',
    Sales: 12000.5,
    Profit: 3000.75,
    'Order Date': '2021/5/15',
  },
  {
    Region: 'West',
    State: 'Washington',
    Category: 'Furniture',
    'Sub-Category': 'Tables',
    Sales: 15000.0,
    Profit: 4000.5,
    'Order Date': '2021/9/15',
  },
  {
    Region: 'South',
    State: 'Alabama',
    Category: 'Office Supplies',
    'Sub-Category': 'Envelopes',
    Sales: 8000.25,
    Profit: 2000.25,
    'Order Date': '2021/1/15',
  },
]

initPerspective()

describe('PerspectiveViz Component', () => {
  const data = {
    data: sampleData,
    config: {
      group_by: ['Region', 'State'],
      split_by: ['Category', 'Sub-Category'],
      columns: ['Sales', 'Profit'],
    },
    title: 'Superstore Sales Data',
    description:
      'This table displays sales and profit data grouped by region and state, and split by category.',
  }

  it('renders title and description', () => {
    cy.mount(<PerspectiveViz {...data} />)

    cy.get('[data-cy=table-title]').should('contain', 'Superstore Sales Data')
    cy.get('p').should(
      'contain',
      'This table displays sales and profit data grouped by region and state, and split by category.'
    )
    cy.get('perspective-viewer').should('exist')
  })

  it('handles error state', () => {
    const invalidData = {
      data: [],
    }

    cy.mount(<PerspectiveViz {...invalidData} />)

    cy.get('p').should('contain', 'No data available.')
  })
})
