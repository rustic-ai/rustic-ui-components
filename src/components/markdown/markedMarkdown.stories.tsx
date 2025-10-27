import type { Meta } from '@storybook/react-webpack5'

import MarkedMarkdown from './markedMarkdown'

const meta: Meta<React.ComponentProps<typeof MarkedMarkdown>> = {
  title: 'Rustic UI/Markdown/Marked Markdown',
  component: MarkedMarkdown,
  tags: ['autodocs'],
  argTypes: {
    text: {
      description: 'Text to be displayed.',
    },
    updatedData: {
      description:
        'New messages with content to overwrite or to be appended to the existing content.',
    },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta
export const Mixed = {
  args: {
    text: '# Title\n\n---\n\n ## Subtitle\n\nThis is a paragraph. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n- This is an **inline notation**\n- This is a *inline notation*.\n- This is a _inline notation_.\n- This is a __inline notation__.\n- This is a ~~inline notation~~.\n\n```\nconst string = "Hello World"\nconst number = 123\n```\n\n> This is a blockquote.\n\n1. Item 1\n2. Item 2\n3. Item 3\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Item 1   | Item 2   | Item 3   |',
  },
}

export const Headings = {
  args: {
    text: '# Heading 1\n\n## Heading 2\n\n### Heading 3\n\n#### Heading 4\n\n##### Heading 5\n\n###### Heading 6',
  },
}

export const Paragraphs = {
  args: {
    text: "This is a paragraph. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. \n\nThis is another paragraph. Lorem Ipsum has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
}

export const Links = {
  args: {
    text: '[This is a link.](https://www.google.com)',
  },
}

export const Images = {
  args: {
    text: '![alt text](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)',
  },
}

export const InlineNotations = {
  args: {
    text: '- This is an **inline notation**\n- This is a *inline notation* (using *) .\n- This is a _inline notation_ (using _).\n- This is a __inline notation__.\n- This is a ~~inline notation~~.',
  },
}

export const Code = {
  args: {
    text: '`const string = "Hello World"`.',
  },
}

export const Codeblocks = {
  args: {
    text: '```\nconst string = "Hello World"\nconst number = 123\n```',
  },
}

export const Blockquotes = {
  args: {
    text: '> This is a blockquote.',
  },
}

export const UnorderedLists = {
  args: {
    text: '- Item 1\n- Item 2\n- Item 3',
  },
}

export const OrderedLists = {
  args: {
    text: '1. Item 1\n2. Item 2\n3. Item 3',
  },
}

export const Tables = {
  args: {
    text: '| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Item 1   | Item 2   | Item 3   |',
  },
}

export const HorizontalRule = {
  args: {
    text: '## Horizontal Rule Below\n\n---',
  },
}
