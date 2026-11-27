
import { supportedViewports } from '../../../../cypress/support/variables'
import { setPdfWorkerSrc } from '../../pdfViewer/pdfViewer'
import type { Content } from '../../types'
import ChatCompletion from './chatCompletion'

setPdfWorkerSrc('/files/pdf.worker.mjs')

describe('ChatCompletion Component', () => {
  const props = {
    text: 'This is a test message',
    files: [
      { name: 'image-component-example.png' },
      { name: 'pdfExample.pdf' },
    ],
  }
  const fileName = '[data-cy=file-name]'
  const filePreview = `[data-cy=file-preview]`
  const sampleMessages: { content: string | Content[]; role: string }[] = [
    {
      content: [
        {
          type: 'text',
          text: 'This is a test message',
        },
        {
          type: 'image_url',
          image_url: {
            url: `${window.location.origin}/images/image-component-example.png`,
          },
        },
        {
          type: 'file_url',
          file_url: {
            url: `${window.location.origin}/files/pdfExample.pdf`,
          },
        },
      ],
      role: 'user',
    },
  ]
  supportedViewports.forEach((viewport) => {
    it(`renders text and file previews correctly on ${viewport} screen`, () => {
      const maximumFileNameLength = 15
      cy.mount(<ChatCompletion messages={sampleMessages} showFullName />)

      cy.contains(props.text).should('be.visible')
      cy.get(filePreview).should('have.length', props.files.length)

      props.files.forEach((file, index) => {
        cy.get(`${filePreview}:eq(${index})`).within(() => {
          cy.get(fileName).should(
            'contain',
            file.name.substring(0, maximumFileNameLength)
          )
        })
      })
    })

    it(`renders without text on ${viewport} screen`, () => {
      cy.mount(
        <ChatCompletion
          messages={[
            {
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `${window.location.origin}/images/image-component-example.png`,
                  },
                },
                {
                  type: 'file_url',
                  file_url: {
                    url: `${window.location.origin}/files/pdfExample.pdf`,
                  },
                },
              ],
              role: 'user',
            },
          ]}
        />
      )

      cy.contains(props.text).should('not.exist')
      cy.get(filePreview).should('have.length', props.files.length)
    })
  })
})
