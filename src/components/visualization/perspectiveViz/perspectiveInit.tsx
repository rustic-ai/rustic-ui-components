import type { Client } from '@finos/perspective'
import perspective from '@finos/perspective'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as SERVER_WASM from '@finos/perspective/dist/wasm/perspective-server.wasm'
import perspective_viewer from '@finos/perspective-viewer'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as CLIENT_WASM from '@finos/perspective-viewer/dist/wasm/perspective-viewer.wasm'

let initPromise: Promise<void>
export let globalPerspectiveWorker: Client

export function initPerspective() {
  if (initPromise) {
    return initPromise
  }

  initPromise = Promise.all([
    perspective.init_server(SERVER_WASM),
    perspective_viewer.init_client(CLIENT_WASM as any),
  ])
    .then(() => perspective.worker())
    .then((worker: Client) => {
      globalPerspectiveWorker = worker
    })

  return initPromise
}
