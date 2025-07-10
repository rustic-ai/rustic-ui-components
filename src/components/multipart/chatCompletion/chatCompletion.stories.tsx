import type { Meta } from '@storybook/react-webpack5'

import ChatCompletion from './chatCompletion'
const meta: Meta<React.ComponentProps<typeof ChatCompletion>> = {
  title: 'Rustic UI/Multipart/ChatCompletion',
  component: ChatCompletion,
  tags: ['autodocs'],
}

meta.argTypes = {
  ...meta.argTypes,
  showFullName: {
    table: { defaultValue: { summary: 'true' } },
  },
  messages: {
    table: {
      type: {
        summary:
          'An array of `{ content: string | Content[]; role: string }`.\n',
        detail:
          '`Content` could be `ContentTextPart`, `ContentImagePart`, `ContentAudioPart`, `ContentFilePart`.\n' +
          'Each `ContentTextPart` has the following fields:\n' +
          '  type: The value should be `text`.\n' +
          '  text: The textual content.\n' +
          'Each `ContentImagePart` has the following fields:\n' +
          '  type: The value should be `image_url`\n' +
          '  image_url: An object containing a mandatory `url` property and an optional `detail` property.\n' +
          'Each `ContentFilePart` has the following fields:\n' +
          '  type: The value should be `file_url`\n' +
          '  file_url: An object containing a mandatory `url` property and an optional `name` property.',
      },
    },
  },
}

export default meta

export const Default = {
  args: {
    getAuthHeaders: () =>
      Promise.resolve({
        headers: {
          Authorization: 'Bearer example-token',
        },
      }),
    messages: [
      {
        content: [
          {
            type: 'text',
            text: 'textual content',
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
    ],
  },
}
