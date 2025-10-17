import './messageCanvas.css'

import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import useTheme from '@mui/system/useTheme'
import React, { forwardRef, type ReactNode } from 'react'

import Icon from '../icon/icon'
import Timestamp from '../timestamp/timestamp'
import type { Message } from '../types'

export interface MessageContainerProps {
  /** A function that returns a React element to display sender details, like names and/or avatars. */
  getProfileComponent?: (message: Message) => ReactNode
  /** A function that returns a single React element which may be composed of several actions supported for the message, such as editing, copying, and deleting, etc.
   * In case no actions are applicable or available for a particular message, the function may return `undefined`.
   * This approach offers flexibility in tailoring message interactions to specific application requirements.
   * To define individual message actions, developers can extend the `Action` component's functionality.
   * One such example is the `CopyText` component.
   */
  getActionsComponent?: (message: Message) => ReactNode | undefined
  /** A function that is called when user clicks on the thread replies. Can be used to open a thread view. */
  onThreadOpen?: (messageId: string) => void
}

export interface MessageCanvasProps extends MessageContainerProps {
  /** Message information to be displayed. Please see the `MessageSpace` docs for more information about the `Message` interface. */
  message: Message
  /** The initial message being responded to. Please see the `MessageSpace` docs for more information about the `Message` interface. */
  inReplyTo?: Message
  /** React component to be displayed in the message canvas. */
  children: ReactNode
  /** Number of thread replies */
  threadReplyCount?: number
  /** Whether this message is the active thread */
  isActiveThread?: boolean
}

/**
 The `MessageCanvas` component serves as a container for displaying messages within a chat interface.
 It provides a structured layout for rendering message content along with sender information and timestamp details.
 This component is designed to encapsulate individual message items and facilitate consistent rendering of messages within an application.
 */
function MessageCanvasElement(
  props: MessageCanvasProps,
  ref: React.Ref<HTMLDivElement>
) {
  const theme = useTheme()
  const messageInfo = props.inReplyTo ? props.inReplyTo : props.message

  return (
    <Stack
      id={messageInfo.id}
      className="rustic-message-canvas"
      data-cy="message-canvas"
      ref={ref}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        className="rustic-header"
      >
        {props.getProfileComponent && props.getProfileComponent(messageInfo)}
        <Timestamp timestamp={messageInfo.timestamp} />
      </Stack>
      {props.getActionsComponent &&
        props.getActionsComponent(props.message) && (
          <Card
            variant="outlined"
            className="rustic-message-actions-container"
            sx={{ boxShadow: (theme as Theme).shadows[1] }}
          >
            {props.getActionsComponent(messageInfo)}
          </Card>
        )}
      <Card
        variant="outlined"
        className="rustic-message-container"
        sx={{
          backgroundColor: props.isActiveThread
            ? theme.palette.secondary.focus
            : theme.palette.background.paper,
        }}
      >
        {props.children}
        {props.inReplyTo && (
          <Typography
            variant="caption"
            color="text.secondary"
            className="rustic-footer"
          >
            Submitted by {props.message.sender.name} at&nbsp;
            <Timestamp timestamp={props.message.timestamp} />
          </Typography>
        )}
      </Card>
      {props.threadReplyCount && (
        <Box
          className="rustic-thread-reply-count"
          onClick={() => props.onThreadOpen?.(props.message.id)}
        >
          <Icon
            name="sms"
            className="rustic-thread-reply-icon"
            color={theme.palette.secondary.main}
          />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              '.rustic-thread-reply-count:hover &': {
                color: theme.palette.secondary.main,
              },
            }}
          >
            {props.threadReplyCount}{' '}
            {props.threadReplyCount === 1 ? 'reply' : 'replies'}
          </Typography>
        </Box>
      )}
    </Stack>
  )
}

const MessageCanvas = forwardRef(MessageCanvasElement)
export default MessageCanvas
