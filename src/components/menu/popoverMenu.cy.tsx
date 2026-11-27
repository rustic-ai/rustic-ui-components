/* eslint-disable no-console */
import type React from 'react'

import { supportedViewports } from '../../../cypress/support/variables'
import Icon from '../icon/icon'
import PopoverMenu from './popoverMenu'

describe('PopOverMenu', () => {
  const ariaLabel = 'open menu'
  const openMenu = `[aria-label="${ariaLabel}"]`
  const popoverMenu = '[data-cy=menu]'
  const celsiusClicked = 'Celsius clicked'
  const fahrenheitClicked = 'Fahrenheit clicked'
  const drawer = '.MuiDrawer-root'
  const popover = '.MuiPopover-root'

  const checkIcon = <Icon name="check" />
  const thermostatIcon = <Icon name="device_thermostat" />
  const cancelIcon = <Icon name="cancel" />

  const menuItems = [
    {
      label: 'Celsius',
      onClick: () => {
        console.log(celsiusClicked)
      },
      startDecorator: thermostatIcon,
      endDecorator: checkIcon,
    },
    {
      label: 'Fahrenheit',
      onClick: () => {
        console.log(fahrenheitClicked)
      },
      startDecorator: thermostatIcon,
      endDecorator: cancelIcon,
    },
  ]

  beforeEach(() => {
    cy.mount(<PopoverMenu menuItems={menuItems} ariaLabel={ariaLabel} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the component correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get(`${popoverMenu} li`).should('have.length', menuItems.length)

      // eslint-disable-next-line no-magic-numbers
      cy.get('[data-cy=device-thermostat-icon]').should('have.length', 2)
      cy.get('[data-cy=cancel-icon]').should('exist')
      cy.get('[data-cy=check-icon]').should('exist')
    })

    it(`renders the menu items in the order provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get(`${popoverMenu} li`).first().contains(menuItems[0].label)
      cy.get(`${popoverMenu} li`)
        .last()
        .contains(menuItems[menuItems.length - 1].label)
    })

    it(`executes the passed on onClicks in each item on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLogSpy')
      })

      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get(`${popoverMenu} li`).first().click()
      cy.get('@consoleLogSpy').should('be.calledWith', celsiusClicked)

      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get(`${popoverMenu} li`).last().click()
      cy.get('@consoleLogSpy').should('be.calledWith', fahrenheitClicked)
    })

    it(`has access to the event object when clicking an item on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <PopoverMenu
          menuItems={[
            {
              label: 'Celsius',
              onClick: (event?: React.MouseEvent<HTMLElement>) => {
                return console.log(event?.type)
              },
              startDecorator: thermostatIcon,
              endDecorator: cancelIcon,
            },
          ]}
          ariaLabel={ariaLabel}
        />
      )

      cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLogSpy')
      })

      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get(`${popoverMenu} li`).click()
      cy.get('@consoleLogSpy').should('be.calledWith', 'click')
    })

    it(`should render menu item with correct href and download attributes on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <PopoverMenu
          menuItems={[
            {
              label: 'Download SVG',
              href: 'https://example.com/file.svg',
              downloadFileName: 'file.svg',
            },
          ]}
          ariaLabel={ariaLabel}
        />
      )

      cy.get(openMenu).click()

      cy.get('a')
        .should('have.attr', 'href', 'https://example.com/file.svg')
        .and('have.attr', 'download', 'file.svg')
    })

    it(`renders the correct button if the buttonText prop is provided on ${viewport} screen`, () => {
      const button = '[data-cy=menu-button]'
      const iconButton = '[data-cy=menu-icon-button]'

      cy.viewport(viewport)
      cy.mount(
        <PopoverMenu
          menuItems={menuItems}
          ariaLabel={ariaLabel}
          icon={thermostatIcon}
        />
      )

      cy.get(iconButton).should('be.visible')
      cy.get(button).should('not.exist')

      cy.mount(
        <PopoverMenu
          menuItems={menuItems}
          ariaLabel={ariaLabel}
          buttonText="Edit"
        />
      )
      cy.get(button).should('be.visible')
      cy.get(iconButton).should('not.exist')

      cy.mount(
        <PopoverMenu
          menuItems={menuItems}
          ariaLabel={ariaLabel}
          icon={thermostatIcon}
          buttonText="Temperature"
        />
      )
      cy.get(button).should('be.visible')
      cy.get(iconButton).should('not.exist')
    })

    it(`closes the menu when clicking outside on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get('body').click()
      cy.get(popoverMenu).should('not.exist')
    })

    it(`closes the menu when clicking an item on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')

      cy.get(`${popoverMenu} li`).first().click()
      cy.get(popoverMenu).should('not.exist')
    })
  })

  context('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
      cy.mount(<PopoverMenu menuItems={menuItems} ariaLabel={ariaLabel} />)
    })

    it(`shows the correct element`, () => {
      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get(popover).should('be.visible')
      cy.get(drawer).should('not.exist')
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
      cy.mount(<PopoverMenu menuItems={menuItems} ariaLabel={ariaLabel} />)
    })

    it(`shows the correct element`, () => {
      cy.get(openMenu).click()
      cy.get(popoverMenu).should('be.visible')
      cy.get(drawer).should('be.visible')
      cy.get(popover).should('not.exist')
    })
  })
})
