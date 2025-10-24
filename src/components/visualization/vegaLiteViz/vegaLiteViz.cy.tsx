import type { VisualizationSpec } from 'vega-embed'

import { supportedViewports } from '../../../../cypress/support/variables'
import VegaLiteViz from './vegaLiteViz'

describe('VegaLiteViz', () => {
  beforeEach(() => {
    cy.mount(
      <VegaLiteViz
        spec={{
          $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
          width: 'container',
          data: {
            values: [
              { a: 'A', b: 28 },
              { a: 'B', b: 55 },
              { a: 'C', b: 43 },
            ],
          },
          mark: 'bar',
          encoding: {
            x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
            y: { field: 'b', type: 'quantitative' },
          },
        }}
        theme={{
          dark: 'dark',
        }}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should display the graphic on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get('[data-cy="vega-lite"]').should('exist')
    })

    it(`should show the menu options properly on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get('[data-cy="vega-lite"]').should('exist')
      cy.get('.rustic-vega-lite').should('exist')
      cy.get('[data-cy="menu-icon-button"]').click()
      cy.contains('Save as SVG').should('exist')
      cy.contains('Save as PNG').should('exist')
    })

    const invalidSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
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
    } as VisualizationSpec

    it(`displays an error message if the spec is wrong on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <VegaLiteViz
          spec={invalidSpec}
          theme={{
            dark: 'dark',
          }}
        />
      )
      cy.get('p').contains('Failed to load the chart.')
    })

    it(`should render chart correctly when toggled from hidden to visible on ${viewport} screen`, () => {
      cy.viewport(viewport)

      // Mount with chart initially hidden
      cy.mount(
        <div>
          <button id="toggle-btn">Toggle</button>
          <div
            id="chart-container"
            style={{ display: 'none', width: '500px', height: '300px' }}
          >
            <VegaLiteViz
              spec={{
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                width: 'container',
                height: 'container',
                data: {
                  values: [
                    { a: 'A', b: 28 },
                    { a: 'B', b: 55 },
                    { a: 'C', b: 43 },
                  ],
                },
                mark: 'bar',
                encoding: {
                  x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
                  y: { field: 'b', type: 'quantitative' },
                },
              }}
              theme={{
                dark: 'dark',
              }}
            />
          </div>
        </div>
      ).then(() => {
        // Set up toggle functionality
        cy.get('#toggle-btn').then(($btn) => {
          $btn.on('click', () => {
            const container = document.getElementById('chart-container')
            if (container) {
              container.style.display =
                container.style.display === 'none' ? 'block' : 'none'
            }
          })
        })
      })

      cy.get('#chart-container').should('not.be.visible')
      cy.get('#toggle-btn').click()
      cy.get('#chart-container').should('be.visible')

      // Wait for chart canvas/SVG to render with proper dimensions
      cy.get('.rustic-vega-lite canvas, .rustic-vega-lite svg', {
        timeout: 10000,
      })
        .should('exist')
        .and(($el) => {
          const width = $el.width()
          const height = $el.height()
          expect(width).to.be.greaterThan(0)
          expect(height).to.be.greaterThan(0)
        })
    })
  })
})
