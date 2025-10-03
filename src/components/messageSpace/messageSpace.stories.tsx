import Typography from '@mui/material/Typography'
import type { Meta } from '@storybook/react-webpack5'
import type { StoryFn } from '@storybook/react-webpack5'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import {
  FCCalendar,
  Image,
  MarkedMarkdown,
  MarkedStreamingMarkdown,
  type Message,
  Multipart,
  OpenLayersMap,
  Sound,
  StreamingText,
  Table,
  Text,
  UniformsForm,
  Video,
} from '..'
import CodeSnippet from '../codeSnippet/codeSnippet'
import Icon from '../icon/icon'
import CopyText from '../messageCanvas/actions/copy/copyText'
import MessageSpace from './messageSpace'

const meta: Meta<React.ComponentProps<typeof MessageSpace>> = {
  title: 'Rustic UI/Message Space/Message Space',
  component: MessageSpace,
  tags: ['autodocs'],
  decorators: [
    (Story: StoryFn) => {
      return (
        <div
          style={{ height: '500px', display: 'flex', flexDirection: 'column' }}
        >
          <Story />
        </div>
      )
    },
  ],
  parameters: {
    layout: 'centered',
  },
}

export default meta

function getProfileIcon(message: Message) {
  if (message.sender.name?.toLowerCase().includes('agent')) {
    return <Icon name="smart_toy" />
  } else {
    return <Icon name="account_circle" />
  }
}

function getProfileIconAndName(message: Message) {
  return (
    <>
      {getProfileIcon(message)}
      <Typography variant="body1" color="text.secondary">
        {message.sender.name}
      </Typography>
    </>
  )
}

meta.argTypes = {
  receivedMessages: {
    table: {
      type: {
        summary: 'Array of Message.\n',
        detail:
          'Message interface has the following fields:\n' +
          '  id: A string representing the unique identifier of the message.\n' +
          '  timestamp: A string representing the timestamp of the message.\n' +
          '  sender: An object representing the sender of the message. Refer to the `sender` prop.\n' +
          '  conversationId: A string representing the identifier of the conversation to which the message belongs.\n' +
          '  format: A string representing the format of the message.\n' +
          '  data: An object of type MessageData, which can contain any key-value pairs.\n' +
          '  inReplyTo: An optional string representing the identifier of the message to which this message is a reply.\n' +
          '  threadId: An optional string representing the identifier of the thread to which this message belongs.\n' +
          '  priority: An optional string representing the priority of the message.\n' +
          '  taggedParticipants: An optional array of strings representing the participants tagged in the message.\n' +
          '  topic: An optional string representing the identifier of the topic associated with the message.\n' +
          '  messageHistory: An optional array of objects representing the message history.\n' +
          '  processStatus: An optional string representing the process status of the message. \n' +
          '                 Possible values include "running", "completed", "error"\n',
      },
    },
  },
  ws: {
    description:
      'WebSocket connection to send and receive messages to and from a backend. The onReceive prop will override the default handler once it is set. If you need to use the WebSocket for purposes other than chat, you will need to create a separate WebSocket connection.',
    table: {
      type: {
        summary: 'WebSocketClient',
        detail:
          'A websocket client with supports the following methods:\n' +
          'send: (msg: Message) => void\n' +
          'close: () => void\n' +
          'reconnect: () => void\n' +
          'onReceive?: (handler: (message: Message) => void) => void',
      },
    },
  },
  sender: {
    table: {
      type: {
        summary: 'Sender',
        detail:
          'id: String representing sender id.\n' +
          'name: Optional string of sender name.',
      },
    },
  },
}
const conversationId = '1'

const agentMessageData = {
  sender: { name: 'Some Agent', id: '187w981' },
  conversationId,
}

const humanMessageData = {
  sender: { name: 'Some User', id: '16817ywb' },
  conversationId,
}

const code = `function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('JavaScript');`
const tableData = [
  {
    food: 'chocolate milk',
    calories: 219,
    carbs: 27.31,
    protein: 8.37,
    fat: 8.95,
  },
  {
    food: 'whole milk',
    calories: 165,
    carbs: 11.99,
    protein: 8.46,
    fat: 9.44,
  },
  {
    food: '2% skimmed milk',
    calories: 129,
    carbs: 12.38,
    protein: 8.51,
    fat: 5.1,
  },
  {
    food: '1% skimmed milk',
    calories: 108,
    carbs: 12.87,
    protein: 8.69,
    fat: 2.5,
  },
  {
    food: 'skim milk',
    calories: 88,
    carbs: 12.84,
    protein: 8.72,
    fat: 0.21,
  },
]

const streamingMarkdownRootMessageId = getUUID()
export const Default = {
  args: {
    ws: { send: () => {} },
    sender: humanMessageData.sender,
    receivedMessages: [
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:00:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the markdown component?',
        },
      },
      {
        ...agentMessageData,
        id: streamingMarkdownRootMessageId,
        timestamp: '2024-01-02T00:01:00.000Z',
        format: 'streamingMarkdown',
        data: {
          text: '# Title\n\n---\n\n ## Subtitle',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:02:01.000Z',
        format: 'updateStreamingMarkdown',
        threadId: streamingMarkdownRootMessageId,
        data: {
          text: '\n\nThis is a paragraph. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n- This is an **inline notation**\n- This is a *inline notation*.\n- This is a _inline notation_.\n- This is a __inline notation__.\n- This is a ~~inline notation~~.\n\n```\nconst string = "Hello World"\nconst number = 123\n```\n\n> This is a blockquote.\n\n1. Item 1\n2. Item 2\n3. Item 3\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Item 1   | Item 2   | Item 3   |',
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:04:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the calendar component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:05:00.000Z',
        format: 'calendar',
        data: {
          events: [
            {
              id: '1',
              start: '2024-02-07T10:00:00',
              end: '2024-02-07T12:00:00',
              title: 'Aquarium',
            },
            {
              id: '2',
              start: '2024-02-07T12:00:00',
              end: '2024-02-07T14:00:00',
              title: 'Lunch',
            },
            {
              id: '3',
              start: '2024-02-08T09:00:00',
              title: 'Niagra Falls',
            },
            {
              id: '4',
              start: '2024-02-09T14:00:00',
              end: '2024-02-09T16:00:00',
              title: 'Casa Loma',
            },
            {
              id: '5',
              start: '2024-02-09T10:30:00',
              end: '2024-02-09T12:30:00',
              title: 'Royal Ontario Museum',
            },
          ],
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:06:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the table component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:07:00.000Z',
        format: 'table',
        data: {
          title: 'Nutrient Data Comparison Across Various Types of Milk',
          description:
            'This table illustrates the variations in calories and nutrients for different types of milk, with measurements based on a serving size of 250 ml. Caloric values are expressed in kCal, and nutrient quantities are measured in grams. The data is sourced from the Canadian Nutrient File.',
          data: tableData,
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:10:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the image component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:11:00.000Z',
        format: 'image',
        data: {
          src: 'images/image-component-example.png',
          alt: 'A curved facade covered in white latticework',
          description:
            'Lorem ipsum dolor sit amet consectetur. Aliquam vulputate sit non non tincidunt pellentesque varius euismod est. Lobortis feugiat euismod lorem viverra. Ipsum justo pellentesque.',
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:12:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the map component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:13:00.000Z',
        format: 'map',
        data: {
          longitude: -123.1115,
          latitude: 49.2856,
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:14:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the code snippet component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:15:00.000Z',
        format: 'codeSnippet',
        data: {
          code: code,
          language: 'javascript',
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:16:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the sound component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:17:00.000Z',
        format: 'sound',
        data: {
          src: 'audioExamples/audioStorybook.mp3',
          title: 'Sound Title',
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:18:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the video component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:19:00.000Z',
        format: 'video',
        data: {
          src: 'videoExamples/videoStorybook.mp4',
          title: 'Video Title',
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:20:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the multipart component?',
        },
      },
      {
        ...agentMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:21:00.000Z',
        format: 'multipart',
        data: {
          text: 'Here is an example of the multipart component:',
          files: [{ name: 'imageExample.png' }, { name: 'pdfExample.pdf' }],
        },
      },
      {
        ...agentMessageData,
        id: 'formId',
        timestamp: '2024-01-02T00:21:00.000Z',
        format: 'form',
        data: {
          title: 'Choose the days',
          schema: {
            title: 'Address',
            type: 'object',
            properties: {
              city: { type: 'string' },
              state: { type: 'string' },
              street: { type: 'string' },
              zip: { type: 'string', pattern: '[0-9]{5}' },
            },
            required: ['street', 'zip', 'state'],
          },
        },
      },
      {
        ...humanMessageData,
        id: getUUID(),
        timestamp: '2024-01-02T00:21:00.000Z',
        format: 'formResponse',
        data: {
          inReplyTo: 'formId',
          data: {
            city: 'Vancouver',
            state: 'BC',
            street: '1575 W Georgia St',
            zip: 'V6G 2V3',
          },
        },
      },
    ],
    supportedElements: {
      text: Text,
      streamingText: StreamingText,
      markdown: MarkedMarkdown,
      streamingMarkdown: MarkedStreamingMarkdown,
      image: Image,
      map: OpenLayersMap,
      table: Table,
      calendar: FCCalendar,
      codeSnippet: CodeSnippet,
      sound: Sound,
      video: Video,
      multipart: Multipart,
      form: UniformsForm,
    },
    getProfileComponent: getProfileIconAndName,
    getActionsComponent: (message: Message) => {
      const copyButton = message.format === 'text' && (
        <CopyText message={message} />
      )
      if (copyButton) {
        return <>{copyButton}</>
      }
    },
  },
}

export const WithDisabledAutoScroll = {
  args: {
    ...Default.args,
    disableAutoScroll: true,
  },
}
