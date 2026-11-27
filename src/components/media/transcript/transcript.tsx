import './transcript.css'

import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'

interface TranscriptProps {
  transcript: string
}

export default function Transcript(props: TranscriptProps) {
  const isFullscreen = !!document.fullscreenElement

  return (
    <Box className="rustic-transcript-container">
      {!isFullscreen && <Divider orientation="vertical" flexItem />}
      <Typography
        className="rustic-transcript-content"
        data-cy="transcript"
        variant="body2"
      >
        {props.transcript}
      </Typography>
    </Box>
  )
}
