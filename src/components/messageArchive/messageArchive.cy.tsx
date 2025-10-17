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

    it(`scrolls to bottom when "Go to bottom" button is clicked on ${viewport} screen`, () => {
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

    it(`displays thread reply count when threadMessages are provided on ${viewport} screen`, () => {
      const message1Id = 'message-1'
      const message2Id = 'message-2'

      const threadMessages = {
        [message1Id]: [
          {
            ...humanMessageData,
            id: getUUID(),
            timestamp: '2024-01-02T00:02:00.000Z',
            format: 'TextFormat',
            data: {
              text: 'Thread reply 1',
            },
          },
          {
            ...agentMessageData,
            id: getUUID(),
            timestamp: '2024-01-02T00:03:00.000Z',
            format: 'TextFormat',
            data: {
              text: 'Thread reply 2',
            },
          },
        ],
        [message2Id]: [
          {
            ...humanMessageData,
            id: getUUID(),
            timestamp: '2024-01-02T00:14:00.000Z',
            format: 'TextFormat',
            data: {
              text: 'Single thread reply',
            },
          },
        ],
      }

      cy.viewport(viewport)
      cy.mount(
        <MessageArchive
          getHistoricMessages={() => {
            return new Promise((resolve) => {
              resolve([
                {
                  ...humanMessageData,
                  id: message1Id,
                  timestamp: '2024-01-02T00:00:00.000Z',
                  format: 'TextFormat',
                  data: {
                    text: 'First message with threads',
                  },
                },
                {
                  ...agentMessageData,
                  id: message2Id,
                  timestamp: '2024-01-02T00:13:00.000Z',
                  format: 'TextFormat',
                  data: {
                    text: 'Second message with thread',
                  },
                },
              ])
            })
          }}
          threadMessages={threadMessages}
          supportedElements={supportedElements}
        />
      )

      const expectedThreadCount = 2
      cy.get('.rustic-thread-reply-count').should(
        'have.length',
        expectedThreadCount
      )
      cy.get('.rustic-thread-reply-count').first().should('contain', '2')
      cy.get('.rustic-thread-reply-count').first().should('contain', 'replies')
      cy.get('.rustic-thread-reply-count').last().should('contain', '1')
      cy.get('.rustic-thread-reply-count').last().should('contain', 'reply')
    })

    it(`calls onThreadOpen when thread reply count is clicked on ${viewport} screen`, () => {
      const onThreadOpen = cy.stub()
      const message1Id = 'message-1'

      const threadMessages = {
        [message1Id]: [
          {
            ...humanMessageData,
            id: getUUID(),
            timestamp: '2024-01-02T00:02:00.000Z',
            format: 'TextFormat',
            data: {
              text: 'Thread reply',
            },
          },
        ],
      }

      cy.viewport(viewport)
      cy.mount(
        <MessageArchive
          getHistoricMessages={() => {
            return new Promise((resolve) => {
              resolve([
                {
                  ...humanMessageData,
                  id: message1Id,
                  timestamp: '2024-01-02T00:00:00.000Z',
                  format: 'TextFormat',
                  data: {
                    text: 'Message with thread',
                  },
                },
              ])
            })
          }}
          threadMessages={threadMessages}
          onThreadOpen={onThreadOpen}
          supportedElements={supportedElements}
        />
      )

      cy.get('.rustic-thread-reply-count').click()
      cy.wrap(onThreadOpen).should('be.calledWith', message1Id)
    })

    it(`highlights active thread message on ${viewport} screen`, () => {
      const message1Id = 'message-1'
      const message2Id = 'message-2'

      const threadMessages = {
        [message1Id]: [
          {
            ...humanMessageData,
            id: getUUID(),
            timestamp: '2024-01-02T00:02:00.000Z',
            format: 'TextFormat',
            data: {
              text: 'Thread reply',
            },
          },
        ],
        [message2Id]: [
          {
            ...humanMessageData,
            id: getUUID(),
            timestamp: '2024-01-02T00:14:00.000Z',
            format: 'TextFormat',
            data: {
              text: 'Thread reply',
            },
          },
        ],
      }

      cy.viewport(viewport)
      cy.mount(
        <MessageArchive
          getHistoricMessages={() => {
            return new Promise((resolve) => {
              resolve([
                {
                  ...humanMessageData,
                  id: message1Id,
                  timestamp: '2024-01-02T00:00:00.000Z',
                  format: 'TextFormat',
                  data: {
                    text: 'First message',
                  },
                },
                {
                  ...agentMessageData,
                  id: message2Id,
                  timestamp: '2024-01-02T00:13:00.000Z',
                  format: 'TextFormat',
                  data: {
                    text: 'Second message',
                  },
                },
              ])
            })
          }}
          threadMessages={threadMessages}
          activeThreadId={message1Id}
          supportedElements={supportedElements}
        />
      )

      const messageCanvas = '[data-cy=message-canvas]'
      cy.get(messageCanvas)
        .first()
        .find('.rustic-message-container')
        .should('have.css', 'background-color')
        .and('not.equal', 'rgb(255, 255, 255)')
    })

    it(`handles thread messages with update messages on ${viewport} screen`, () => {
      const updateId = 'update-message-1'

      const threadMessages = {
        [updateId]: [
          {
            ...humanMessageData,
            id: getUUID(),
            timestamp: '2024-01-02T00:02:00.000Z',
            format: 'TextFormat',
            data: {
              text: 'Thread reply to update message',
            },
          },
        ],
      }

      cy.viewport(viewport)
      cy.mount(
        <MessageArchive
          getHistoricMessages={() => {
            return new Promise((resolve) => {
              resolve([
                {
                  ...agentMessageData,
                  id: getUUID(),
                  timestamp: '2024-01-02T00:00:00.000Z',
                  format: 'updateMarkdownFormat',
                  data: {
                    text: 'First part',
                    updateId: updateId,
                  },
                },
                {
                  ...agentMessageData,
                  id: getUUID(),
                  timestamp: '2024-01-02T00:01:00.000Z',
                  format: 'updateMarkdownFormat',
                  data: {
                    text: ' of message',
                    updateId: updateId,
                  },
                },
              ])
            })
          }}
          threadMessages={threadMessages}
          supportedElements={supportedElements}
        />
      )

      cy.get('.rustic-thread-reply-count').should('have.length', 1)
      cy.get('.rustic-thread-reply-count').should('contain', '1')
      cy.get('.rustic-thread-reply-count').should('contain', 'reply')
    })
  })
})
