import type { ComponentType } from 'react'
import React from 'react'

import Video from './video'

export default {
  title: 'Rustic UI/Video/Video',
  component: Video,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: ComponentType) => {
      return (
        <div style={{ maxWidth: '750px' }}>
          <Story />
        </div>
      )
    },
  ],
}

const videoSrc = 'videoExamples/videoStorybook.mp4'

export const Default = {
  args: {
    src: videoSrc,
    title: 'Video Title',
    transcript:
      'Test transcript. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  },
}

export const WithoutTitleAndTranscript = {
  args: {
    src: videoSrc,
  },
}

export const WithCaptions = {
  args: {
    src: 'videoExamples/videoCaptions.mp4',
    title: 'Sound with Captions',
    captions: 'audioExamples/captions.vtt',
  },
  decorators: [
    (Story: ComponentType) => {
      return (
        <div style={{ maxWidth: '500px' }}>
          <Story />
        </div>
      )
    },
  ],
}

export const WithPoster = {
  args: {
    src: videoSrc,
    poster: 'images/image-component-example.png',
  },
}

export const Error = {
  args: {
    src: '',
  },
}
