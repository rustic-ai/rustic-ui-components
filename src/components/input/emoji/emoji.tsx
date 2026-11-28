import './emoji.css'
import 'emoji-picker-element'

import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import type Picker from 'emoji-picker-element/picker'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import { useEffect, useRef, useState } from 'react'

import Icon from '../../icon/icon'

interface EmojiProps {
  onEmojiClick: (emoji: string) => void
  buttonColor?: string
  dataSource?: string
}

function Emoji(props: EmojiProps) {
  const theme = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const emojiRef = useRef<Picker | null>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const emojiPickerStyles = {
    '--indicator-color': theme.palette.divider,
    '--background': theme.palette.background.paper,
    '--input-border-color': theme.palette.divider,
    '--outline-color': theme.palette.secondary.main,
  } as { [key: string]: string }

  function handleButtonClick() {
    setIsEmojiPickerOpen((prev) => !prev)
  }

  function handleEmojiPickerClose() {
    setIsEmojiPickerOpen(false)
  }

  function handleEmojiClick(event: EmojiClickEvent) {
    if (event.detail.unicode) {
      props.onEmojiClick(event.detail.unicode)
    }
    handleEmojiPickerClose()
  }

  useEffect(() => {
    if (!emojiRef.current && typeof window !== 'undefined') {
      import('emoji-picker-element')
        .then((module) => {
          const Picker = module.Picker
          const picker = new Picker({
            dataSource: props.dataSource,
          })
          const themeClass = theme.palette.mode === 'dark' ? 'dark' : 'light'
          picker.classList.add(themeClass)

          Object.keys(emojiPickerStyles).forEach((key) => {
            picker.style.setProperty(key, emojiPickerStyles[key])
          })

          emojiRef.current = picker
        })
        .catch((error) => {
          console.error('Failed to load emoji picker', error)
        })
    }
  }, [])

  useEffect(() => {
    if (emojiRef.current) {
      emojiRef.current.addEventListener('emoji-click', handleEmojiClick)
    }
    return () => {
      emojiRef.current?.removeEventListener('emoji-click', handleEmojiClick)
    }
  }, [isEmojiPickerOpen, props.onEmojiClick])

  function appendPicker(el: HTMLDivElement | null) {
    if (el && emojiRef.current && !el.contains(emojiRef.current)) {
      el.appendChild(emojiRef.current)
    }
  }

  return (
    <div>
      <Tooltip title="Emoji">
        <IconButton
          size="small"
          ref={buttonRef}
          onClick={handleButtonClick}
          data-cy="emoji-button"
          sx={{
            color: 'primary.light',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <Icon name="Mood" />
        </IconButton>
      </Tooltip>
      {emojiRef.current && (
        <Popover
          open={isEmojiPickerOpen}
          anchorEl={buttonRef.current}
          onClose={handleEmojiPickerClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <div
            data-cy="emoji-picker"
            className="rustic-emoji-picker"
            ref={appendPicker}
          ></div>
        </Popover>
      )}
    </div>
  )
}

export default Emoji
