import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import { useAuth } from '@/composables/useAuth'
import { useChatData } from '@/composables/useChatData'
import { useChatMessages } from '@/composables/useChatMessages'
import { useChatRealtime } from '@/composables/useChatRealtime'
import { useTyping } from '@/composables/useTyping'
import type { Attachment } from '@/types/message'

export function useChat() {
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()
  const { notifyTyping } = useTyping()
  const chatData = useChatData(queryClient)
  const chatMessages = useChatMessages({
    activeConversationId: chatData.activeConversationId,
    currentUser,
    queryClient
  })
  const chatRealtime = useChatRealtime({
    activeConversationId: chatData.activeConversationId,
    currentUser,
    queryClient,
    readMessage: chatMessages.readMessage
  })
  const activeTypingNames = computed(() =>
    chatData.chatStore.activeTypingUserIds
      .filter((userId) => userId !== currentUser.value?.id)
      .map((userId) => chatData.users.value.find((user) => user.id === userId)?.name)
      .filter(Boolean)
  )

  function sendMessage(body: string, attachments: Attachment[]) {
    chatMessages.sendMessage(body, attachments)
  }

  function handleTyping() {
    if (!currentUser.value || !chatData.activeConversationId.value) {
      return
    }

    notifyTyping(chatData.activeConversationId.value, currentUser.value.id)
  }

  return {
    activeConversation: chatData.activeConversation,
    activeConversationId: chatData.activeConversationId,
    activeMessages: chatMessages.activeMessages,
    activeTypingNames,
    allMessages: chatMessages.allMessages,
    chatStore: chatData.chatStore,
    conversations: chatData.conversations,
    currentUser,
    deleteActiveMessage: chatMessages.deleteActiveMessage,
    editMessage: chatMessages.editMessage,
    fetchOlderMessages: chatMessages.fetchOlderMessages,
    handleTyping,
    hasOlderMessages: chatMessages.hasOlderMessages,
    isConnected: chatRealtime.isConnected,
    onlineMembersCount: chatData.onlineMembersCount,
    reactToMessage: chatMessages.reactToMessage,
    replyToMessage: chatMessages.replyToMessage,
    retryMessage: chatMessages.retryMessage,
    selectConversation: chatData.selectConversation,
    sendMessage,
    simulateConnectionLoss: chatRealtime.simulateConnectionLoss,
    users: chatData.users
  }
}
