import type { InfiniteData, QueryClient } from '@tanstack/vue-query'
import { useMutation } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

import {
  createMessage,
  deleteMessage,
  markMessageRead,
  toggleMessageReaction,
  updateMessage,
  type MessagePage
} from '@/api/messages.api'
import {
  appendMessageToLatestPage,
  patchMessageInCache,
  removeMessageFromCache,
  replaceMessageInCache
} from '@/composables/chatCache'
import { queryKeys } from '@/queries/queryKeys'
import { useMessagesQuery } from '@/queries/useMessagesQuery'
import { useChatStore } from '@/stores/chat.store'
import type { Attachment, Message } from '@/types/message'
import type { User } from '@/types/user'

interface UseChatMessagesOptions {
  activeConversationId: Ref<string>
  currentUser: Ref<User | null>
  queryClient: QueryClient
}

export function useChatMessages(options: UseChatMessagesOptions) {
  const chatStore = useChatStore()
  const messagesQuery = useMessagesQuery(options.activeConversationId)
  const allMessages = computed(() =>
    (messagesQuery.data.value?.pages ?? [])
      .slice()
      .reverse()
      .flatMap((page) => page.items)
  )
  const activeMessages = computed(() => allMessages.value)
  const hasOlderMessages = computed(() => Boolean(messagesQuery.hasNextPage.value))
  const replyToMessage = computed(() =>
    allMessages.value.find((message) => message.id === chatStore.replyToMessageId)
  )

  const sendMessageMutation = useMutation({
    mutationFn: (input: { body: string; attachments: Attachment[] }) =>
      createMessage(options.activeConversationId.value, {
        senderId: options.currentUser.value?.id ?? '',
        body: input.body,
        replyToMessageId: chatStore.replyToMessageId ?? undefined,
        attachments: input.attachments
      }),
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
    onMutate: async (input) => {
      const conversationId = options.activeConversationId.value
      await options.queryClient.cancelQueries({
        queryKey: queryKeys.messages.conversation(conversationId)
      })

      const tempMessage: Message = {
        id: `optimistic-${crypto.randomUUID()}`,
        conversationId,
        senderId: options.currentUser.value?.id ?? '',
        body: input.body.trim(),
        replyToMessageId: chatStore.replyToMessageId ?? undefined,
        status: 'sending',
        reactions: [],
        attachments: input.attachments,
        createdAt: new Date().toISOString()
      }

      appendMessageToLatestPage(options.queryClient, conversationId, tempMessage)
      chatStore.setReplyTarget(null)

      return { conversationId, tempMessage }
    },
    onError: (_error, _input, context) => {
      if (context) {
        patchMessageInCache(
          options.queryClient,
          context.conversationId,
          context.tempMessage.id,
          (message) => ({ ...message, status: 'failed' })
        )
      }
    },
    onSuccess: (savedMessage, _input, context) => {
      if (context) {
        removeMessageFromCache(options.queryClient, context.conversationId, context.tempMessage.id)
      }

      appendMessageToLatestPage(options.queryClient, savedMessage.conversationId, savedMessage)
    },
    onSettled: (_data, _error, _input, context) => {
      if (context) {
        options.queryClient.invalidateQueries({
          queryKey: queryKeys.messages.conversation(context.conversationId)
        })
      }
      options.queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all })
    }
  })

  const editMessageMutation = useMutation({
    mutationFn: (input: { messageId: string; body: string }) =>
      updateMessage(input.messageId, input.body),
    onSuccess: (message) => {
      replaceMessageInCache(options.queryClient, message.conversationId, message)
    }
  })

  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onMutate: async (messageId) => {
      const conversationId = options.activeConversationId.value
      await options.queryClient.cancelQueries({
        queryKey: queryKeys.messages.conversation(conversationId)
      })
      const previousMessages = options.queryClient.getQueryData<InfiniteData<MessagePage>>(
        queryKeys.messages.conversation(conversationId)
      )

      removeMessageFromCache(options.queryClient, conversationId, messageId)

      return { conversationId, previousMessages }
    },
    onError: (_error, _messageId, context) => {
      if (context) {
        options.queryClient.setQueryData(
          queryKeys.messages.conversation(context.conversationId),
          context.previousMessages
        )
      }
    },
    onSettled: (_data, _error, _messageId, context) => {
      if (context) {
        options.queryClient.invalidateQueries({
          queryKey: queryKeys.messages.conversation(context.conversationId)
        })
      }
    }
  })

  const reactMessageMutation = useMutation({
    mutationFn: (input: { messageId: string; emoji: string; userId: string }) =>
      toggleMessageReaction(input.messageId, input.emoji, input.userId),
    onSuccess: (message) => {
      replaceMessageInCache(options.queryClient, message.conversationId, message)
    }
  })

  const readMessageMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: (message) => {
      replaceMessageInCache(options.queryClient, message.conversationId, message)
    }
  })

  function sendMessage(body: string, attachments: Attachment[]) {
    if (!options.currentUser.value || !options.activeConversationId.value) {
      return
    }

    sendMessageMutation.mutate({ body, attachments })
  }

  function retryMessage(messageId: string) {
    const failedMessage = allMessages.value.find(
      (message) => message.id === messageId && message.status === 'failed'
    )

    if (!failedMessage) {
      return
    }

    removeMessageFromCache(options.queryClient, failedMessage.conversationId, failedMessage.id)
    sendMessageMutation.mutate({
      body: failedMessage.body,
      attachments: failedMessage.attachments
    })
  }

  function editMessage(messageId: string, body: string) {
    editMessageMutation.mutate({ messageId, body })
  }

  function deleteActiveMessage(messageId: string) {
    deleteMessageMutation.mutate(messageId)
  }

  function reactToMessage(messageId: string, emoji: string) {
    if (!options.currentUser.value) {
      return
    }

    reactMessageMutation.mutate({
      messageId,
      emoji,
      userId: options.currentUser.value.id
    })
  }

  return {
    activeMessages,
    allMessages,
    deleteActiveMessage,
    editMessage,
    fetchOlderMessages: messagesQuery.fetchNextPage,
    hasOlderMessages,
    readMessage: readMessageMutation.mutate,
    reactToMessage,
    replyToMessage,
    retryMessage,
    sendMessage
  }
}
