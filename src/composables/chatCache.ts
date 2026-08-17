import type { InfiniteData, QueryClient } from '@tanstack/vue-query'

import type { MessagePage } from '@/api/messages.api'
import { queryKeys } from '@/queries/queryKeys'
import type { Conversation } from '@/types/conversation'
import type { Message } from '@/types/message'

export function updateConversationCache(
  queryClient: QueryClient,
  updater: (conversations: Conversation[]) => Conversation[]
) {
  queryClient.setQueryData<Conversation[]>(queryKeys.conversations.all, (cached = []) =>
    updater(cached)
  )
}

export function patchMessageInCache(
  queryClient: QueryClient,
  conversationId: string,
  messageId: string,
  updater: (message: Message) => Message
) {
  queryClient.setQueryData<InfiniteData<MessagePage>>(
    queryKeys.messages.conversation(conversationId),
    (cached) => {
      if (!cached) {
        return cached
      }

      return {
        ...cached,
        pages: cached.pages.map((page) => ({
          ...page,
          items: page.items.map((message) =>
            message.id === messageId ? updater(message) : message
          )
        }))
      }
    }
  )
}

export function replaceMessageInCache(
  queryClient: QueryClient,
  conversationId: string,
  replacement: Message
) {
  queryClient.setQueryData<InfiniteData<MessagePage>>(
    queryKeys.messages.conversation(conversationId),
    (cached) => {
      if (!cached) {
        return cached
      }

      return {
        ...cached,
        pages: cached.pages.map((page) => ({
          ...page,
          items: page.items.map((message) =>
            message.id === replacement.id ? replacement : message
          )
        }))
      }
    }
  )
}

export function removeMessageFromCache(
  queryClient: QueryClient,
  conversationId: string,
  messageId: string
) {
  queryClient.setQueryData<InfiniteData<MessagePage>>(
    queryKeys.messages.conversation(conversationId),
    (cached) => {
      if (!cached) {
        return cached
      }

      return {
        ...cached,
        pages: cached.pages.map((page) => ({
          ...page,
          items: page.items.filter((message) => message.id !== messageId)
        }))
      }
    }
  )
}

export function appendMessageToLatestPage(
  queryClient: QueryClient,
  conversationId: string,
  message: Message
) {
  queryClient.setQueryData<InfiniteData<MessagePage>>(
    queryKeys.messages.conversation(conversationId),
    (cached) => {
      if (!cached) {
        return {
          pageParams: [null],
          pages: [{ items: [message], nextCursor: null }]
        }
      }

      if (cached.pages.some((page) => page.items.some((item) => item.id === message.id))) {
        return cached
      }

      return {
        ...cached,
        pages: cached.pages.map((page, index) =>
          index === 0 ? { ...page, items: [...page.items, message] } : page
        )
      }
    }
  )
}
