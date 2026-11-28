import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import Icon from '../../icon/icon'

interface ViewerControlButtonProps {
  action: 'zoomIn' | 'zoomOut' | 'close' | 'previousPage' | 'nextPage'
  onClick: () => void
  className?: string
  isDisabled?: boolean
}

function ViewerControlButton(props: ViewerControlButtonProps) {
  const controls = {
    zoomIn: { symbol: 'zoom_in', label: 'Zoom in' },
    zoomOut: { symbol: 'zoom_out', label: 'Zoom out' },
    close: { symbol: 'close', label: 'Close' },
    previousPage: { symbol: 'arrow_back', label: 'Previous page' },
    nextPage: { symbol: 'arrow_forward', label: 'Next page' },
  }
  const dataCyPrefix = controls[props.action].label
    .replaceAll(' ', '-')
    .toLowerCase()
  const control = controls[props.action]

  return (
    <Tooltip title={control.label}>
      <span>
        <IconButton
          onClick={props.onClick}
          className={props.className}
          disabled={props.isDisabled}
          data-cy={`${dataCyPrefix}-button`}
        >
          <Icon name={control.symbol} />
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default ViewerControlButton
