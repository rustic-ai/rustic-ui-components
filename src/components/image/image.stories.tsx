import type { Meta } from '@storybook/react-webpack5'
import type { ComponentType } from 'react'
import React from 'react'

import Image from './image'

const meta: Meta<React.ComponentProps<typeof Image>> = {
  title: 'Rustic UI/Image/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}
export default meta

export const Default = {
  args: {
    alt: 'A curved facade covered in white latticework',
    src: 'images/image-component-example.png',
    getAuthHeaders: () =>
      Promise.resolve({
        headers: {
          Authorization: 'Bearer example-token',
        },
      }),
  },
}

export const ImageWithDescription = {
  args: {
    src: 'images/image-component-example.png',
    alt: 'A curved facade covered in white latticework',
    description:
      'Lorem ipsum dolor sit amet consectetur. Aliquam vulputate sit non non tincidunt pellentesque varius euismod est. Lobortis feugiat euismod lorem viverra. Ipsum justo pellentesque.',
  },
}

export const EncodedImage = {
  name: 'Base64 Encoded Image',
  args: {
    alt: 'A small image of a canopy of trees',
    src: 'data:image/png;base64,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',
  },
}

export const InlineSVG = {
  args: {
    alt: 'A small image of a canopy of trees',
    src: `data:image/svg+xml;charset=UTF-8,%3Csvg%20viewBox%3D%270%200%20400%20400%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20height%3D%27300%27%20width%3D%27300%27%3E%0A%20%20%3Crect%20x%3D%270%27%20y%3D%270%27%20width%3D%2750%25%27%20height%3D%2750%25%27%20fill%3D%27tomato%27%20opacity%3D%270.75%27%20%2F%3E%0A%20%20%3Crect%20x%3D%2725%25%27%20y%3D%2725%25%27%20width%3D%2750%25%27%20height%3D%2750%25%27%20fill%3D%27slategrey%27%20opacity%3D%270.75%27%20%2F%3E%0A%20%20%3Crect%20x%3D%2750%25%27%20y%3D%2750%25%27%20width%3D%2750%25%27%20height%3D%2750%25%27%20fill%3D%27olive%27%20opacity%3D%270.75%27%20%2F%3E%0A%20%20%3Crect%20x%3D%270%27%20y%3D%270%27%20width%3D%27100%25%27%20height%3D%27100%25%27%20stroke%3D%27cadetblue%27%20stroke-width%3D%270.5%25%27%20fill%3D%27none%27%20%2F%3E%0A%3C%2Fsvg%3E`,
  },
}

export const InsideSmallerParentContainer = {
  args: {
    alt: 'A curved facade covered in white latticework',
    src: 'images/image-component-example.png',
  },
  decorators: [
    (Story: ComponentType) => {
      return (
        <div style={{ width: '200px' }}>
          <Story />
        </div>
      )
    },
  ],
}

export const CustomizedWidthAndHeight = {
  args: {
    alt: 'A curved facade covered in white latticework',
    src: 'images/image-component-example.png',
    width: '100px',
    height: '100px',
  },
}

export const WrongUrl = {
  args: {
    alt: 'An image example',
    src: 'wrongUrl.jpg',
  },
}
