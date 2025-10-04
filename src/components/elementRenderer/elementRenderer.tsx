import Typography from '@mui/material/Typography'
import React from 'react'

import type { ComponentMap, Message, Sender, WebSocketClient } from '../types'

export interface ElementRendererProps {
  sender?: Sender
  ws?: WebSocketClient
  messages: Message[]
  supportedElements: ComponentMap
}

const ElementRenderer = (props: ElementRendererProps) => {
  const rootMessage = props.messages[0]
  const updateMessages = props.messages.slice(1)
  let msgFormat = rootMessage.format
  if (msgFormat.startsWith('update')) {
    msgFormat = msgFormat.replace('update', '')
  }

  const MaybeElement = props.supportedElements[msgFormat]
  return (
    <>
      {MaybeElement ? (
        React.createElement(MaybeElement, {
          sender: props.sender,
          ws: props.ws,
          messageId: rootMessage.id,
          conversationId: rootMessage.conversationId,
          ...rootMessage.data,
          ...(updateMessages.length > 0 && {
            updatedData: updateMessages.map((message) => message.data),
          }),
        })
      ) : (
        <Typography variant="body2">
          Unsupported element format: {msgFormat}
        </Typography>
      )}
    </>
  )
}

export default ElementRenderer
