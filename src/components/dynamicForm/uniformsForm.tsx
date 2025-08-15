import './uniformsForm.css'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Ajv, { type JSONSchemaType } from 'ajv'
import React, { useEffect, useState } from 'react'
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'
import { AutoForm } from 'uniforms-mui'
import { v4 as getUUID } from 'uuid'

import MarkedMarkdown from '../markdown/markedMarkdown'
import type { DynamicFormProps, Message } from '../types'
import QuestionField from './questionField'

const customComponents = {
  QuestionField: QuestionField,
}

/**
 * The `UniformsForm` component provides a user interface for rendering a dynamic form using [uniforms](https://uniforms.tools/) and sending the response as a message on the websocket.
 * It is designed to facilitate interactive decision-making and response submission within a conversation or messaging context.
 *
 * Note: `uuid` and `uniforms` are not bundled, so please install the following package using npm:
 *
 * ```typescript
 * npm i uniforms uniforms-bridge-json-schema uniforms-mui uuid
 * ```
 */
export default function UniformsForm(props: DynamicFormProps) {
  const [data, setData] = useState(props.data)
  useEffect(() => {
    if (props.data) {
      setData(props.data)
    }
  }, [props.data])

  const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    keywords: ['uniforms'],
  })

  function createValidator<T>(schema: JSONSchemaType<T>) {
    const validator = ajv.compile(schema)

    return (model: Record<string, unknown>) => {
      validator(model)
      return validator.errors?.length ? { details: validator.errors } : null
    }
  }

  const schemaValidator = createValidator(props.schema)

  const processSchema = (schema: any) => {
    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        const property = schema.properties[key]

        if (property.uniforms?.options) {
          property.uniforms.component = customComponents.QuestionField
        }
      })
    }
  }

  processSchema(props.schema)

  const bridge = new JSONSchemaBridge({
    schema: props.schema,
    validator: schemaValidator,
  })

  function handleSubmit(model: any) {
    const currentTime = new Date().toISOString()

    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'formResponse',
      data: { data: model, inReplyTo: props.messageId },
    }
    setData(model)
    props.ws?.send(formattedMessage)
  }

  return (
    <Box>
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <AutoForm
        schema={bridge}
        onSubmit={(model) => handleSubmit(model)}
        model={data}
        disabled={!!data || !props.ws}
      />
    </Box>
  )
}
