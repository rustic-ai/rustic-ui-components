import './text.css'

import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import React, { useEffect, useState } from 'react'

import { type TextData, UpdateType } from '../types'

/**
 * The `Text` component renders text content in a simple and straightforward manner, without any additional features or capabilities.
 *
 * It is designed to handle streams of text data, allowing for dynamic updates to the displayed text content.
 * It supports real-time updates of text content through the `updatedData` attribute, enabling appending/replacing
 * of new text data to the existing content.
 *
 * Note: `dompurify` is not bundled, so please install the following package using npm:
 *
 * ```typescript
 * npm i dompurify
 * ``` */
const Text = (props: TextData) => {
  const [text, setText] = useState(DOMPurify.sanitize(props.text))
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

      setText(DOMPurify.sanitize(newContent))
    }
  }, [props.text, props.updatedData])

  return (
    <>
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <Typography>{props.description}</Typography>}
      <Typography variant="body1" className="rustic-text">
        {text}
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </>
  )
}

export default Text
