import type { ComponentType } from 'react'

import PDFViewer, { setPdfWorkerSrc } from './pdfViewer'

setPdfWorkerSrc('files/pdf.worker.mjs')

export default {
  title: 'Rustic UI/PDF Viewer/PDF Viewer',
  component: PDFViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export const Default = {
  args: {
    getAuthHeader: () =>
      Promise.resolve({
        headers: {
          Authorization: 'Bearer example-token',
        },
      }),
    url: 'files/pdfExample.pdf',
  },
  decorators: [
    (Story: ComponentType) => {
      return (
        <div
          style={{
            width: 'clamp(250px, 90vw, 900px)',
            height: 'clamp(150px, 90vh, 800px)',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export const Error = {
  args: {
    url: 'wrongUrl.pdf',
  },
}
