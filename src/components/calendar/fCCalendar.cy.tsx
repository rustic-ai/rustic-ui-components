import { supportedViewports } from '../../../cypress/support/variables'
import FCCalendar from './fCCalendar'

// FullCalendar 7 measures its layout with ResizeObserver, which can report a
// harmless "loop completed with undelivered notifications" error while
// Cypress resizes the viewport. Ignore only that error, only in this spec.
Cypress.on('uncaught:exception', (error) =>
  error.message.includes('ResizeObserver loop') ? false : undefined
)

describe('ScheduleCalendar Component', () => {
  const mockEvents = [
    {
      id: '1',
      start: '2024-02-07T10:00:00',
      end: '2024-02-07T12:00:00',
      title: 'Aquarium',
    },
    {
      id: '2',
      start: '2024-02-07T12:00:00',
      end: '2024-02-07T14:00:00',
      title: 'Lunch',
    },
    {
      id: '3',
      start: '2024-02-08T09:00:00',
      end: '2024-02-08T16:00:00',
      title: 'Niagra Falls',
    },
    {
      id: '4',
      start: '2024-02-09T14:00:00',
      end: '2024-02-09T16:00:00',
      title: 'Casa Loma',
    },
    {
      id: '5',
      start: '2024-02-09T10:30:00',
      end: '2024-02-09T12:30:00',
      title: 'Royal Ontario Museum',
    },
  ]

  // FullCalendar 7 renders hashed class names, so find the arrows by their
  // accessible labels ("Previous Week", "Next Month", ...).
  const eventTitle = '.rustic-fc-event-title'
  const prevButton = 'button[aria-label^="Previous"]'
  const nextButton = 'button[aria-label^="Next"]'
  const initialDate = '7 Wednesday' // first event
  const initialWeek = '4 Sun' // week of first event
  const initialMonth = 'February 2024' // month of first event

  beforeEach(() => {
    cy.mount(<FCCalendar events={mockEvents} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`allows the user to navigate to the next and previous week on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('Week').click()
      // On narrow screens FullCalendar 7 shortens week headers to one letter,
      // so check the full date each header carries for screen readers.
      cy.get(prevButton).click()
      cy.contains('January 29, 2024').should('exist')
      cy.get(nextButton).click()
      cy.contains('February 7, 2024').should('exist')
    })

    it(`allows the user to navigate to the next and previous day on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('Day').click()
      cy.get(prevButton).click()
      cy.contains('6 Tuesday').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialDate).should('be.visible')
    })
  })

  context('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
      cy.mount(<FCCalendar events={mockEvents} />)
    })

    it('can toggle to show week view and day view on screen', () => {
      cy.get('button').contains('Week').click()
      cy.contains(initialWeek).should('be.visible')
      cy.get('button').contains('Day').click()
      cy.contains(initialDate).should('be.visible')
    })

    it('can show the title and events properly', () => {
      cy.contains(initialMonth).should('be.visible')
      cy.get(eventTitle).first().contains('Aquarium').should('be.visible')
      cy.get(eventTitle).last().contains('Casa Loma').should('be.visible')
    })

    it('allows the user to navigate to the next and previous month', () => {
      cy.get(prevButton).click()
      cy.contains('January 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialMonth).should('be.visible')
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
      cy.mount(<FCCalendar events={mockEvents} />)
    })

    it('can toggle to show week view and day view on screen', () => {
      cy.get('button').contains('Week').click()
      // Week headers are single letters on narrow screens in FullCalendar 7.
      cy.contains('February 4, 2024').should('exist')
      cy.get('button').contains('Day').click()
      cy.contains(initialDate).should('be.visible')
    })

    it('can show the title and events properly', () => {
      cy.contains(initialDate).should('be.visible')
      cy.get(eventTitle).first().contains('Aquarium').should('exist')
      cy.get(eventTitle).last().contains('Lunch').should('exist')
    })

    it('allows the user to navigate to the next and previous month', () => {
      cy.get('button').contains('Month').click()
      cy.get(prevButton).click()
      cy.contains('January 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialMonth).should('be.visible')
    })
  })
})
