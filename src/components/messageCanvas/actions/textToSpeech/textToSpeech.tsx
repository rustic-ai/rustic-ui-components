import { useState } from 'react'

import Icon from '../../../icon/icon'
import type { Message } from '../../../types'
import Action from '../index'

export interface TextToSpeechProps {
  message: Message
}

export default function TextToSpeech(props: TextToSpeechProps) {
  const [tooltipContent, setTooltipContent] = useState('Start reading aloud')

  const content = [
    props.message.data.title,
    props.message.data.description,
    props.message.data.alt,
    props.message.data.text,
    props.message.data.transcript,
  ]
  const combinedText = content.filter(Boolean).join(' ')
  const utterance = new SpeechSynthesisUtterance(combinedText)

  function handleOnClick() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setTooltipContent('Start reading aloud')
    } else {
      utterance.onend = () => {
        setTooltipContent('Start reading aloud')
      }
      window.speechSynthesis.speak(utterance)
      setTooltipContent('Stop reading aloud')
    }
  }

  return (
    <Action
      message={props.message}
      icon={<Icon name="text_to_speech" />}
      onClick={handleOnClick}
      label={tooltipContent}
    />
  )
}
