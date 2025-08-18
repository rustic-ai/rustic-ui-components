import type { Meta, StoryFn } from '@storybook/react-webpack5'
import React from 'react'

import { optionalWsDescription, senderDescription } from '../sharedDescription'
import Question from './question'

const meta: Meta<React.ComponentProps<typeof Question>> = {
  title: 'Rustic UI/Question/Question',
  component: Question,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ maxWidth: '400px' }}>
          <Story />
        </div>
      )
    },
  ],
}

meta.argTypes = {
  ws: optionalWsDescription,
  sender: senderDescription,
  data: {
    description:
      'Selected option. If provided, the component will be disabled.',
    table: {
      type: {
        summary: 'string | number',
      },
    },
  },
}

export default meta

const options = ['Yes', 'Maybe', 'No']

const user = { name: 'Some User', id: 'gahjqj19' }

export const Default = {
  args: {
    sender: user,
    conversationId: '1',
    messageId: '1',
    title: 'What do you think?',
    description: 'Choose either of the options below.',
    options,
    ws: {
      send: (msg: any) => {
        alert('Message sent: ' + JSON.stringify(msg))
      },
    },
  },
}

export const ReadOnly = {
  args: {
    sender: user,
    conversationId: '2',
    messageId: '1',
    title: 'What do you think?',
    description: 'Choose either of the options below.',
    data: 'Yes',
    options,
  },
}
