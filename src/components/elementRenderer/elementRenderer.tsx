import Typography from '@mui/material/Typography'
import React from 'react'

import {
  type ComponentMap,
  type Message,
  type MessageData,
  type Sender,
  UpdateType,
  type WebSocketClient,
} from '../types'

export interface ElementRendererProps {
  sender?: Sender
  ws?: WebSocketClient
  messages: Message[]
  supportedElements: ComponentMap
}

const ElementRenderer = (props: ElementRendererProps) => {
  const rootMessage = props.messages[0]
  const updateMessages = props.messages.slice(1)
  let updatedData: MessageData[] = []
  let updateType: UpdateType = UpdateType.Append

  let msgFormat = rootMessage.format
  if (msgFormat.startsWith('update')) {
    msgFormat = msgFormat.replace('update', '')
  }

  if (updateMessages.length > 0) {
    const lastUpdate = updateMessages.at(-1)
    if (
      updateMessages.length > 1 &&
      lastUpdate?.data.updateType === UpdateType.Replace
    ) {
      updatedData = [lastUpdate.data]
      updateType = UpdateType.Replace
    } else {
      for (const updateMsg of updateMessages) {
        updateType = updateMsg.data.updateType || UpdateType.Append
        if (updateType === UpdateType.Append) {
          updatedData.push(updateMsg.data)
        } else if (updateType === UpdateType.Replace) {
          updatedData = [updateMsg.data]
        }
      }
    }
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
            updateType: updateType,
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
