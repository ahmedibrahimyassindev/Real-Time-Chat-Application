import { mockWebSocketClient } from '@/mocks/websocket/mockWebSocket'

export function useTyping() {
  let stopTypingTimer: number | undefined

  function notifyTyping(conversationId: string, userId: string) {
    mockWebSocketClient.emit({
      type: 'typing.started',
      payload: { conversationId, userId }
    })

    window.clearTimeout(stopTypingTimer)
    stopTypingTimer = window.setTimeout(() => {
      mockWebSocketClient.emit({
        type: 'typing.stopped',
        payload: { conversationId, userId }
      })
    }, 900)
  }

  function stopTyping() {
    window.clearTimeout(stopTypingTimer)
  }

  return {
    notifyTyping,
    stopTyping
  }
}
