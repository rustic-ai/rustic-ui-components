
import { supportedViewports } from '../../../../cypress/support/variables'
import { setPdfWorkerSrc } from '../../pdfViewer/pdfViewer'
import Multipart from './multipart'

setPdfWorkerSrc('/files/pdf.worker.mjs')

describe('Multipart Component', () => {
  const props = {
    text: 'This is a test message',
    files: [{ name: 'image.jpg' }, { name: 'document.pdf' }],
  }
  const fileName = '[data-cy=file-name]'
  const filePreview = `[data-cy=file-preview]`
  supportedViewports.forEach((viewport) => {
    it(`renders text and file previews correctly on ${viewport} screen`, () => {
      const maximumFileNameLength = 15
      cy.mount(<Multipart {...props} />)

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
      cy.mount(<Multipart files={props.files} />)

      cy.contains(props.text).should('not.exist')
      cy.get(filePreview).should('have.length', props.files.length)
    })

    it(`renders download button for files with url on ${viewport} screen`, () => {
      cy.mount(
        <Multipart
          files={[
            { name: 'image.png', url: 'images/image-component-example.png' },
          ]}
        />
      )

      cy.get('[data-cy=download-button]').should('be.visible')
    })
    it(`can open and close the pdfViewer for pdf file on ${viewport} screen`, () => {
      cy.mount(
        <Multipart
          files={[{ name: 'pdfExample.pdf', url: '/files/pdfExample.pdf' }]}
        />
      )

      cy.get(fileName).click()
      cy.get('[data-cy=pdf-canvas]').should('be.visible')
      cy.get('[data-cy=viewer-close-button]').click()
      cy.get('[data-cy=pdf-canvas]').should('not.exist')
    })
  })
})
