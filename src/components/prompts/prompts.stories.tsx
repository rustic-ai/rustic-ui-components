import './promptsDemo.css'

import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type { Meta } from '@storybook/react-webpack5'
import type React from 'react'
import { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import MessageSpace from '../messageSpace/messageSpace'
import ChatCompletion from '../multipart/chatCompletion'
import type { Message } from '../types'
import Prompts from './prompts'

const meta: Meta<React.ComponentProps<typeof Prompts>> = {
  title: 'Rustic UI/Prompts/Prompts',
  component: Prompts,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    position: {
      table: {
        disable: true,
      },
    },
  },
}

export default meta

const user = { name: 'Some User', id: 'gahjqj19' }

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'The example below assigns different classNames for `inConversation` and `hoverOverInput` prompts. Below are the extra stylings added to the prompts:\n\n' +
          '```css\n' +
          '.rustic-demo-in-conversation {\n' +
          '  gap: 16px;\n' +
          '  margin: 16px auto;\n' +
          '  display: grid;\n' +
          '  grid-template-columns: 1fr 1fr;\n' +
          '  justify-content: center;\n' +
          '  width: fit-content;\n' +
          '}\n\n' +
          '.rustic-demo-in-conversation .rustic-prompt {\n' +
          '  padding: 16px;\n' +
          '  height: 100%;\n' +
          '  text-align: center;\n' +
          '  max-width: 312px;\n' +
          '  border-radius: 16px;\n' +
          '  box-shadow: none;\n' +
          '  border: 1px solid #e1d9d5;\n' +
          '}\n\n' +
          '.rustic-demo-in-conversation .rustic-prompt:hover {\n' +
          '  background-color: #ff692814;\n' +
          '}\n\n' +
          '.rustic-demo-hover-over-input {\n' +
          '  display: flex;\n' +
          '  flex-wrap: wrap;\n' +
          '  gap: 16px;\n' +
          '  margin: 16px auto;\n' +
          '  justify-content: center;\n' +
          '}\n' +
          '```',
      },
    },
  },
  decorators: [
    () => {
      const [messages, setMessages] = useState<Message[]>([
        {
          conversationId: '1',
          timestamp: new Date().toISOString(),
          id: getUUID(),
          sender: {
            name: '123',
            id: '123',
          },
          data: {
            prompts: [
              'What are the key steps to starting a new project?',
              'Generate a short poem about a rainy day.',
              'Having trouble with your device? Let me know the issue.',
              'How can I optimize my budget?',
            ],
            position: 'inConversation',
            className: 'rustic-demo-in-conversation',
          },
          format: 'prompts',
        },
        {
          conversationId: '1',
          timestamp: new Date().toISOString(),
          id: getUUID(),
          sender: {
            name: '123',
            id: '123',
          },
          data: {
            prompts: [
              'What can you help me with?',
              'Summarize a document for me',
              'How do you handle security?',
            ],
            className: 'rustic-demo-hover-over-input',
          },
          format: 'prompts',
        },
      ])

      return (
        <div
          style={{
            width: 'clamp(250px, 70vw, 1000px)',
            height: '700px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6">Conversation 1</Typography>
          <Divider />
          <MessageSpace
            ws={{
              send: (selection: Message) => {
                setMessages((prev) => [...prev, selection])
              },
              close: () => {},
              reconnect: () => {},
            }}
            sender={user}
            receivedMessages={messages}
            getProfileComponent={(msg) => (
              <Typography variant="caption">{msg.sender.name}</Typography>
            )}
            supportedElements={{
              chatCompletionRequest: ChatCompletion,
              prompts: Prompts,
            }}
          />
        </div>
      )
    },
  ],
}
