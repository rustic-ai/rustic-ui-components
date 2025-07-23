import type { Meta, StoryFn } from '@storybook/react-webpack5'
import axios from 'axios'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import { textInputDescription } from '../../../sharedDescription'
import type { Message } from '../../../types'
import meta from '../../textInput/textInput.stories'
import MultimodalInput from './multimodalInput'

const multiModalInputMeta: Meta<React.ComponentProps<typeof MultimodalInput>> =
  {
    title: 'Rustic UI/Input/Multimodal Input',
    component: MultimodalInput,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
      mockData: [
        {
          url: 'http://localhost:8080/upload?message-id=:messageId',
          method: 'POST',
          status: 200,
          response: {
            fileId: getUUID(),
            url: 'http://localhost:8080/files/test.xlsx',
          },
          delay: 1000,
        },
        {
          url: 'http://localhost:8080/:messageId/files',
          method: 'GET',
          status: 200,
          response: [
            {
              id: 'T7eVTLcNUtKGLC8R3iZAVr',
              name: 'test.xlsx',
              metadata: {
                content_length: 117496,
                uploaded_at: '2024-11-29T20:04:35.480280+00:00',
              },
              url: 'http://localhost:8080/files/test.xlsx',
              mimetype:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              encoding: null,
              on_filesystem: true,
            },
            {
              id: 'T7eVTLcNUtKGLC8R3iZAVd',
              name: 'test(1).xlsx',
              metadata: {
                content_length: 117496,
                uploaded_at: '2024-11-30T20:04:35.480280+00:00',
              },
              url: 'http://localhost:8080/files/test1.xlsx',
              mimetype:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              encoding: null,
              on_filesystem: true,
            },
          ],
          delay: 200,
        },
        {
          url: 'http://localhost:8080/files/:fileName',
          method: 'DELETE',
          status: 200,
          response: { message: 'Delete successfully!' },
          delay: 200,
        },
      ],
    },
    decorators: [
      (Story: StoryFn) => {
        return (
          <div style={{ width: '600px' }}>
            <Story />
          </div>
        )
      },
    ],
  }

multiModalInputMeta.argTypes = {
  ...meta.argTypes,
  ...textInputDescription,
  supportUpload: {
    description:
      'Optional props. If set to `true`, the component will display an upload button and allow file uploads. If set to `false`, the upload button will not be displayed.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  uploadFileEndpoint: {
    description:
      'The API endpoint for sending a POST multipart-form request. Required if supportUpload is true. If the JSON response includes a `fileId` property, it can be used to delete the file later. Path placeholders like `fileName` and `messageId`, will be automatically replaced with the actual file name and message ID.',
    table: {
      type: { summary: 'string' },
    },
  },
  deleteFileEndpoint: {
    description:
      'The API endpoint to send a DELETE request. Required if supportUpload is true. Path placeholders like `fileName`, `fileId` and `messageId`, will be automatically replaced with the corresponding file name, file ID, and message ID.',
    table: {
      type: { summary: 'string' },
    },
  },
  acceptedFileTypes: {
    description:
      'The types of files that are allowed to be selected for upload. Required if supportUpload is true. For safety reasons, only allow file types that can be handled by your server. Avoid accepting executable file types like .exe, .bat, or .msi. For more information, refer to the [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers).',
    table: {
      type: { summary: 'string' },
    },
  },
  maxFileCount: {
    description:
      'Optional props. Maximum number of files that can be uploaded in one message.',
    table: {
      type: { summary: 'number' },
    },
  },
  maxFileSize: {
    description:
      'Optional props. The maximum size for each uploaded file, in bytes.',
    table: {
      type: { summary: 'number' },
    },
  },
  showFullName: {
    description:
      'Optional props. Setting this to `true` will display long file names in full. If set to `false`, long names will be shortened.',
    defaultValue: { summary: true },
    table: {
      type: { summary: 'boolean' },
    },
  },
  getUploadData: {
    description:
      'Optional props. A function that can be used to define additional data to be sent along with the file upload.',
    table: {
      type: { summary: '(fileName: string) => { [key: string]: any }' },
    },
  },
  getUploadHeaders: {
    description:
      'Optional props. A function that can be used to define headers to be sent along with the file upload.',
    table: {
      type: { summary: '() => Promise<{headers: {Authorization: string}}>' },
    },
  },
  uploadOptions: {
    description:
      'Optional props. Defines the available options for file upload, displayed within a popover menu. If no options are provided, an upload icon button will be displayed by default.',
    table: {
      type: {
        summary: 'An array of UploadOption.\n',
        detail:
          'Each UploadOption has the following fields:\n' +
          '  label: The text label displayed for the upload option, shown in the popover menu.\n' +
          '  metadata: Metadata associated with this upload option, provided as key-value pairs. This data is typically sent along with the uploaded file to provide additional context or configuration.\n' +
          '  acceptedFileTypes: Optional props. Specifies the types of files accepted for this upload option, formatted as a comma-separated string. If not provided, acceptedFileTypes for the entire component will be applied. \n' +
          '  iconName: Optional props. The name of the Material Symbol to display alongside this upload option.',
      },
    },
  },
  listFiles: {
    description:
      'Optional props. A function to fetch and format existing file data when a file upload fails due to a conflict error (HTTP status code 409). The returned value will be used to determine a unique file name by appending an incremented number to the base name.',
    table: {
      type: {
        summary: 'Promise<FileData[]>',
        detail:
          'Each FileData has the following fields:\n' +
          '  name: The name of the file.\n' +
          '  url: Optional props. The url of the file.',
      },
    },
  },
}

export default multiModalInputMeta

export const Default = {
  args: {
    supportUpload: true,
    emojiDataSource:
      'node_modules/emoji-picker-element-data/en/emojibase/data.json',
    sender: { id: '17shblx8nxk', name: 'Some User' },
    conversationId: '1',
    placeholder: 'Type your message',
    ws: {
      send: (message: Message) => {
        const messages: string[] = []

        message.data.messages[0].content.forEach((content: any) => {
          if (content.type === 'text') {
            messages.push(`Text content: ${content.text}`)
          } else if (content.type === 'file_url') {
            messages.push(`File: ${content.file_url.name}`)
          }
        })

        alert('Message sent!\n' + messages.join('\n'))
      },
    },
    listFiles: () => {
      return axios.get(`http://localhost:8080/123/files`).then((res) => {
        const fileData = res.data.map((file: any) => {
          return {
            name: file.name,
            url: file.url,
          }
        })
        return fileData
      })
    },
    uploadFileEndpoint: 'http://localhost:8080/upload?message-id=:messageId',
    deleteFileEndpoint: 'http://localhost:8080/files/fileName',
    acceptedFileTypes:
      'image/*,.pdf,.doc,.docx,.xlsx,application/x-iwork-pages-sffpages',
    getUploadHeaders: () =>
      Promise.resolve({
        headers: {
          Authorization: 'Bearer example-token',
        },
      }),
    getMembers: () =>
      Promise.resolve([
        {
          displayName: 'Amy',
          icon: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Amy',
        },
        {
          displayName: 'Anna',
          icon: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Anna',
        },
        {
          displayName: 'Andrew',
        },
      ]),
  },
}

export const PDFAndImageOnly = {
  args: {
    ...Default.args,
    acceptedFileTypes: 'image/*,.pdf',
    getUploadData: () => {
      return { file_meta: '{ "uploadedBy": "testId" }' }
    },
  },
}

export const FileSizeCannotExceedOneMB = {
  args: {
    ...Default.args,
    maxFileSize: 1048576,
  },
}

export const AllowUploadThreeFilesMax = {
  args: {
    ...Default.args,
    maxFileCount: 3,
  },
}

export const SpeechToText = {
  args: {
    ...Default.args,
    enableSpeechToText: true,
  },
}

export const HasMenu = {
  args: {
    ...Default.args,
    acceptedFileTypes: '.xlsx, .xls, .csv',
    getUploadData: () => {
      return { file_meta: '{ "uploadedBy": "testId" }' }
    },
    uploadOptions: [
      {
        label: 'Upload Excel Sheet',
        iconName: 'request_quote',
        metadata: { file_meta: '{"uploadedBy":"id","category":"Finance"}' },
      },
      {
        label: 'Upload Video',
        iconName: 'movie',
        metadata: { file_meta: '{"uploadedBy":"id","category": "Video"}' },
        acceptedFileTypes: '.mp4, .mov, .avi, .mkv, .wmv, .flv, .webm, .m4v',
      },
    ],
  },
}

export const NoUpload = {
  args: {
    ...Default.args,
    supportUpload: false,
  },
}
