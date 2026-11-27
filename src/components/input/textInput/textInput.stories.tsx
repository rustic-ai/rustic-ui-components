import type { Meta } from '@storybook/react-webpack5'
import type React from 'react'
import type { ComponentType } from 'react'

import { textInputDescription } from '../../sharedDescription'
import type { BaseInputProps, WebSocketClient } from '../../types'
import type { Message } from '../../types'
import TextInput from './textInput'

interface InputProps extends BaseInputProps {
  ws: WebSocketClient
}

const meta: Meta<React.FC<InputProps>> = {
  title: 'Rustic UI/Input/Text Input',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 'clamp(250px, 50vw, 500px)' }}>
        <Story />
      </div>
    ),
  ],
}

meta.argTypes = {
  ...meta.argTypes,
  ...textInputDescription,
}

export default meta

export const Default = {
  args: {
    component: TextInput,
    sender: { id: '169snlk9n', name: 'Some User' },
    conversationId: '1',
    placeholder: 'Type your message',
    emojiDataSource:
      'node_modules/emoji-picker-element-data/en/emojibase/data.json',
    ws: {
      send: (message: Message) => {
        alert(
          'Message sent!' +
            '\n' +
            `Text content: ${message.data.messages[0].content[0].text}`
        )
      },
    },
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

export const SpeechToText = {
  args: {
    ...Default.args,
    enableSpeechToText: true,
  },
}

export const NoMultiLine = {
  args: {
    ...Default.args,
    multiline: false,
  },
}

export const CustomizedMaxRows = {
  args: {
    ...Default.args,
    maxRows: 2,
  },
}

export const WithLabel = {
  args: {
    ...Default.args,
    label: 'Custom Label',
  },
}
