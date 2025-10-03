import './messageArchive.css'

import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/system/Box'
import React, { type ReactNode, useEffect, useRef, useState } from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import { getCombinedMessages } from '../helper'
import Icon from '../icon/icon'
import MessageCanvas, {
  type MessageContainerProps,
} from '../messageCanvas/messageCanvas'
import type { ComponentMap, Message } from '../types'

export interface MessageArchiveProps extends MessageContainerProps {
  /** A component map contains message formats as keys and their corresponding React components as values. */
  supportedElements: ComponentMap
  /** A function that can be used to get the historic messages */
  getHistoricMessages: () => Promise<Message[]>
  /** Text label for scroll down button. Default value is 'scroll down'. */
  scrollDownLabel?: string
  /** Info message to display at the top of the message archive */
  infoMessage?: string
  /** Loading icon to display while fetching historic messages. If not provided, a default spinner will be shown */
  loadingIcon?: ReactNode
  /** If true, disables all scrolling functionalities including auto-scroll and scroll down button */
  disableAutoScroll?: boolean
}

/**
 The `MessageArchive` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a `MessageCanvas` for consistent styling and layout. Unlike the `MessageSpace` component, it does not support message sending functionality. Instead, it is designed to display archived messages in a read-only format. Do not include any components that require a WebSocket connection, such as `Prompts`, in the `supportedElements`.

 The `MessageArchive` component can combine update messages with the original message and render them as a single message. For this to work, the `threadId` of the update message must match the `id` of the original message, and the format of the update message should be prefixed with 'update'. For example, if the original message format is 'streamingText', the update message format should be 'updateStreamingText'.
 
 Note: For more information about the `getActionsComponent` and `getProfileComponent` fields, refer to the [MessageCanvas' docs](https://rustic-ai.github.io/rustic-ui-components/?path=/docs/rustic-ui-message-canvas-message-canvas--docs).
*/

export default function MessageArchive({
  scrollDownLabel = 'Scroll down',
  disableAutoScroll = false,
  ...props
}: MessageArchiveProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [isScrollButtonHidden, setIsScrollButtonHidden] = useState(true)
  const [areVideosLoaded, setAreVideosLoaded] = useState(false)
  const [chatMessages, setChatMessages] = useState<{
    [messageId: string]: Message[]
  }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const currentMessagesLength = Object.keys(chatMessages).length
  const hideScrollButtonDuration = 2000

  function hideScrollButton() {
    setIsScrollButtonHidden(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsScrollButtonHidden(false)
    }, hideScrollButtonDuration)
  }

  function getVideoStatus() {
    const videos = containerRef.current?.querySelectorAll('video')
    if (!videos || videos.length === 0) {
      return true
    }
    return Array.from(videos).every((video) => video.readyState >= 1)
  }

  function checkIntersection() {
    const container = containerRef.current
    const lastMessage = scrollEndRef.current

    if (container && lastMessage) {
      const containerBottom = container.getBoundingClientRect().bottom
      const targetBottom = lastMessage.getBoundingClientRect().bottom
      //targetBottom is slightly larger than containerBottom when it's scrolled to bottom. But the difference is always less than 1.
      const bottomDistanceTolerance = 1

      setIsScrolledToBottom(
        targetBottom - bottomDistanceTolerance <= containerBottom
      )
    }
  }

  function scrollDown() {
    if (getVideoStatus()) {
      const container = containerRef.current
      setAreVideosLoaded(true)
      if (container) {
        // Use setTimeout to delay smooth scrolling so that it can scroll to bottom
        setTimeout(() => {
          hideScrollButton()
          container.scrollTop = container.scrollHeight
          setIsScrolledToBottom(true)
        }, 0)
      }
    } else {
      setTimeout(scrollDown, 1)
    }
  }

  useEffect(() => {
    let messageDict: { [messageId: string]: Message[] } = {}
    props
      .getHistoricMessages()
      .then((messages) => {
        messages.forEach((message) => {
          const newMessageDict = getCombinedMessages(messageDict, message)
          messageDict = newMessageDict
        })
        setChatMessages(messageDict)
        setIsLoading(false)
      })
      .catch((error) => {
        const errorDetail = error.response?.data?.detail || error.response?.data
        setError(errorDetail || 'Failed to load messages')
        setIsLoading(false)
      })
  }, [props.getHistoricMessages])

  useEffect(() => {
    if (!isLoading && chatMessages && !disableAutoScroll) {
      scrollDown()
    }

    const container = containerRef.current

    if (container && !disableAutoScroll) {
      checkIntersection()

      container.addEventListener('scroll', checkIntersection)
      window.addEventListener('resize', checkIntersection)

      return () => {
        container.removeEventListener('scroll', checkIntersection)
        window.removeEventListener('resize', checkIntersection)
      }
    }
  }, [isLoading, chatMessages, disableAutoScroll])

  useEffect(() => {
    if (!disableAutoScroll) {
      scrollDown()
    }
  }, [areVideosLoaded, disableAutoScroll])

  if (isLoading) {
    return (
      <Box className="rustic-message-archive-loading">
        {props.loadingIcon ? props.loadingIcon : <CircularProgress />}
      </Box>
    )
  } else {
    return (
      <Box className="rustic-message-archive" data-cy="message-archive">
        {props.infoMessage && !error && (
          <Alert severity="warning" data-cy="info-message">
            {props.infoMessage}
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          ref={containerRef}
          className="rustic-message-container"
          data-cy="message-container"
        >
          {Object.keys(chatMessages).map((key, index) => {
            const messages = chatMessages[key]
            const latestMessage = messages[messages.length - 1]
            const hasResponse = latestMessage.format.includes('Response')
            const inReplyTo = hasResponse && {
              inReplyTo: messages[0],
            }
            return (
              <MessageCanvas
                key={key}
                message={latestMessage}
                {...inReplyTo}
                getActionsComponent={props.getActionsComponent}
                getProfileComponent={props.getProfileComponent}
                ref={index === currentMessagesLength - 1 ? scrollEndRef : null}
              >
                <ElementRenderer
                  messages={hasResponse ? [messages[0]] : messages}
                  supportedElements={props.supportedElements}
                />
              </MessageCanvas>
            )
          })}
          {!isScrolledToBottom &&
            !isScrollButtonHidden &&
            !disableAutoScroll && (
              <Chip
                data-cy="scroll-down-button"
                color="secondary"
                className="rustic-scroll-down-button"
                size="medium"
                onClick={scrollDown}
                label={
                  <>
                    {scrollDownLabel}
                    <Icon name="arrow_downward" />
                  </>
                }
              />
            )}
        </Box>
      </Box>
    )
  }
}
