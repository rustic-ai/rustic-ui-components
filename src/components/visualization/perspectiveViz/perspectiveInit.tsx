import perspective, { type Client } from '@perspective-dev/client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SERVER_WASM from '@perspective-dev/server/dist/wasm/perspective-server.wasm'
import perspective_viewer from '@perspective-dev/viewer'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CLIENT_WASM from '@perspective-dev/viewer/dist/wasm/perspective-viewer.wasm'

let initPromise: Promise<void>
export let globalPerspectiveWorker: Client

export function initPerspective() {
  if (initPromise) {
    return initPromise
  }

  initPromise = Promise.all([
    perspective.init_server(SERVER_WASM as any),
    perspective_viewer.init_client(CLIENT_WASM as any),
  ])
    .then(() => perspective.worker())
    .then((worker: Client) => {
      globalPerspectiveWorker = worker
    })

  return initPromise
}
