import './prompts.css'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import useTheme from '@mui/system/useTheme'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import { toChatRequest } from '../helper'
import type { Message, PromptsProps } from '../types'

/** The `Prompts` component renders a list of actionable prompts that users can click to send a predefined message.

To use the `Prompts` component within `MessageSpace`, you need to add prompts to the supportedElements map and include an additional property, `position`, in the `data` field of the message.
The `position` property determines where the prompts are displayed and can be one of the following:

- `inConversation`: Prompts are displayed at the top, integrated with other chat messages.
- `hoverOverInput` (default): Prompts are displayed above the input field at the bottom of the chat interface. Note that prompts with this position will only appear if they are part of the last message in the message list.
 */
export default function Prompts(props: PromptsProps) {
  const theme = useTheme()

  function handleSubmitResponse(response: string | number) {
    const currentTime = new Date().toISOString()

    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'chatCompletionRequest',
      data: toChatRequest(props.sender, response.toString()),
    }

    props.ws.send(formattedMessage)
  }

  const buttonList = props.prompts.map((prompt, index) => {
    return (
      <Chip
        key={index}
        onClick={() => handleSubmitResponse(prompt)}
        color="secondary"
        size="small"
        className="rustic-prompt"
        sx={{
          backgroundColor: theme.palette.background.paper,
          ...(props.position === 'inConversation' && {
            border: `1px solid ${theme.palette.divider}`,
          }),
          '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.hover,
          },
        }}
        label={prompt}
      />
    )
  })

  return (
    <Box data-cy="buttons-container" className={props.className}>
      {buttonList}
    </Box>
  )
}
