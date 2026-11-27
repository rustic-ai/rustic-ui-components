import { useState } from 'react'

import type { MediaControls } from './commonControls'
import { MediaIconButton } from './mediaIconButton'

interface FullscreenButtonProps {
  element: HTMLElement
  onError: (errorMessage: string) => void
}

interface MiniPlayerButtonProps extends MediaControls {
  onError: (errorMessage: string) => void
}

export function MiniPlayerButton(props: MiniPlayerButtonProps) {
  const [isMiniPlayer, setIsMiniPlayer] = useState(
    !!document.pictureInPictureElement
  )

  const videoElement = props.mediaElement as HTMLVideoElement

  const action = isMiniPlayer ? 'miniPlayerExit' : 'miniPlayer'

  function handleMiniPlayer() {
    if (isMiniPlayer) {
      document
        .exitPictureInPicture()
        .then(() => {
          setIsMiniPlayer(false)
        })
        .catch((error: DOMException) => {
          props.onError(`Failed to exit mini player. Error: ${error.message}`)
        })
    } else {
      videoElement
        .requestPictureInPicture()
        .then(() => {
          setIsMiniPlayer(true)
        })
        .catch((error: DOMException) => {
          props.onError(`Failed to enter mini player. Error: ${error.message}`)
        })
    }
  }

  // State is updated by event listeners so that the icon is displayed correctly, even when users exit picture-in-picture without direct use of this toggle (e.g. exiting from the picture-in-picture window).
  videoElement.onleavepictureinpicture = function () {
    setIsMiniPlayer(false)
  }

  return <MediaIconButton onClick={handleMiniPlayer} action={action} />
}

export function FullscreenButton(props: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

  const videoContainer = props.element

  const action = isFullscreen ? 'fullscreenExit' : 'fullscreen'

  function handleFullscreen() {
    if (isFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false)
        })
        .catch((error: TypeError) => {
          props.onError(
            `Failed to exit fullscreen mode. Error: ${error.message}`
          )
        })
    } else {
      videoContainer
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((error: TypeError) => {
          props.onError(
            `Failed to enter fullscreen mode. Error: ${error.message}`
          )
        })
    }
  }

  // State is updated by event listeners so that the icon is displayed correctly, even when fullscreen is exited without direct use of this toggle (e.g. exiting from fullscreen by pressing Esc).
  videoContainer.onfullscreenchange = function () {
    setIsFullscreen(!!document.fullscreenElement)
  }

  return <MediaIconButton onClick={handleFullscreen} action={action} />
}
