import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import Icon from '../../icon/icon'

interface MediaIconButtonProps {
  onClick: () => void
  action:
    | 'play'
    | 'pause'
    | 'forward'
    | 'replay'
    | 'volumeUp'
    | 'volumeOff'
    | 'miniPlayer'
    | 'miniPlayerExit'
    | 'fullscreen'
    | 'fullscreenExit'
    | 'captionsOn'
    | 'captionsOff'
  className?: string
}

export function MediaIconButton(props: MediaIconButtonProps) {
  const controls = {
    play: { symbol: 'play_circle', label: 'Play' },
    pause: { symbol: 'pause_circle', label: 'Pause' },
    forward: { symbol: 'forward_10', label: 'Forward ten seconds' },
    replay: { symbol: 'replay_10', label: 'Replay ten seconds' },
    volumeUp: { symbol: 'volume_up', label: 'Mute' },
    volumeOff: { symbol: 'volume_off', label: 'Unmute' },
    miniPlayer: {
      symbol: 'picture_in_picture',
      label: 'Mini player',
    },
    miniPlayerExit: {
      symbol: 'picture_in_picture_off',
      label: 'Exit mini player',
    },
    fullscreen: { symbol: 'fullscreen', label: 'Fullscreen' },
    fullscreenExit: { symbol: 'fullscreen_exit', label: 'Exit fullscreen' },
    captionsOn: { symbol: 'closed_caption', label: 'Show captions' },
    captionsOff: { symbol: 'closed_caption_disabled', label: 'Hide captions' },
  }

  const dataCyPrefix = controls[props.action].label
    .replaceAll(' ', '-')
    .toLowerCase()

  return (
    <Tooltip
      title={controls[props.action].label}
      slotProps={{ popper: { container: document.fullscreenElement ?? document.body } }}
    >
      <IconButton
        onClick={props.onClick}
        className={props.className}
        data-cy={`${dataCyPrefix}-button`}
        color="primary"
      >
        <Icon
          name={controls[props.action].symbol}
          className="rustic-icon-large"
        />
      </IconButton>
    </Tooltip>
  )
}
