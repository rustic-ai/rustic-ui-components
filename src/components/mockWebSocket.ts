import { WebSocket } from 'mock-socket'

import type { Message, WebSocketClient } from './types'

export function getMockWebSocketClient(webSocketUrl: string): WebSocketClient {
  let ws: WebSocket | null = null
  const connect = (): WebSocket => {
    const socket = new WebSocket(webSocketUrl)
    socket.onopen = () => {}

    return socket
  }
  ws = connect()
  return {
    send: (message: Message) => {
      if (ws) {
        ws.send(JSON.stringify(message))
      }
    },
    close: () => {
      if (ws) {
        ws.close()
      }
    },
    reconnect: () => {
      if (ws && ws.readyState === WebSocket.CLOSED) {
        ws = connect()
      }
    },
    onReceive: (handler: (message: Message) => void) => {
      if (ws) {
        ws.onmessage = (event) => {
          const receivedMessage = JSON.parse(event.data)
          handler(receivedMessage)
        }
      }
    },
  }
}
