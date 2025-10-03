import './text.css'

import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import React from 'react'

import type { TextData } from '../types'

/** There are currently 2 text components available, `Text` and `StreamingText`.
 * The `Text` component renders text content in a simple and straightforward manner, without any additional features or capabilities. It is suitable for rendering static text that does not require dynamic updates or streams of text data.
 *
 * On the other hand, the `StreamingText` component is designed to handle streams of text data, allowing for dynamic updates to the displayed text content. It supports real-time updates of text content through the `updatedData` attribute, enabling the continuous appending of new text data to the existing content.
 *
 * Tip: Use `Text` when displaying static content, and use `StreamingText` when its being updated dynamically and new content should be appended to existing content.
 *
 * Note: `dompurify` is not bundled, so please install the following package using npm:
 *
 * ```typescript
 * npm i dompurify
 * ``` */
const Text = (props: TextData) => {
  return (
    <>
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <Typography>{props.description}</Typography>}
      <Typography variant="body1" className="rustic-text">
        {DOMPurify.sanitize(props.text)}
      </Typography>
    </>
  )
}

export default Text
