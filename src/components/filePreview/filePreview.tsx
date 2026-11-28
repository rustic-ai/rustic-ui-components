import './filePreview.css'
import '../../index.css'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type React from 'react';
import { useState } from 'react'

import { shortenString } from '../helper'
import Icon from '../icon/icon'
import PDFViewer from '../pdfViewer/pdfViewer'
import type { FileData, GetAuthHeaders } from '../types'

type ViewerComponent = React.ComponentType<{
  url: string
  getAuthHeaders?: GetAuthHeaders
}>

export interface FilePreviewProps {
  file: FileData
  supportedViewers?: {
    [key: string]: ViewerComponent
  }
  showFullName?: boolean
  getAuthHeaders?: GetAuthHeaders
}

const defaultSupportedViewers: {
  [key: string]: ViewerComponent
} = {
  pdf: PDFViewer,
  // Add more mappings as needed for different file types
}

export default function FilePreview({
  supportedViewers = defaultSupportedViewers,
  showFullName = true,
  ...props
}: React.PropsWithChildren<FilePreviewProps>) {
  const theme = useTheme()
  const maximumFileNameLength = 15

  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleFileClick() {
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }

  function getFileType(url: string): string {
    const splittedUrl = url.split('.')
    const extension = splittedUrl[splittedUrl.length - 1].toLowerCase()
    return extension
  }

  const fileType = props.file.url && getFileType(props.file.url)
  const ModalContentComponent =
    fileType && supportedViewers ? supportedViewers[fileType] : null
  const hasModalContent = !!ModalContentComponent

  const filePreviewWidthStyle = showFullName
    ? 'rustic-flexible-file-preview-width'
    : 'rustic-fixed-file-preview-width'
  const filePreviewCursorStyle = hasModalContent ? ' rustic-cursor-pointer' : ''
  const FilePreviewClassName = `rustic-file-preview ${filePreviewWidthStyle}${filePreviewCursorStyle}`

  const fileName = showFullName
    ? props.file.name
    : shortenString(props.file.name, maximumFileNameLength)

  return (
    <>
      <Card
        className={FilePreviewClassName}
        data-cy="file-preview"
        variant="outlined"
        sx={{ boxShadow: theme.shadows[1] }}
        onClick={handleFileClick}
      >
        <Typography
          variant="subtitle2"
          data-cy="file-name"
          className="rustic-file-preview-name"
        >
          {fileName}
        </Typography>
        <div onClick={(e) => e.stopPropagation()}>{props.children}</div>
      </Card>

      {hasModalContent && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          className="rustic-file-preview-modal"
        >
          <div className="rustic-modal-content">
            <Tooltip title="Close">
              <IconButton
                onClick={handleCloseModal}
                className="rustic-close-button"
                data-cy="viewer-close-button"
              >
                <Icon name="close" />
              </IconButton>
            </Tooltip>
            {props.file.url && (
              <ModalContentComponent
                url={props.file.url}
                getAuthHeaders={props.getAuthHeaders}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
