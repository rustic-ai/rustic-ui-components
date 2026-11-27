import './action.css'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type React from 'react'
import type { ReactNode } from 'react'

import type { Message } from '../../types'

interface ActionProps {
  label: string
  message: Message
  icon: ReactNode
  onClick: (message: Message) => void
}

export default function Action(props: ActionProps) {
  return (
    <Tooltip title={props.label}>
      <IconButton
        data-cy={`${props.label.toLowerCase().replace(/\s+/g, '-')}-button`}
        color="inherit"
        aria-label={props.label}
        onClick={(
          event:
            | React.MouseEvent<HTMLAnchorElement>
            | React.MouseEvent<HTMLButtonElement>
        ) => {
          event.stopPropagation()
          event.preventDefault()
          props.onClick(props.message)
        }}
        className="rustic-message-actions"
      >
        {props.icon}
      </IconButton>
    </Tooltip>
  )
}
