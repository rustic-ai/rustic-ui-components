import './markedMarkdown.css'

import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import React from 'react'
import { useEffect, useState } from 'react'

import { type TextData, UpdateType } from '../types'

/** The `MarkedMarkdown` component renders markdown-formatted text content into HTML.
 * It uses [Marked](https://marked.js.org/) markdown parsing library.
 * This component supports updates by appending/replacing the existing content through the `updatedData` attribute.
 */
const MarkedMarkdown = (props: TextData) => {
  const [content, setContent] = useState(props.text)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (props.updatedData && props.updatedData.length > 0) {
      let newContent = props.text

      for (const data of props.updatedData) {
        let updatedText: string
        const updateType = data.updateType || UpdateType.Append
        if (typeof data.text !== 'string') {
          updatedText = ' [MISSING TEXT]'

          setErrorMessage(
            'Some of the incoming text was not correctly formatted. Some data may be missing.'
          )
        } else {
          updatedText = data.text
        }
        if (updateType === UpdateType.Append) {
          newContent += updatedText
        } else if (updateType === UpdateType.Replace) {
          newContent = updatedText
        }
      }

      setContent(newContent)
    }
  }, [props.text, props.updatedData])

  function convertMarkdownToHtml(text: string): string {
    const textWithoutZeroWidthSpaces = text.replace(
      /^[\u200B-\u200F\uFEFF]/,
      ''
    )
    const parsedText = marked.parse(textWithoutZeroWidthSpaces, {
      async: false,
    })
    const sanitizedText = DOMPurify.sanitize(parsedText)

    return sanitizedText
  }

  function renderMarkdownToHtml(content: string) {
    return (
      <Typography
        component="div"
        className="rustic-markdown"
        dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
      />
    )
  }

  return (
    <>
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && renderMarkdownToHtml(props.description)}
      {renderMarkdownToHtml(content)}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </>
  )
}

export default MarkedMarkdown
