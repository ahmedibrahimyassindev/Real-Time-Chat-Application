import { mockWebSocketClient } from '@/mocks/websocket/mockWebSocket'
import type { Message } from '@/types/message'

interface ChatSimulationOptions {
  getConversationId: () => string
  onIncomingMessage?: (message: Message) => void
}

function createIncomingMessage(conversationId: string): Message {
  const senderId = conversationId === 'conversation-sarah' ? 'user-sarah' : 'user-mohamed'

  return {
    id: crypto.randomUUID(),
    conversationId,
    senderId,
    body:
      conversationId === 'conversation-sarah'
        ? 'I just reviewed the latest change.'
        : 'Real-time mock event received for this conversation.',
    status: 'delivered',
    reactions: [],
    attachments: [],
    createdAt: new Date().toISOString()
  }
}

export function startChatSimulation(options: ChatSimulationOptions) {
  function simulateIncomingActivity() {
    const conversationId = options.getConversationId()

    if (!conversationId) {
      return
    }

    const senderId = conversationId === 'conversation-sarah' ? 'user-sarah' : 'user-mohamed'

    mockWebSocketClient.emit({
      type: 'typing.started',
      payload: { conversationId, userId: senderId }
    })

    window.setTimeout(() => {
      const message = createIncomingMessage(conversationId)

      mockWebSocketClient.emit({
        type: 'typing.stopped',
        payload: { conversationId, userId: senderId }
      })
      mockWebSocketClient.emit({
        type: 'message.created',
        payload: message
      })
      mockWebSocketClient.emit({
        type: 'notification.created',
        payload: {
          id: crypto.randomUUID(),
          title: 'New message',
          body: 'A simulated real-time message was received.',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      })

      options.onIncomingMessage?.(message)
    }, 1600)
  }

  const timer = window.setInterval(simulateIncomingActivity, 14000)

  return () => {
    window.clearInterval(timer)
  }
}
