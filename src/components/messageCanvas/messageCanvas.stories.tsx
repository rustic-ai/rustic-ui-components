import Typography from '@mui/material/Typography'
import React from 'react'

import ElementRenderer from '../elementRenderer'
import Icon from '../icon/icon'
import MarkedMarkdown from '../markdown'
import Text from '../text/text'
import type { Message } from '../types'
import CopyText from './actions/copy/copyText'
import TextToSpeech from './actions/textToSpeech/textToSpeech'
import MessageCanvas from './messageCanvas'

export default {
  title: 'Rustic UI/Message Canvas/Message Canvas',
  component: MessageCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

const mockWsClient = {
  send: () => {},
  close: () => {},
  reconnect: () => {},
}

const supportedElements = {
  TextFormat: Text,
  MarkdownFormat: MarkedMarkdown,
}

const commonElementRendererProps = {
  ws: mockWsClient,
  sender: { name: 'You', id: '16usbj' },
  conversationId: '1',
  supportedElements: supportedElements,
}

const baseMessage = {
  id: '1',
  timestamp: '2020-01-02T00:00:00.000Z',
  conversationId: 'lkd9vc',
  topic: 'default',
  format: 'TextFormat',
  data: {
    text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
  },
}

const markdownMessage = {
  id: '1',
  timestamp: '2020-01-02T00:00:00.000Z',
  conversationId: 'lkd9vc',
  topic: 'default',
  format: 'MarkdownFormat',
  sender: { name: 'Scheduling agent', id: 'bh1hbjkidjn' },
  data: {
    title: 'The Rise of AI in Content Creation: Friend or Foe?',
    description: 'AI-Powered Writing Tools: A Game Changer?',
    text: `
# Introduction

Artificial intelligence (AI) has rapidly infiltrated numerous industries, and content creation is no exception. While some fear that AI might replace human writers and creators, others see it as a powerful tool to enhance productivity and creativity. In this blog post, we'll explore the impact of AI on content creation, the potential benefits and drawbacks, and how you can harness AI to your advantage.

## AI-Powered Writing Tools: A Game Changer?

AI writing tools like ChatGPT, Jasper, and Copy.ai have gained immense popularity for their ability to generate different types of content, from blog posts and social media captions to emails and product descriptions. These tools use sophisticated language models to understand prompts and produce human-like text within seconds.

### The Pros:

* **Increased Efficiency:** AI can significantly speed up the writing process, helping you create more content in less time.
* **Idea Generation:** If you're stuck in a creative rut, AI can spark new ideas and outlines for your content.
* **Improved Writing Quality:** AI can help refine your grammar, style, and tone, making your writing more polished.

### The Cons:

* **Lack of Originality:** While AI can produce coherent text, it often lacks the unique voice and creativity that comes from human writers.
* **Accuracy Concerns:** AI-generated content might contain factual errors or outdated information, requiring careful review.
* **Ethical Considerations:** The use of AI in content creation raises questions about plagiarism and authenticity.

## Embracing AI: Tips for Content Creators

AI is here to stay, so instead of resisting it, content creators can leverage AI to their benefit:

1. **Use AI as a Starting Point:** AI-generated content can serve as a helpful starting point for your own writing. Use it to brainstorm ideas or generate outlines, then add your personal touch and expertise.
2. **Edit and Fact-Check Rigorously:** Always thoroughly review and edit any AI-generated content to ensure accuracy, originality, and consistency with your brand voice.
3. **Focus on High-Level Tasks:** Delegate repetitive or mundane writing tasks to AI, freeing up your time to focus on higher-level creative work, such as strategy and storytelling.

## Conclusion: The Future of AI and Content Creation

The integration of AI into content creation is an evolving landscape. While AI can undoubtedly streamline workflows and enhance productivity, it's crucial to recognize its limitations and use it responsibly. The most successful content creators will be those who can strike the right balance between leveraging AI capabilities and infusing their work with a unique human touch.

As AI continues to advance, it's essential to stay informed about the latest developments and adapt your strategies accordingly. By embracing AI as a tool rather than a replacement, content creators can unlock new levels of creativity and efficiency in their work. 

> Remember, AI is not a threat to human creativity but rather a powerful ally that can augment our skills and propel our work to new heights. 
---
`,
  },
}

const messageFromAgent = {
  ...baseMessage,
  sender: { name: 'Scheduling agent', id: 'bh1hbjkidjn' },
}

const messageFromHuman = {
  ...baseMessage,
  sender: { name: 'Some sender', id: '1562ajosn' },
}

const messageString = JSON.stringify({
  ...baseMessage,
  sender: messageFromAgent.sender,
})

const elementRendererString = `<ElementRenderer
      message={messageFromAgent}
      supportedElements={supportedElements}
    />`

const profileString = `(message: Message) => {
    <>
      {getProfileIcon(message)}
      <Typography variant="body1" color="text.secondary">
        {message.sender.name}
      </Typography>
    </>
  }`

function getProfileIcon(message: Message) {
  if (message.sender.name?.includes('agent')) {
    return <Icon name="smart_toy" />
  } else {
    return <Icon name="account_circle" />
  }
}

function getProfileName(message: Message) {
  return (
    <Typography variant="body1" color="text.secondary">
      {message.sender.name}
    </Typography>
  )
}

function getProfileIconAndName(message: Message) {
  return (
    <>
      {getProfileIcon(message)}
      {getProfileName(message)}
    </>
  )
}

export const WithProfileIcon = {
  args: {
    children: (
      <ElementRenderer
        messages={[messageFromHuman]}
        {...commonElementRendererProps}
      />
    ),
    message: messageFromHuman,
    getProfileComponent: getProfileIconAndName,
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
  getProfileComponent={${profileString}}
  message={${messageString}}
  >
    ${elementRendererString}
</MessageCanvas>`,
      },
    },
  },
}

export const NoIcon = {
  args: {
    children: (
      <ElementRenderer
        messages={[messageFromAgent]}
        {...commonElementRendererProps}
      />
    ),
    getProfileComponent: getProfileName,
    message: messageFromAgent,
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
  message={${messageString}}
  getProfileComponent={${profileString}}
  >
    ${elementRendererString}
</MessageCanvas>`,
      },
    },
  },
}

export const WithCopyIcon = {
  args: {
    children: (
      <ElementRenderer
        messages={[messageFromHuman]}
        {...commonElementRendererProps}
      />
    ),
    message: messageFromHuman,
    getProfileComponent: getProfileIconAndName,
    getActionsComponent: (message: Message) => {
      const copyButton = message.format === 'TextFormat' && (
        <CopyText message={message} />
      )
      if (copyButton) {
        return <>{copyButton}</>
      }
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
  getProfileComponent={${profileString}}
  getActionsComponent={(message: Message) => {
    const copyButton = message.format === 'TextFormat' && <CopyText message={message} />
    if (copyButton) {
      return <>{copyButton}</>
    }
  }}
  message={${messageString}}
  >
    ${elementRendererString}
</MessageCanvas>`,
      },
    },
  },
}

export const WithTextToSpeech = {
  args: {
    children: (
      <ElementRenderer
        messages={[markdownMessage]}
        {...commonElementRendererProps}
      />
    ),
    message: markdownMessage,
    getProfileComponent: getProfileIconAndName,
    getActionsComponent: (message: Message) => {
      return (
        <>
          <TextToSpeech message={message} />
        </>
      )
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The TextToSpeech feature supports converting the content of a message into spoken audio, allowing users to hear the message read aloud.',
      },
      source: {
        code: `<MessageCanvas
  getProfileComponent={${profileString}}
  getActionsComponent={getActionsComponent}
  message={${JSON.stringify(markdownMessage)}}
  >
    ${elementRendererString}
</MessageCanvas>`,
      },
    },
  },
}

export const WithThreadReplies = {
  args: {
    children: (
      <ElementRenderer
        messages={[messageFromHuman]}
        {...commonElementRendererProps}
      />
    ),
    message: messageFromHuman,
    getProfileComponent: getProfileIconAndName,
    threadReplyCount: 3,
    onThreadOpen: (id: string) => {
      alert('Thread opened for message: ' + id)
    },
    getActionsComponent: (message: Message) => {
      const copyButton = message.format === 'TextFormat' && (
        <CopyText message={message} />
      )
      if (copyButton) {
        return <>{copyButton}</>
      }
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
  getProfileComponent={${profileString}}
  message={${messageString}}
  >
    ${elementRendererString}
</MessageCanvas>`,
      },
    },
  },
}
