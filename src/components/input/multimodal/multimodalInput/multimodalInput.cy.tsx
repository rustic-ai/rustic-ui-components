import 'cypress-real-events'
import 'cypress-intercept-formdata'

import axios from 'axios'

import {
  supportedViewports,
  testUser,
} from '../../../../../cypress/support/variables'
import { type Participant, ParticipantType } from '../../../types'
import MultimodalInput from './multimodalInput'

describe('Input', () => {
  const suggestionMenu = '[data-cy=suggestion-menu]'
  const textField = '[data-cy=text-field]'
  const sendButton = '[data-cy=send-button]'
  const uploadButton = '[data-cy=upload-button]'
  const fileName = '[data-cy=file-name]'
  const deleteButton = '[data-cy=delete-button]'
  const errorMessage = '[data-cy=error-message]'

  const message = 'Hello, Cypress!'
  const spaces = '   '
  const imageFile = 'public/images/image-component-example.png'
  const pdfFile = 'public/files/pdfExample.pdf'
  const videoFile = 'public/videoExamples/videoCaptions.mp4'

  beforeEach(() => {
    const sendStub = cy.stub().as('sendMessage')
    const mockWsClient = {
      send: sendStub,
      close: cy.stub(),
      reconnect: cy.stub(),
    }

    cy.mount(
      <MultimodalInput
        supportUpload={true}
        sender={testUser}
        conversationId="1"
        ws={mockWsClient}
        label="Type you message"
        uploadFileEndpoint={'/upload?message-id=messageId'}
        deleteFileEndpoint={'/delete/fileName'}
        acceptedFileTypes={''}
        maxFileCount={5}
        showFullName={false}
        getUploadData={() => {
          return { userId: testUser.id }
        }}
        uploadOptions={[
          {
            label: 'Upload Excel Sheet',
            iconName: 'request_quote',
            metadata: { file_meta: '{"uploadedBy":"id","category":"Finance"}' },
          },
          {
            label: 'Upload Video',
            iconName: 'movie',
            metadata: { file_meta: '{"uploadedBy":"id","category": "Video"}' },
            acceptedFileTypes:
              '.mp4, .mov, .avi, .mkv, .wmv, .flv, .webm, .m4v',
          },
        ]}
        getMembers={() =>
          Promise.resolve([
            {
              displayName: 'Member1',
              icon: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Amy',
              participantType: ParticipantType.Human,
            },
            {
              displayName: 'Member2',
              icon: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Anna',
              participantType: ParticipantType.Agent,
            },
          ] as Participant[])
        }
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should render the TextInput component on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).should('exist')
      cy.get(sendButton).should('exist')
      cy.get(uploadButton).should('exist')
    })

    it(`should have the send button enabled when the text input is not empty on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(message)
      cy.get(textField).get('textarea').invoke('val').should('equal', message)
      cy.get(sendButton).should('be.enabled')
    })

    it(`should have the send button disabled when the text input is empty and no file is added on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).find('textarea').invoke('val').should('equal', '')
      cy.get(fileName).should('not.exist')
      cy.get(sendButton).should('be.disabled')
    })

    it(`should have the button disabled when the text input only contains spaces on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(spaces)
      cy.get(textField).get('textarea').invoke('val').should('equal', spaces)
      cy.get(sendButton).should('be.disabled')
    })

    it(`should not send the message when the text input only contains spaces and pressing enter on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(spaces)
      cy.get(textField).find('textarea').invoke('val').should('equal', spaces)

      cy.get(textField).type('{enter}')
      cy.get(textField).find('textarea').invoke('val').should('equal', spaces)
    })

    it(`should have the button disabled when the text input only contains linebreaks (shift+enter) on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type('{shift}{enter}')
      cy.get(textField).find('textarea').invoke('val').should('equal', '\n')
      cy.get(sendButton).should('be.disabled')
    })

    it(`should send the message when pressing enter on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(message)
      cy.get(textField).get('textarea').invoke('val').should('equal', message)
      cy.get(textField).type('{enter}')
      cy.get(textField)
        .get('textarea')
        .first()
        .invoke('val')
        .should('equal', '')
    })

    it(`should send message with correct content on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.intercept(
        {
          method: 'POST',
          url: '/upload?message-id=*',
        },
        {
          statusCode: 200,
          body: {
            url: 'http://test-url.com/image-component-example.png',
            name: 'image-component-example.png',
          },
        }
      ).as('upload')
      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.wait('@upload')
      const testMessage = 'Hello, World!'
      cy.get(textField).type(testMessage)
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
                  {
                    type: 'file_url',
                    file_url: {
                      url: 'http://test-url.com/image-component-example.png',
                      name: 'image-component-example.png',
                    },
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

    it(`can add and delete files on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.intercept(
        {
          method: 'POST',
          url: '/upload?message-id=*',
        },
        { url: '' }
      ).as('upload')
      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })

      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('contain', 'videoCaption...')
      cy.intercept(
        {
          method: 'DELETE',
          url: '/delete/*',
        },
        {}
      ).as('delete')
      cy.get(deleteButton).first().realClick()
      cy.get(fileName).should('not.contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('contain', 'videoCaption...')
    })

    it(`allows adding extra data when uploading files on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.intercept(
        {
          method: 'POST',
          url: '/upload?message-id=*',
        },
        { url: '' }
      ).as('upload')
      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.wait('@upload').interceptFormData((formData) => {
        expect(formData['userId']).to.eq(testUser.id)
      })
    })
    it(`allows adding the same file after deleting it on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.intercept(
        {
          method: 'POST',
          url: '/upload?message-id=*',
        },
        { url: '' }
      ).as('upload')
      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.intercept(
        {
          method: 'DELETE',
          url: '/delete/*',
        },
        {}
      ).as('delete')
      cy.get(deleteButton).click()
      cy.get(fileName).should('not.exist')

      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
    })

    it(`can only allow people to upload the specified maximum file count if maxFileCount props is available on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          supportUpload={true}
          sender={testUser}
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          showFullName={false}
          label="Type you message"
          maxFileCount={2}
          acceptedFileTypes={''}
          uploadFileEndpoint={'/upload'}
          deleteFileEndpoint={'/delete'}
        />
      )
      cy.intercept(
        {
          method: 'POST',
          url: '/upload',
        },
        { url: '' }
      ).as('upload')

      //try to add 3 files when the max file count is 2
      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })

      cy.wait('@upload').then(() => {
        cy.get(fileName).should('contain', 'image-compon...')
        cy.get(fileName).should('contain', 'pdfExample.pdf')
        cy.get(fileName).should('not.contain', 'videoCaption...')
        cy.get(errorMessage).should('contain', 'You can only upload 2 files')

        cy.intercept(
          {
            method: 'DELETE',
            url: '/delete',
          },
          {}
        ).as('delete')
        //remove 1 file
        cy.get(deleteButton).last().realClick()

        cy.get(fileName).should('contain', 'image-compon...')
        cy.get(fileName).should('not.contain', 'pdfExample.pdf')
        cy.get(errorMessage).should(
          'not.contain',
          'You can only upload 2 files'
        )

        //add a new file
        cy.get('input[type=file]').selectFile([videoFile], {
          force: true,
        })
        cy.get(fileName).should('contain', 'image-compon...')
        cy.get(fileName).should('contain', 'videoCaption...')
      })
    })

    it(`should only accept certain file types if acceptedFileTypes props is available on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          supportUpload={true}
          sender={testUser}
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          uploadFileEndpoint={'/upload/'}
          deleteFileEndpoint={'/delete/'}
          acceptedFileTypes="image/*"
        />
      )
      cy.get('input[type=file]').should('have.attr', 'accept', 'image/*')
    })

    it(`should not allow adding files which exceeds the maximum file size on ${viewport} screen`, () => {
      const oneKb = 1024
      const fiveHundred = 500
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          supportUpload={true}
          sender={testUser}
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          showFullName={false}
          label="Type you message"
          uploadFileEndpoint={'/upload/'}
          deleteFileEndpoint={'/delete/'}
          maxFileSize={fiveHundred * oneKb}
          acceptedFileTypes={''}
          maxFileCount={5}
        />
      )

      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('not.contain', 'videoCaption...')
      cy.get(errorMessage).should(
        'contain',
        'Failed to upload videoCaptions.mp4. You cannot upload files larger than 500 KB.'
      )
    })

    it(`shows an error message if the file is failed to upload on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          supportUpload={true}
          sender={testUser}
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          showFullName={false}
          label="Type you message"
          uploadFileEndpoint={'/upload'}
          deleteFileEndpoint={'/delete'}
          acceptedFileTypes={''}
        />
      )

      cy.intercept(
        {
          method: 'POST',
          url: '/upload',
        },
        {
          statusCode: 500,
          body: { message: 'Please try again later' },
        }
      ).as('upload')
      cy.get('input[type=file]').selectFile(imageFile, {
        force: true,
      })
      cy.wait('@upload').then(() => {
        cy.get(errorMessage).should(
          'contain',
          'Failed to upload image-component-example.png. Please try again later'
        )
        cy.get(fileName).should('not.exist')
      })
    })

    it(`should handle 409 conflict error by fetching file list and updating the file name on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          supportUpload
          sender={testUser}
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type your message"
          uploadFileEndpoint={'/upload'}
          deleteFileEndpoint={'/delete'}
          acceptedFileTypes={''}
          listFiles={() => {
            return axios.get('/1/files').then((res) => {
              const fileData = res.data.map((file: any) => {
                return {
                  name: file.name,
                  url: file.url,
                }
              })
              return fileData
            })
          }}
        />
      )

      // Use a counter to track upload attempts
      let uploadAttempt = 0

      cy.intercept('POST', '/upload', (req) => {
        req.reply((res) => {
          if (uploadAttempt === 0) {
            // First upload: return 409 error
            uploadAttempt++
            res.send({
              statusCode: 409,
              body: { message: 'Cannot upload file with the same name' },
            })
          } else {
            res.send({
              statusCode: 200,
              body: {},
            })
          }
        })
      }).as('upload')

      // Intercept GET request to fetch the file list
      cy.intercept('GET', '/1/files', {
        statusCode: 200,
        body: [
          {
            id: 'T7eVTLcNUtKGLC8R3iZAVr',
            name: 'image-component-example.png',
            metadata: {
              content_length: 117496,
              uploaded_at: '2024-11-29T20:04:35.480280+00:00',
            },
            url: 'image-component-example.png',
            mimetype: 'image/png',
            encoding: null,
            on_filesystem: true,
          },
          {
            id: 'T7eVTLcNUtKGLC8R3iZAVd',
            name: 'image-component-example(1).png',
            metadata: {
              content_length: 117496,
              uploaded_at: '2024-11-30T20:04:35.480280+00:00',
            },
            url: 'image-component-example(1).png',
            mimetype: 'image/png',
            encoding: null,
            on_filesystem: true,
          },
        ],
      }).as('fetchFiles')

      cy.get('input[type=file]').selectFile(imageFile, { force: true })

      cy.wait('@upload')

      cy.wait('@fetchFiles')
      cy.wait('@upload').then(() => {
        cy.contains('image-component-example(2).png')
      })
    })

    it(`displays upload options correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(uploadButton).click()
      cy.contains('Upload Excel Sheet').should('be.visible')
      cy.contains('Upload Video').should('be.visible')
    })

    it('uploads file with correct metadata', () => {
      cy.viewport(viewport)

      cy.intercept(
        {
          method: 'POST',
          url: '/upload?message-id=*',
        },
        { url: '' }
      ).as('upload')
      cy.get(uploadButton).click()
      cy.contains('Upload Video').click()
      cy.get('input[type=file]').selectFile([videoFile], {
        force: true,
      })
      cy.wait('@upload').interceptFormData((formData) => {
        expect(formData['file_meta']).to.eq(
          '{"uploadedBy":"id","category": "Video"}'
        )
      })
    })

    it(`displays available members correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type('@M')
      cy.get(suggestionMenu).should('exist')
      cy.get(`${suggestionMenu} li`)
        .first()
        .should('contain.text', 'Member1')
        .click()
      cy.get('textarea').invoke('val').should('includes', '@Member1')
    })

    it(`should hide upload button if supportUpload is false on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          sender={testUser}
          conversationId="1"
          ws={{ send: cy.stub(), close: cy.stub(), reconnect: cy.stub() }}
          label="Type you message"
        />
      )
      cy.get(textField).should('exist')
      cy.get(uploadButton).should('not.exist')
    })
  })
})
