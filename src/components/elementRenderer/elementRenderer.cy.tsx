import React from 'react'
import { v4 as getUUID } from 'uuid'

import {
  supportedViewports,
  testUser,
} from '../../../cypress/support/variables'
import Text from '../text/text'
import { UpdateType } from '../types'
import ElementRenderer from './elementRenderer'

const supportedElements = {
  TextFormat: Text,
}

const sampleMessage = {
  id: '1',
  timestamp: '2020-01-02T00:00:00.000Z',
  sender: testUser,
  conversationId: 'lkd9vc',
  topic: 'default',
}

const commonProps = {
  sender: testUser,
  supportedElements: supportedElements,
}

describe('ElementRenderer', () => {
  supportedViewports.forEach((viewport) => {
    it(`renders the correct element for a supported format on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.viewport(viewport)
      cy.mount(
        <ElementRenderer
          messages={[
            {
              ...sampleMessage,
              data: { text: 'Test Text' },
              format: 'TextFormat',
            },
          ]}
          {...commonProps}
          ws={mockWsClient}
        />
      )
      cy.get('p').should('contain.text', 'Test Text')
    })

    it(`renders the original message and its update messages correctly on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      const updateFields = {
        updateId: 'someRandomId',
        updateType: UpdateType.Append,
      }

      cy.viewport(viewport)
      cy.mount(
        <ElementRenderer
          messages={[
            {
              ...sampleMessage,
              data: { text: 'This', updateId: updateFields.updateId },
              format: 'updateTextFormat',
            },
            {
              id: getUUID(),
              timestamp: '2020-01-02T00:00:00.000Z',
              sender: testUser,
              conversationId: 'lkd9vc',
              topic: 'default',
              data: { text: ' is', ...updateFields },
              format: 'updateTextFormat',
            },
            {
              id: getUUID(),
              timestamp: '2020-01-02T00:00:00.000Z',
              sender: testUser,
              conversationId: 'lkd9vc',
              topic: 'default',
              data: { text: ' streaming', ...updateFields },
              format: 'updateTextFormat',
            },
            {
              id: getUUID(),
              timestamp: '2020-01-02T00:00:00.000Z',
              sender: testUser,
              conversationId: 'lkd9vc',
              topic: 'default',
              data: { text: ' text.', ...updateFields },
              format: 'updateTextFormat',
            },
          ]}
          {...commonProps}
          ws={mockWsClient}
        />
      )
      cy.get('p').should('contain.text', 'This is streaming text.')
    })

    it(`renders a message for an unsupported format on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.viewport(viewport)
      cy.mount(
        <ElementRenderer
          messages={[
            {
              ...sampleMessage,
              data: { text: 'Test Text' },
              format: 'unsupported',
            },
          ]}
          {...commonProps}
          ws={mockWsClient}
        />
      )

      cy.contains('Unsupported element format: unsupported').should('exist')
    })
  })
})
