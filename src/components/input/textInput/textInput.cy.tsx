/* eslint-disable cypress/no-unnecessary-waiting */
import {
  supportedViewports,
  testUser,
} from '../../../../cypress/support/variables'
import TextInput from './textInput'

describe('TextInput', () => {
  //using base-input for now because data-cy cannot be added in the TextInput
  const textInput = '[data-cy=base-input]'
  const sendButton = '[data-cy=send-button]'
  const message = 'Hello, Cypress!'
  const spaces = '     '
  const recordButton = '[data-cy=record-button]'
  const emojiButton = '[data-cy=emoji-button]'
  const emojiPicker = '[data-cy=emoji-picker]'
  const suggestionMenu = '[data-cy=suggestion-menu]'
  const emojiTestWaitTime = 20
  context('Regular', () => {
    beforeEach(() => {
      const sendStub = cy.stub().as('sendMessage')
      const mockWsClient = {
        send: sendStub,
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.mount(
        <TextInput
          emojiDataSource="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/it/cldr/data.json"
          sender={testUser}
          conversationId="1"
          ws={mockWsClient}
          label="Type your message"
        />
      )
    })

    supportedViewports.forEach((viewport) => {
      it(`should render the TextInput component on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textInput).should('exist')
        cy.get(sendButton).should('exist')
      })

      it(`should have the send button enabled when the text input is not empty on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textInput).type(message)
        cy.get('textarea').invoke('val').should('equal', message)
        cy.get(sendButton).should('be.enabled')
      })

      it(`should have the send button disabled when the text input is empty on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textInput).invoke('val').should('equal', '')
        cy.get(sendButton).should('be.disabled')
      })

      it(`should have the button disabled when the text input only contains spaces on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textInput).type(spaces)
        cy.get('textarea').invoke('val').should('equal', spaces)
        cy.get(sendButton).should('be.disabled')
      })

      it(`should not send the message when the text input only contains spaces and pressing enter on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textInput).type(spaces)
        cy.get('textarea').invoke('val').should('equal', spaces)
        cy.get(textInput).type('{enter}')
        cy.get('textarea').invoke('val').should('equal', spaces)
      })

      it(`should have the button disabled when the text input only contains linebreaks (shift+enter) on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textInput).type('{shift}{enter}')
        cy.get('textarea').invoke('val').should('equal', '\n')
        cy.get(sendButton).should('be.disabled')
      })

      it(`should send the message when pressing enter on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textInput).type(message)
        cy.get('textarea').invoke('val').should('equal', message)
        cy.get(textInput).type('{enter}')
        cy.get('textarea').first().invoke('val').should('equal', '')
      })

      it(`should add emoji to text input through emoji picker on ${viewport} screen`, () => {
        cy.viewport(viewport)

        cy.get(emojiButton).click()
        cy.get(emojiPicker).should('exist')

        cy.get('emoji-picker').shadow().find('button#emo-🤣').click()
        cy.get('textarea').invoke('val').should('equal', '🤣')
      })

      it(`should show relevant emojis when user types shortcode and emoji can be added to the text input on ${viewport} screen`, () => {
        cy.wait(emojiTestWaitTime)
        cy.viewport(viewport)
        cy.get(textInput).should('be.visible').type(':ap')

        cy.get(suggestionMenu).should('exist')
        cy.get(`${suggestionMenu} li`)
          .first()
          .should(
            'contain.text',
            '😃 faccina con un gran sorriso e occhi spalancati'
          )
          .click()
        cy.get('textarea').invoke('val').should('equal', '😃')
      })

      it(`should convert text in ':text:' format to emoji on ${viewport} screen`, () => {
        cy.wait(emojiTestWaitTime)
        cy.viewport(viewport)

        cy.get(textInput).type(':polpo:')
        cy.get('textarea').invoke('val').should('equal', '🐙')
      })
      it(`should send message with correct content on ${viewport} screen`, () => {
        cy.viewport(viewport)

        const testMessage = 'Hello, World!'
        cy.get(textInput).type(testMessage)
        cy.get(sendButton).click()

        cy.get('@sendMessage').then((stub) => {
          const sendStub = stub as unknown as sinon.SinonStub
          const sentMessage = sendStub.args[0][0]
          expect(sentMessage).to.deep.include({
            sender: testUser,
            conversationId: '1',
            format: 'chatCompletionRequest',
            data: {
              messages: [
                {
                  content: [
                    {
                      type: 'text',
                      text: testMessage,
                    },
                  ],
                  role: 'user',
                  name: '12345678',
                },
              ],
            },
          })

          expect(sentMessage.id).to.be.a('string')
          expect(sentMessage.timestamp).to.be.a('string')
        })
      })
    })
  })

  context('Speech-to-text', () => {
    beforeEach(() => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.window().then((win) => {
        cy.stub(win, 'webkitSpeechRecognition').returns({
          lang: 'en-US',
          start: cy.stub().as('startStub'),
          stop: cy.stub().as('stopStub'),
          onerror: cy.stub().as('errorStub'),
        })
      })

      cy.mount(
        <TextInput
          sender={testUser}
          conversationId="1"
          ws={mockWsClient}
          label="Type your message"
          enableSpeechToText={true}
        />
      )
    })

    supportedViewports.forEach((viewport) => {
      it(`should start and stop speech recognition on ${viewport} screen`, () => {
        cy.viewport(viewport)
        // verify speech recognition has not started initially
        cy.get(recordButton).click()

        // verify speech recognition started
        cy.get('@startStub').should('be.called')

        cy.get(recordButton).click()
        cy.get('@stopStub').should('be.called')
        cy.get('[data-cy=spinner]').should('exist')
        cy.window().then((win) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recognition: any = new win.webkitSpeechRecognition()
          recognition.onend()
        })
        cy.get('[data-cy=spinner]').should('not.exist')
      })
      it(`should add recorded results to text input on ${viewport} screen`, () => {
        cy.viewport(viewport)

        cy.get(recordButton).click()

        const mockEvent = {
          results: [[{ transcript: message }]],
        }

        cy.window().then((win) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recognition: any = new win.webkitSpeechRecognition()
          recognition.onresult(mockEvent)
        })

        cy.get(`${textInput} textarea`).should('have.value', message)
      })
    })
  })
})
