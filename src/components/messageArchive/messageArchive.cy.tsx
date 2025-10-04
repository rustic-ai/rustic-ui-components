import 'cypress-real-events'

import { v4 as getUUID } from 'uuid'

import {
  botUser,
  supportedViewports,
  testUser,
} from '../../../cypress/support/variables'
import {
  FCCalendar,
  Image,
  MarkedMarkdown,
  type Message,
  OpenLayersMap,
  Prompts,
  Table,
  Text,
  UniformsForm,
} from '..'
import Icon from '../icon/icon'
import MessageArchive from './messageArchive'

describe('MessageArchive Component', () => {
  const supportedElements = {
    TextFormat: Text,
    MarkdownFormat: MarkedMarkdown,
    ImageFormat: Image,
    LocationFormat: OpenLayersMap,
    TableFormat: Table,
    CalendarFormat: FCCalendar,
    FormFormat: UniformsForm,
    PromptsFormat: Prompts,
  }

  const conversationId = '1'

  const agentMessageData = {
    sender: botUser,
    conversationId,
  }

  const humanMessageData = {
    sender: testUser,
    conversationId,
  }

  const messages = [
    {
      ...humanMessageData,
      id: getUUID(),
      timestamp: '2024-01-02T00:00:00.000Z',
      format: 'updateMarkdownFormat',
      data: {
        text: 'message 1',
        updateId: 'someMarkdown',
      },
    },
    {
      ...agentMessageData,
      id: getUUID(),
      timestamp: '2024-01-02T00:01:00.000Z',
      format: 'TextFormat',
      data: {
        text: 'message 2',
      },
    },
    {
      ...humanMessageData,
      id: getUUID(),
      timestamp: '2024-01-02T00:12:00.000Z',
      format: 'TextFormat',
      data: {
        text: 'message 3',
      },
    },
  ]

  const messageArchive = '[data-cy=message-archive]'
  const messageContainer = '[data-cy=message-container]'

  supportedViewports.forEach((viewport) => {
    it(`renders correctly with provided messages on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MessageArchive
          getHistoricMessages={() => {
            return new Promise((resolve) => {
              resolve(messages)
            })
          }}
          supportedElements={supportedElements}
          getProfileComponent={(message: Message) => {
            if (message.sender.name?.includes('Agent')) {
              return <Icon name="smart_toy" />
            } else {
              return <Icon name="account_circle" />
            }
          }}
        />
      )
      const messageCanvas = '[data-cy=message-canvas]'
      cy.get(messageArchive).should('exist')

      messages.forEach((message, index) => {
        cy.get(messageArchive).should('contain', message.data.text)
        if (message.sender.name?.includes('Agent')) {
          cy.get(messageCanvas)
            .eq(index)
            .within(() => {
              cy.get('span[data-cy="smart-toy-icon"]').should('exist')
            })
        } else {
          cy.get(messageCanvas)
            .eq(index)
            .within(() => {
              cy.get('span[data-cy="account-circle-icon"]').should('exist')
            })
        }
      })
    })

    it.only(`scrolls to bottom when "Go to bottom" button is clicked on ${viewport} screen`, () => {
      const waitTime = 500

      cy.viewport(viewport)
      cy.mount(
        <div style={{ height: '200px', display: 'flex' }}>
          <MessageArchive
            getHistoricMessages={() => {
              return new Promise((resolve) => {
                resolve(messages)
              })
            }}
            supportedElements={supportedElements}
          />
        </div>
      )

      cy.get('p').contains('message 3').should('be.visible')
      cy.get(messageArchive).contains('message 1').should('not.be.visible')
      cy.get(messageContainer).scrollTo('top', { duration: 500 })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(waitTime)
      cy.get('[data-cy=scroll-down-button]').should('be.visible').realClick()

      cy.get(messageArchive).then((messageList) => {
        cy.wrap(messageList).within(() => {
          cy.contains('message 3').should('be.visible')
        })
      })
    })

    it(`displays info message when provided on ${viewport} screen`, () => {
      const infoMessageText =
        'This is an important notice about this conversation'
      cy.viewport(viewport)
      cy.mount(
        <MessageArchive
          getHistoricMessages={() => {
            return new Promise((resolve) => {
              resolve(messages)
            })
          }}
          supportedElements={supportedElements}
          infoMessage={infoMessageText}
        />
      )
      const infoMessage = '[data-cy=info-message]'

      cy.get(infoMessage).should('exist')
      cy.get(infoMessage).should('contain', infoMessageText)
    })
  })
})
