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

  // Perspective 5 only registers the binaries here and downloads them on the
  // first worker() call. The bundler resolves the .wasm imports to URLs.
  perspective.init_server(() => fetch(SERVER_WASM as string))
  perspective_viewer.init_client(fetch(CLIENT_WASM as string))

  initPromise = perspective.worker().then((worker: Client) => {
    globalPerspectiveWorker = worker
  })

  return initPromise
}
