import './sound.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'

import MarkedMarkdown from '../../markdown/markedMarkdown'
import type { AudioFormat } from '../../types'
import {
  MoveTenSecondsButton,
  PlaybackRateButton,
  PlayOrPauseButton,
  ProgressSlider,
  ToggleTranscriptButton,
  VolumeSettings,
} from '../controls/commonControls'
import { MediaIconButton } from '../controls/mediaIconButton'
import TimeIndicator from '../timeIndicator/timeIndicator'
import Transcript from '../transcript/transcript'

/** The `Sound` component is an audio player designed for playing audio files in web applications. It provides controls for playback, volume adjustment, and playback rate modification. The component is suitable for embedding audio content with accompanying transcripts, making it accessible and user-friendly. */
export default function Sound(props: AudioFormat) {
  const [isTranscriptShown, setIsTranscriptShown] = useState(false)
  const [areCaptionsShown, setAreCaptionsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [loadingErrorMessage, setLoadingErrorMessage] = useState('')
  const [controlErrorMessage, setControlErrorMessage] = useState('')

  const theme = useTheme()
  const audioRef = useRef<HTMLVideoElement>(null)

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    function updateElapsedTime() {
      if (audioRef.current) {
        setElapsedTime(audioRef.current.currentTime)
      }
    }
    function handleCanPlay() {
      setLoadingErrorMessage('')
      setIsLoading(false)
    }
    function handleError(errorMessage: string) {
      setLoadingErrorMessage(errorMessage)
    }

    audioRef.current?.addEventListener('timeupdate', updateElapsedTime)
    audioRef.current?.addEventListener('canplay', handleCanPlay)
    audioRef.current?.addEventListener('error', () =>
      handleError('Failed to load the audio.')
    )
    audioRef.current?.addEventListener('stalled', () =>
      handleError('Failed to fetch audio data, but trying.')
    )
  }, [])

  function renderTitle() {
    return (
      <Typography
        variant="h6"
        className="rustic-sound-title"
        data-cy="sound-player-title"
      >
        {props.title}
      </Typography>
    )
  }

  function renderCaptionsToggle() {
    if (props.captions && props.captions.length > 0) {
      const action = areCaptionsShown ? 'captionsOff' : 'captionsOn'

      return (
        <MediaIconButton
          action={action}
          onClick={() => setAreCaptionsShown(!areCaptionsShown)}
        />
      )
    }
  }

  function renderTimeControls() {
    if (audioRef.current) {
      return (
        <Box className="rustic-time-controls">
          <MoveTenSecondsButton
            mediaElement={audioRef.current}
            movement="replay"
          />
          <PlayOrPauseButton
            mediaElement={audioRef.current}
            onError={setControlErrorMessage}
          />
          <MoveTenSecondsButton
            mediaElement={audioRef.current}
            movement="forward"
          />
        </Box>
      )
    }
  }

  function renderTranscript() {
    if (props.transcript && isTranscriptShown) {
      return <Transcript transcript={props.transcript} />
    }
  }

  function renderTranscriptToggle() {
    if (props.transcript) {
      return (
        <ToggleTranscriptButton
          isTranscriptVisible={isTranscriptShown}
          setIsTranscriptVisible={() =>
            setIsTranscriptShown(!isTranscriptShown)
          }
        />
      )
    }
  }

  function renderMobileView() {
    if (audioRef.current) {
      return (
        <Box className="rustic-sound-controls">
          <TimeIndicator
            elapsedTimeInSeconds={elapsedTime}
            durationTimeInSeconds={audioRef.current.duration}
            style="wide"
          />
          <ProgressSlider mediaElement={audioRef.current} />
          {renderTitle()}
          {props.description && <MarkedMarkdown text={props.description} />}
          <Box className="rustic-sound-bottom-controls">
            <Box className="rustic-sound-bottom-controls-left">
              {renderTimeControls()}
            </Box>

            <VolumeSettings mediaElement={audioRef.current} />

            <Box className="rustic-sound-bottom-controls-right">
              {renderTranscriptToggle()}

              <Box>
                {renderCaptionsToggle()}
                <PlaybackRateButton mediaElement={audioRef.current} />
              </Box>
            </Box>
          </Box>

          {renderTranscript()}
        </Box>
      )
    }
  }

  function renderDesktopView() {
    if (audioRef.current) {
      return (
        <>
          {renderTitle()}
          {props.description && <MarkedMarkdown text={props.description} />}

          <Box className="rustic-sound-controls">
            <ProgressSlider mediaElement={audioRef.current} />

            <Box className="rustic-sound-bottom-controls">
              <Box className="rustic-sound-bottom-controls-left">
                {renderTimeControls()}
                {renderCaptionsToggle()}

                <PlaybackRateButton mediaElement={audioRef.current} />
                <VolumeSettings mediaElement={audioRef.current} />
                <TimeIndicator
                  elapsedTimeInSeconds={elapsedTime}
                  durationTimeInSeconds={audioRef.current.duration}
                  style="condensed"
                />
              </Box>

              <Box className="rustic-sound-bottom-controls-right">
                {renderTranscriptToggle()}
              </Box>
            </Box>

            {renderTranscript()}
          </Box>
        </>
      )
    }
  }

  function renderVideoElement() {
    return (
      <video
        src={props.src}
        data-cy="audio-element"
        ref={audioRef}
        className={areCaptionsShown ? 'rustic-has-captions' : ''}
      >
        {areCaptionsShown && (
          <track src={props.captions} kind="captions" default />
        )}
      </video>
    )
  }

  const renderControls = isMobile ? renderMobileView : renderDesktopView

  // React 19 drops an empty src attribute, so the media element never fires
  // the error event that used to report a missing source.
  const errorMessage = props.src
    ? loadingErrorMessage
    : 'Failed to load the audio.'

  if (errorMessage.length > 0) {
    return (
      <Alert severity="error" data-cy="loading-error">
        {errorMessage}
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Box className="rustic-sound" data-cy="audio">
        {renderVideoElement()}
        <CircularProgress data-cy="spinner" />
      </Box>
    )
  }

  return (
    <Box className="rustic-sound" data-cy="audio">
      {renderVideoElement()}
      {renderControls()}
      {controlErrorMessage.length > 0 && (
        <Alert
          severity="error"
          data-cy="control-error"
          className="rustic-control-error"
          onClose={() => setControlErrorMessage('')}
        >
          {controlErrorMessage}
        </Alert>
      )}
    </Box>
  )
}
