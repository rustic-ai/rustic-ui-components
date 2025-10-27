import './markedMarkdown.css'

import Alert from '@mui/material/Alert'
import { useTheme } from '@mui/material/styles'
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
  const theme = useTheme()
  const [content, setContent] = useState(props.text)
  const [errorMessage, setErrorMessage] = useState('')

  function getValidatedText(text: unknown): string {
    if (typeof text !== 'string') {
      setErrorMessage(
        'Some of the incoming text was not correctly formatted. Some data may be missing.'
      )
      return ' [MISSING TEXT]'
    }
    return text
  }

  useEffect(() => {
    if (props.updatedData && props.updatedData.length > 0) {
      let newContent = props.text
      const lastMsg = props.updatedData.at(-1)
      if (
        props.updatedData.length > 1 &&
        lastMsg?.updateType === UpdateType.Replace
      ) {
        newContent = getValidatedText(lastMsg.text)
      } else {
        for (const data of props.updatedData) {
          const updateType = data.updateType || UpdateType.Append
          const updatedText = getValidatedText(data.text)
          if (updateType === UpdateType.Append) {
            newContent += updatedText
          } else if (updateType === UpdateType.Replace) {
            newContent = updatedText
          }
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
      breaks: true,
      gfm: true,
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
        sx={{
          '& table, & th, & td': {
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
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
