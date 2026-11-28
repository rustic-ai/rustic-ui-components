import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'

import { testUser } from '../../../cypress/support/variables'
import { AutoForm, LongTextField } from '../../vendor/uniforms-mui'
import UniformsForm from './uniformsForm'

const schema = {
  title: 'Order',
  type: 'object',
  properties: {
    street: { type: 'string' },
    quantity: { type: 'integer', minimum: 1, maximum: 9 },
    size: { type: 'string', enum: ['small', 'large'] },
    gift: { type: 'boolean' },
  },
  required: ['street', 'quantity', 'size'],
}

describe('UniformsForm', () => {
  const commonProps = {
    title: 'Place an order',
    schema,
    conversationId: '1',
    sender: testUser,
    messageId: 'form-1',
  }

  it('renders each field type and sends the submitted model', () => {
    const ws = {
      send: cy.stub().as('sendStub'),
      close: cy.stub(),
      reconnect: cy.stub(),
    }
    cy.mount(<UniformsForm {...commonProps} ws={ws} />)

    cy.contains('Place an order').should('be.visible')
    cy.get('input[name="street"]').type('1 Main St')

    // NumField puts min/max/step on the native input through slotProps.htmlInput.
    cy.get('input[name="quantity"]')
      .should('have.attr', 'min', '1')
      .and('have.attr', 'max', '9')
      .and('have.attr', 'step', '1')
      .type('3')

    // SelectField passes name and id to the select's hidden input.
    cy.get('input[name="size"]').should('exist')
    cy.get('#mui-component-select-size, [role="combobox"]').first().click()
    cy.get('[role="option"]').contains('large').click()

    cy.get('input[name="gift"]').check()
    cy.get('input[type="submit"], button[type="submit"]').first().click()

    cy.get('@sendStub').should('be.calledOnce')
    cy.get('@sendStub').should(
      'be.calledWith',
      Cypress.sinon.match({
        format: 'formResponse',
        conversationId: '1',
        sender: testUser,
        data: {
          inReplyTo: 'form-1',
          data: { street: '1 Main St', quantity: 3, size: 'large', gift: true },
        },
      })
    )
  })

  it('shows submitted data and disables the form', () => {
    cy.mount(
      <UniformsForm
        {...commonProps}
        data={{ street: '2 Side St', quantity: 2, size: 'small', gift: false }}
      />
    )
    cy.get('input[name="street"]')
      .should('have.value', '2 Side St')
      .and('be.disabled')
    cy.get('input[name="quantity"]')
      .should('have.value', '2')
      .and('be.disabled')
  })
})

describe('vendored uniforms-mui fields', () => {
  const noValidation = () => null

  it('DateField shrinks its label and sets min/max on the input', () => {
    const bridge = new JSONSchemaBridge({
      schema: {
        type: 'object',
        properties: {
          due: {
            type: 'string',
            format: 'date-time',
            uniforms: {
              min: new Date('2026-01-01T00:00:00Z'),
              max: new Date('2026-12-31T00:00:00Z'),
            },
          },
        },
      },
      validator: noValidation,
    })
    cy.mount(<AutoForm schema={bridge} onSubmit={() => {}} />)

    cy.get('input[name="due"]')
      .should('have.attr', 'type', 'datetime-local')
      .and('have.attr', 'min', '2026-01-01T00:00')
      .and('have.attr', 'max', '2026-12-31T00:00')
    cy.get('label').contains('Due').should('have.attr', 'data-shrink', 'true')
  })

  it('TextField and LongTextField pass readOnly to the native input', () => {
    const bridge = new JSONSchemaBridge({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          notes: { type: 'string', uniforms: { component: LongTextField } },
        },
      },
      validator: noValidation,
    })
    cy.mount(<AutoForm schema={bridge} onSubmit={() => {}} readOnly />)

    cy.get('input[name="name"]').should('have.attr', 'readonly')
    cy.get('textarea[name="notes"]').should('have.attr', 'readonly')
  })
})
