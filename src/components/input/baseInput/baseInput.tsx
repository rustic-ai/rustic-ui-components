import './baseInput.css'
import '../../../index.css'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Database } from 'emoji-picker-element'
import type {
  Emoji as EmojiInfo,
  NativeEmoji,
} from 'emoji-picker-element/shared'
import { type ForwardedRef, forwardRef, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import Icon from '../../icon/icon'
import type { BaseInputProps, Message, Participant } from '../../types'
import Emoji from '../emoji/emoji'

type SuggestionMenuProps = {
  items: any[]
  isOpen: boolean
  onClose: () => void
  onSelect: (item: any) => void
  renderItem: (item: any) => React.ReactNode
  anchorEl: HTMLInputElement
  selectedIndex: number
}
const defaultMaxRows = 6
const defaultMaxEmojiSearchResults = 5
const speechRecognitionErrors = {
  'no-speech':
    'No speech detected. Check your microphone volume and try again.',
  aborted:
    'Speech input was aborted. Ensure no other windows are accessing your microphone and try again.',
  'audio-capture':
    'Could not capture any audio. Check that your microphone is connected and try again.',
  network:
    'Failed to connect to the internet for recognition. Check your internet connection and try again.',
  'not-allowed':
    'This functionality requires microphone access. Please allow microphone access and try again.',
  'service-not-allowed':
    "Speech recognition service is not allowed, either because the browser doesn't support it or because of reasons of security, privacy or user preference.",
  'bad-grammar':
    'There was an error in the speech recognition grammar or format. Check your speech input or grammar rules.',
  'language-not-supported':
    "The language you're speaking isn't supported. Try speaking in a different language or check your device settings.",
}

function showEmojiInfo(emoji: EmojiInfo) {
  if ('unicode' in emoji && 'annotation' in emoji) {
    return `${emoji.unicode} ${emoji.annotation}`
  }
}

function showMemberInfo(member: Participant) {
  return (
    <Box className="rustic-participant-profile">
      <Avatar src={member.icon} className="rustic-participant-avatar" />
      <Typography variant="body1Bold">{member.displayName}</Typography>
    </Box>
  )
}

function SuggestionMenu({
  items,
  isOpen,
  onClose,
  onSelect,
  renderItem,
  anchorEl,
  selectedIndex,
}: SuggestionMenuProps) {
  return (
    <Popover
      disableAutoFocus
      open={isOpen && items.length > 0}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      className="rustic-suggestion-menu"
    >
      <MenuList data-cy="suggestion-menu">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => onSelect(item)}
            selected={index === selectedIndex}
          >
            {renderItem(item)}
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  )
}
/**
 * The `TextInput` component enables users to input text messages and send them over a WebSocket connection. It provides functionality for sending messages with a sender, timestamp, and conversation ID. The component integrates with the [emoji-picker-element](https://www.npmjs.com/package/emoji-picker-element) library to allow users to easily add emojis to their messages. The emoji picker can be customized through CSS variables. For detailed customization options, refer to the [emoji-picker-element documentation](https://www.npmjs.com/package/emoji-picker-element#css-variables).
 *
 * `emoji-picker-element`, `emoji-picker-element-data` and `uuid` are not bundled, so please install the following packages using npm:
 *
 * ```typescript
 * npm i emoji-picker-element emoji-picker-element-data uuid
 * ```
 *
 */
function BaseInputElement(
  {
    multiline = true,
    fullWidth = true,
    maxRows = defaultMaxRows,
    enableSpeechToText = false,
    maximumEmojiSearchResults = defaultMaxEmojiSearchResults,
    ...props
  }: React.PropsWithChildren<BaseInputProps>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [messageText, setMessageText] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isEndingRecording, setIsEndingRecording] = useState(false)
  const [speechToTextError, setSpeechToTextError] = useState<string>('')
  const [emojiSearchResults, setEmojiSearchResults] = useState<EmojiInfo[]>([])
  const [isEmojiMenuShown, setIsEmojiMenuShown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)

  const database = new Database({ dataSource: props.emojiDataSource })
  const isEmptyMessage = !messageText.trim().length
  const speechToTextTooltipTitle = `${isRecording ? 'Stop' : 'Start'} speech to text`
  const featureButtonColor = isFocused ? 'primary.main' : 'primary.light'
  const speechToTextIconColor = isRecording ? 'error.main' : featureButtonColor
  const speechToTextIconName = isRecording ? 'stop_circle' : 'speech_to_text'
  const [memberSearchResults, setMemberSearchResults] = useState<Participant[]>(
    []
  )
  const [isMembersMenuShown, setIsMembersMenuShown] = useState<boolean>(false)

  function isSpeechRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' && !!(window as any).webkitSpeechRecognition
    )
  }

  const shouldShowSpeechToText =
    enableSpeechToText && isSpeechRecognitionSupported()

  function getIsSendDisabled() {
    if (typeof props.isSendEnabled == 'boolean') {
      return !props.isSendEnabled
    } else {
      return isEmptyMessage
    }
  }

  function insertTextAtCursor(insertText: string, replacePattern?: RegExp) {
    if (inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current

      if (
        typeof selectionStart === 'number' &&
        typeof selectionEnd === 'number'
      ) {
        const currentText = messageText || ''
        const startText = currentText.substring(0, selectionStart)
        const endText = currentText.substring(selectionEnd)

        let newText: string, newPosition: number

        if (replacePattern) {
          newText = startText.replace(replacePattern, insertText) + endText
          newPosition = startText.replace(replacePattern, insertText).length
        } else {
          newText = startText + insertText + endText
          newPosition = selectionStart + insertText.length
        }

        setMessageText(newText)

        setTimeout(() => {
          inputRef.current?.focus()
          inputRef.current?.setSelectionRange(newPosition, newPosition)
        }, 0)
      }
    }
  }

  function handleMentionClick(name: string) {
    insertTextAtCursor(`@${name} `, /@(\w*)$/)
    setMemberSearchResults([])
  }

  function handleEmojiClick(emoji: string, shouldReplaceShortcode = false) {
    insertTextAtCursor(emoji, shouldReplaceShortcode ? /:(\w+)$/ : undefined)
    setIsEmojiMenuShown(false)
  }

  function searchEmojis(query: string) {
    database
      .getEmojiBySearchQuery(query)
      .then((results) => {
        if (results.length) {
          setEmojiSearchResults(results.slice(0, maximumEmojiSearchResults))
          setIsEmojiMenuShown(true)
        } else {
          setEmojiSearchResults([])
          setIsEmojiMenuShown(false)
        }
      })
      .catch(() => {
        setEmojiSearchResults([])
        setIsEmojiMenuShown(false)
      })
  }

  const speechToTextButtonAdornment = isEndingRecording ? (
    <CircularProgress size={24} data-cy="spinner" />
  ) : (
    <Tooltip title={speechToTextTooltipTitle}>
      <IconButton
        data-cy="record-button"
        onClick={handleToggleSpeechToText}
        size="small"
        sx={{
          color: speechToTextIconColor,
          '&:hover': { color: 'primary.main' },
        }}
      >
        <Icon name={speechToTextIconName} />
      </IconButton>
    </Tooltip>
  )

  function handleToggleSpeechToText() {
    const microphone = new window.webkitSpeechRecognition()
    const recognitionLang = navigator.language

    microphone.lang = recognitionLang

    if (isRecording) {
      microphone.stop()
      setIsEndingRecording(true)
      setIsRecording(false)
    } else {
      microphone.start()
      setSpeechToTextError('')
      setIsRecording(true)
    }

    microphone.onstart = () => {
      setIsRecording(true)
    }

    microphone.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[0][0].transcript

      if (messageText.length > 0) {
        setMessageText(messageText + ' ' + currentTranscript)
      } else {
        setMessageText(currentTranscript)
      }

      inputRef.current?.focus()
      setIsRecording(false)
    }

    microphone.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorDescription = speechRecognitionErrors[event.error]

      setSpeechToTextError(errorDescription)
      setIsRecording(false)
    }

    microphone.onend = () => {
      setIsEndingRecording(false)
      setIsRecording(false)
    }
  }

  function handleSendMessage(): void {
    const currentTime = new Date().toISOString()
    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'chatCompletionRequest',
      data: { text: messageText },
      inReplyTo: props.lastMsg?.id,
      messageHistory: props.lastMsg?.messageHistory,
    }

    props.send(formattedMessage)
    setMessageText('')
    setSpeechToTextError('')
  }

  function updateSelectedIndex(offset: number): void {
    if (isEmojiMenuShown) {
      setSelectedIndex(
        (prev) =>
          (prev + offset + emojiSearchResults.length) %
          emojiSearchResults.length
      )
    } else if (isMembersMenuShown) {
      setSelectedIndex(
        (prev) =>
          (prev + offset + memberSearchResults.length) %
          memberSearchResults.length
      )
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    const isArrowDown = e.key === 'ArrowDown'
    const isArrowUp = e.key === 'ArrowUp'
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (!e.shiftKey) {
        e.preventDefault()
      }

      if (
        isEmojiMenuShown &&
        emojiSearchResults.length > 0 &&
        'unicode' in emojiSearchResults[selectedIndex]
      ) {
        const selectedEmoji = emojiSearchResults[selectedIndex] as NativeEmoji
        handleEmojiClick(selectedEmoji.unicode, true)
      } else if (isMembersMenuShown && memberSearchResults.length > 0) {
        handleMentionClick(memberSearchResults[selectedIndex].displayName)
      } else if (!e.shiftKey && !getIsSendDisabled()) {
        handleSendMessage()
      }
    } else if (isArrowDown || isArrowUp) {
      e.preventDefault()
      updateSelectedIndex(isArrowDown ? 1 : -1)
      return
    } else {
      if (selectedIndex !== 0) {
        setSelectedIndex(0)
      }
    }
  }

  function handleMention(text: string) {
    const mentionMatch = text.match(/@(\w*)$/)
    if (mentionMatch && props.getMembers) {
      const query = mentionMatch[1].toLowerCase()
      props.getMembers().then((members: Participant[]) => {
        const filteredMembers = members.filter((member) =>
          member.displayName.toLowerCase().startsWith(query)
        )
        setMemberSearchResults(filteredMembers)
        if (filteredMembers.length > 0) {
          setIsMembersMenuShown(true)
        } else {
          setIsMembersMenuShown(false)
        }
      })
    } else {
      setMemberSearchResults([])
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSpeechToTextError('')
    const newText = e.target.value
    setMessageText(newText)
    handleMention(newText)
    // expression to match ':text:' format
    const closedShortcode = newText.match(/:(\w{2,}):/g)
    // expression to match ':something' format
    const unclosedShortcode = newText.match(/:(\w{2,})/g)

    if (closedShortcode) {
      const shortcode = closedShortcode[0].replace(/:/g, '')

      database
        .getEmojiByShortcode(shortcode)
        .then((emoji) => {
          if (emoji && 'unicode' in emoji) {
            const replacedText = newText.replace(
              closedShortcode[0],
              emoji.unicode
            )
            setMessageText(replacedText)
          } else {
            setMessageText(newText)
          }
        })
        .catch(() => {
          setMessageText(newText)
        })
      setIsEmojiMenuShown(false)
    } else if (unclosedShortcode) {
      const query = unclosedShortcode[0].replace(':', '')
      searchEmojis(query)
    } else {
      setIsEmojiMenuShown(false)
    }
  }
  return (
    <Box className="rustic-base-input" ref={ref} data-cy="base-input">
      <Box className="rustic-error-and-input-container">
        <Box className="rustic-error-container">
          <Typography
            variant="caption"
            color="error"
            className="rustic-error-message"
            data-cy="error-message"
          >
            {speechToTextError}
          </Typography>
        </Box>
        <Box
          className="rustic-input-field"
          sx={{
            border: '1px solid',
            borderColor: isFocused ? 'secondary.main' : 'action.disabled',
            backgroundColor: 'background.paper',
          }}
        >
          {emojiSearchResults.length > 0 && inputRef.current && (
            <SuggestionMenu
              anchorEl={inputRef.current}
              items={emojiSearchResults.filter((e) => 'unicode' in e)}
              isOpen={isEmojiMenuShown}
              onClose={() => {
                setIsEmojiMenuShown(false)
                setSelectedIndex(0)
              }}
              onSelect={(emoji) => handleEmojiClick(emoji.unicode, true)}
              selectedIndex={selectedIndex}
              renderItem={showEmojiInfo}
            />
          )}

          {memberSearchResults.length > 0 && inputRef.current && (
            <SuggestionMenu
              anchorEl={inputRef.current}
              items={memberSearchResults}
              isOpen={isMembersMenuShown}
              onClose={() => {
                setIsMembersMenuShown(false)
                setSelectedIndex(0)
              }}
              onSelect={(member) => handleMentionClick(member.displayName)}
              renderItem={showMemberInfo}
              selectedIndex={selectedIndex}
            />
          )}

          <TextField
            data-cy="text-field"
            className="rustic-text-field"
            variant="outlined"
            value={messageText}
            label={props.label}
            placeholder={props.placeholder}
            maxRows={maxRows}
            multiline={multiline}
            fullWidth={fullWidth}
            onKeyDown={handleKeyDown}
            onChange={handleOnChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            inputRef={inputRef}
            color="secondary"
            size="small"
            autoFocus={props.autoFocus}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className="rustic-input-adornment"
                  >
                    <Emoji
                      dataSource={props.emojiDataSource}
                      onEmojiClick={handleEmojiClick}
                      buttonColor={featureButtonColor}
                    />
                    {shouldShowSpeechToText && speechToTextButtonAdornment}
                  </InputAdornment>
                ),
              },
              inputLabel: {
                className: !isFocused ? 'rustic-input-label' : '',
                sx: {
                  backgroundColor: 'background.paper',
                },
              },
            }}
          />
          <div className="rustic-input-extras"></div>
        </Box>
      </Box>
      <Box className="rustic-input-actions">
        {props.children}
        <Tooltip title="Send">
          <span className="rustic-send-button">
            <IconButton
              data-cy="send-button"
              aria-label="send message"
              onClick={handleSendMessage}
              disabled={getIsSendDisabled()}
              color="secondary"
            >
              <Icon name="send" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
}

const BaseInput = forwardRef(BaseInputElement)

export default BaseInput
