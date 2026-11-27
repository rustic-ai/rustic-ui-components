import Typography from '@mui/material/Typography'

import { formatDateAndTime } from '../helper'

export interface TimestampProps {
  /** Timestamp in ISO 8601 format. */
  timestamp: string
}

/** The `Timestamp` component is responsible for displaying a timestamp in a visually consistent and formatted manner. It takes an ISO 8601 formatted timestamp as input and utilizes helper functions to format and render the timestamp. */
const Timestamp = (props: TimestampProps) => {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      className="rustic-timestamp"
    >
      {formatDateAndTime(props.timestamp)}
    </Typography>
  )
}

export default Timestamp
