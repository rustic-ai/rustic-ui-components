import './markedMarkdown.css'

import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import React from 'react'
import { useEffect, useState } from 'react'

import type { TextData } from '../types'

export function convertMarkdownToHtml(text: string): string {
  const textWithoutZeroWidthSpaces = text.replace(/^[\u200B-\u200F\uFEFF]/, '')
  const parsedText = marked.parse(textWithoutZeroWidthSpaces, { async: false })
  const sanitizedText = DOMPurify.sanitize(parsedText)

  return sanitizedText
}

/**  There are currently 2 markdown components available, `MarkedMarkdown` and `MarkedStreamingMarkdown`. These components use the [Marked](https://marked.js.org/) markdown parsing library.
 *
 * The `MarkedMarkdown` component renders markdown-formatted text content into HTML for display. This component currently supports updates involving the overwriting of existing markdown content with new data through the `updatedData` attribute.
 *
 * On the other hand, the `MarkedStreamingMarkdown` component is designed to handle streams of markdown-formatted text data. This component supports updates involving continuous appending of new markdown data to the existing content through the `updatedData` attribute.
 *
 * Tip: Use `MarkedMarkdown` when displaying static content or when you'd like to support content overwrite updates, and use `MarkedStreamingMarkdown` when its being updated dynamically and new content should be appended to existing content.*/
const MarkedMarkdown = (props: TextData) => {
  const [html, setHtml] = useState(convertMarkdownToHtml(props.text))

  useEffect(() => {
    if (props.updatedData && props.updatedData.length > 0) {
      const lastUpdatedData =
        props.updatedData[props.updatedData.length - 1].text
      setHtml(convertMarkdownToHtml(lastUpdatedData))
    }
  }, [props.text, props.updatedData])

  return (
    <>
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <Typography
        component="div"
        className="rustic-markdown"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}

export default MarkedMarkdown
