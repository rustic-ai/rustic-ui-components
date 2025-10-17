import type { InputType } from 'storybook/internal/types'

export const conversationIdDescription: InputType = {
  description:
    'Id of the current conversation. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`.',
  type: { name: 'string', required: true },
}

export const senderDescription: InputType = {
  description:
    'Current user. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`.',
  type: {
    name: 'object',
    value: {
      id: { name: 'string', required: true },
      name: { name: 'string', required: false },
    },
    required: true,
  },
  table: {
    type: {
      summary: 'Sender',
      detail:
        'id: String representing sender id.\n' +
        'name: Optional string of sender name.',
    },
  },
}

export const optionalWsDescription: InputType = {
  description:
    'WebSocket connection to send response messages to a backend. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. If not provided, the component will not be interactive.',
  type: {
    name: 'object',
    value: {
      send: { name: 'function', required: true },
      close: { name: 'function', required: true },
      reconnect: { name: 'function', required: true },
      onReceive: { name: 'function', required: false },
    },
  },
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
}

export const wsDescription: InputType = {
  ...optionalWsDescription,
  description:
    'WebSocket connection to send and receive messages to and from a backend. The onReceive prop will override the default handler once it is set. If you need to use the WebSocket for purposes other than chat, you will need to create a separate WebSocket connection.',
  required: true,
}

export const participantDetail =
  'Each Participant has the following fields:\n' +
  ' id: String representing the unique identifier for a participant\n' +
  ' displayName: Name that is displayed for the participant\n' +
  ' participantType: Type of the participant. Could be `human` or `agent`. \n' +
  ' participantRole: Optional property. It specifies the role assigned to a participant. Could either be `owner` or `member`. The default value is `member`. \n' +
  " icon: Optional property. A URL for the participant's icon. \n"

export const getMembersDescription: InputType = {
  description:
    'Function to fetch the list of participants. The list of participants will be used in the mention feature. Should return a promise that resolves to an array of participants.',
  table: {
    type: {
      summary: '() => Promise<Participant[]>',
      detail: participantDetail,
    },
  },
}

export const textInputDescription: InputType = {
  ws: wsDescription,
  getMembers: getMembersDescription,
  emojiDataSource: {
    description:
      'URL to fetch the emoji data from. You need to host the emoji data by yourself. If not provided, the default url will be used.',
    table: {
      type: { summary: 'string' },
      defaultValue: {
        summary:
          'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json',
      },
    },
  },
  sender: {
    description: 'The sender of the message.',
    type: { name: 'object', required: true, value: {} },
    table: {
      type: {
        summary: 'Sender',
        detail:
          'id: String representing sender id.\n' +
          'name: Optional string of sender name.',
      },
    },
  },
  conversationId: conversationIdDescription,
  label: {
    description:
      'Optional label text to be displayed in the input, which will then move to the top when the input is focused on. If both label and placeholder are provided, the placeholder will only be visible once the input is focused on.',
    table: {
      type: { summary: 'string' },
    },
  },
  placeholder: {
    description:
      'Optional Placeholder text to be displayed in the input before user starts typing.',
    table: {
      type: { summary: 'string' },
    },
  },
  multiline: {
    description:
      'Optional boolean that dictates whether `TextInput` can expand to be multiline.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  maxRows: {
    description: 'Optional maximum number of rows to be displayed.',
    table: {
      type: { summary: 'number' },
    },
  },
  fullWidth: {
    description:
      'Optional boolean that dictates whether `TextInput` takes up 100% width of the parent container.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  enableSpeechToText: {
    description:
      'Optional boolean to enable speech-to-text. See which browsers are supported [here](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility).',
    table: {
      type: { summary: 'boolean' },
    },
  },
  maximumEmojiSearchResults: {
    description:
      'Specifies the maximum number of emoji search results to display when the user enters a search query. The search query is triggered when the user types in a format like `:text`.',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '5' },
    },
  },
  threads: {
    description:
      'Optional array of thread IDs to associate with the message. If provided, the message will be linked to the specified threads.',
    table: {
      type: { summary: 'string[]' },
    },
  },
}
