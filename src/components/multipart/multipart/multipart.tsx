import '../../../index.css'
import './multipart.css'

import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import FilePreview from '../../filePreview/filePreview'
import MarkedMarkdown from '../../markdown'
import type { MultipartProps } from '../../types'
import DownloadButton from '../downloadButton'

/** The `Multipart` component is a versatile message format designed to accommodate both textual content and file attachments within a single message interface. */
export default function Multipart(props: MultipartProps) {
  function renderFiles() {
    const files = props.files.map((file, index) => {
      return (
        <FilePreview
          file={file}
          showFullName={props.showFullName}
          getAuthHeaders={props.getAuthHeaders}
          key={index}
        >
          {file.url && (
            <DownloadButton
              url={file.url}
              fileName={file.name}
              getAuthHeaders={props.getAuthHeaders}
            />
          )}
        </FilePreview>
      )
    })

    return <Box className="rustic-files">{files}</Box>
  }

  return (
    <Box className="rustic-multipart">
      {(props.title || props.description) && (
        <div>
          {props.title && <Typography variant="h6">{props.title}</Typography>}
          {props.description && <MarkedMarkdown text={props.description} />}
        </div>
      )}
      {props.text && <MarkedMarkdown text={props.text} />}
      {renderFiles()}
    </Box>
  )
}
