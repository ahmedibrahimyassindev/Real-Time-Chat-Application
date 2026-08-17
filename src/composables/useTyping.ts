import { mockWebSocketClient } from '@/mocks/websocket/mockWebSocket'
import { emitTypingEvent } from '@/composables/useWebSocket'

const shouldUseMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true'

export function useTyping() {
  let stopTypingTimer: number | undefined

  function notifyTyping(conversationId: string, userId: string) {
    if (!shouldUseMocks) {
      emitTypingEvent('typing.start', conversationId)

      window.clearTimeout(stopTypingTimer)
      stopTypingTimer = window.setTimeout(() => {
        emitTypingEvent('typing.stop', conversationId)
      }, 900)
      return
    }

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
