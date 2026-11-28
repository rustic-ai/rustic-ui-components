import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import Icon from '../icon/icon'
import type { GetAuthHeaders } from '../types'

type DownloadButtonProps = {
  url: string
  fileName: string
  getAuthHeaders?: GetAuthHeaders
}

export default function DownloadButton(props: DownloadButtonProps) {
  function handleAuthenticatedDownload(getHeadersFn: GetAuthHeaders) {
    getHeadersFn()
      .then((headersObj) => {
        return fetch(props.url, { ...headersObj })
      })
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob)
        const temporaryLink = document.createElement('a')
        temporaryLink.href = downloadUrl
        temporaryLink.download = props.fileName
        document.body.appendChild(temporaryLink)
        temporaryLink.click()

        document.body.removeChild(temporaryLink)
        window.URL.revokeObjectURL(downloadUrl)
      })
      .catch((error) => {
        throw new Error('Error downloading file. ' + error.message)
      })
  }

  return (
    <Tooltip title="Download" className="rustic-shift-to-right-by-8">
      {props.getAuthHeaders ? (
        <IconButton
          onClick={() => handleAuthenticatedDownload(props.getAuthHeaders!)}
          data-cy="download-button"
        >
          <Icon name="download" />
        </IconButton>
      ) : (
        <IconButton
          component="a"
          href={props.url}
          download={props.fileName}
          data-cy="download-button"
        >
          <Icon name="download" />
        </IconButton>
      )}
    </Tooltip>
  )
}
