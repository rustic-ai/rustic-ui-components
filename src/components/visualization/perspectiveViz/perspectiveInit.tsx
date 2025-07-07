import type { Client } from '@finos/perspective'
import * as perspective from '@finos/perspective'
import * as SERVER_WASM from '@finos/perspective/dist/wasm/perspective-server.wasm'
import perspective_viewer from '@finos/perspective-viewer'
import * as CLIENT_WASM from '@finos/perspective-viewer/dist/wasm/perspective-viewer.wasm'

export let globalPerspectiveWorker: Client

const perspectiveInitPromise = Promise.all([
  perspective.init_server(SERVER_WASM),
  perspective_viewer.init_client(CLIENT_WASM as any),
])

export function initPerspective(): void {
  perspectiveInitPromise.then(() =>
    perspective.worker().then((worker: Client) => {
      globalPerspectiveWorker = worker
    })
  )
}
