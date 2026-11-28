/* eslint-disable no-magic-numbers */
import { supportedViewports } from '../../../../cypress/support/variables'
import PlotlyGraph from './plotlyGraph'

describe('PlotlyGraph', () => {
  beforeEach(() => {
    cy.mount(
      <PlotlyGraph
        plotParams={{
          data: [
            {
              x: ['Product A', 'Product B', 'Product C'],
              y: [20, 14, 23],
              type: 'bar',
              text: [20, 14, 23].map(String),
              textposition: 'auto',
              hoverinfo: 'none',
              marker: {
                color: 'rgb(158,202,225)',
                opacity: 0.6,
                line: {
                  color: 'rgb(8,48,107)',
                  width: 1.5,
                },
              },
            },
          ],
          layout: {
            title: {
              text: 'January 2013 Sales Report',
            },
            barmode: 'stack',
          },
        }}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should display the graphic on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get('.rustic-plotly').should('exist')
      cy.get('[data-cy="plotly"]').should('exist')
    })
  })
})

describe('PlotlyGraph sizing', () => {
  it('fills its container and redraws when the container narrows', () => {
    cy.viewport(1000, 800)
    cy.mount(
      <div data-cy="plotly-box" style={{ width: 600 }}>
        <PlotlyGraph
          plotParams={{
            data: [{ values: [19, 26, 55], type: 'pie' }],
            layout: {},
          }}
        />
      </div>
    )
    cy.get('.main-svg').first().should('have.attr', 'width', '600')
    cy.get('[data-cy=plotly-box]').invoke('css', 'width', '300px')
    cy.get('.main-svg').first().should('have.attr', 'width', '300')
    // Resizing must not collapse the chart's height.
    cy.get('.main-svg').first().should('have.attr', 'height', '450')
    cy.get('.rustic-plotly').should(($plot) => {
      expect($plot[0].getBoundingClientRect().height).to.equal(450)
    })
  })

  it('keeps an explicit layout width', () => {
    cy.mount(
      <div style={{ width: 600 }}>
        <PlotlyGraph
          plotParams={{
            data: [{ values: [19, 26, 55], type: 'pie' }],
            layout: { width: 400 },
          }}
        />
      </div>
    )
    cy.get('.main-svg').first().should('have.attr', 'width', '400')
  })
})
