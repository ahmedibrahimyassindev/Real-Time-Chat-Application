import { http, HttpResponse } from 'msw'

import { mockDatabase } from '@/mocks/data'
import type { Attachment } from '@/types/message'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const chatHandlers = [
  http.get(`${apiBaseUrl}/users`, () => HttpResponse.json(mockDatabase.users)),
  http.get(`${apiBaseUrl}/channels`, () => HttpResponse.json(mockDatabase.channels)),
  http.post(`${apiBaseUrl}/channels`, async ({ request }) => {
    const input = (await request.json()) as {
      name: string
      description?: string
      isPrivate: boolean
      userId: string
    }
    const normalizedName = input.name.trim().replace(/^#/, '').toLowerCase().replace(/\s+/g, '-')

    if (!normalizedName) {
      return HttpResponse.json({ error: 'INVALID_NAME' }, { status: 422 })
    }

    if (mockDatabase.channels.some((channel) => channel.name === normalizedName)) {
      return HttpResponse.json({ error: 'CHANNEL_ALREADY_EXISTS' }, { status: 409 })
    }

    const channel = {
      id: crypto.randomUUID(),
      name: normalizedName,
      description: input.description?.trim(),
      isPrivate: input.isPrivate,
      memberIds: [input.userId]
    }
    const conversation = {
      id: `conversation-${channel.id}`,
      type: 'channel' as const,
      title: `#${channel.name}`,
      memberIds: channel.memberIds,
      channelId: channel.id,
      unreadCount: 0,
      updatedAt: new Date().toISOString()
    }

    mockDatabase.channels.push(channel)
    mockDatabase.conversations.push(conversation)

    return HttpResponse.json({ channel, conversation }, { status: 201 })
  }),
  http.patch(`${apiBaseUrl}/channels/:channelId`, async ({ params, request }) => {
    const input = (await request.json()) as {
      name: string
      description?: string
      isPrivate: boolean
    }
    const channel = mockDatabase.channels.find((item) => item.id === params.channelId)

    if (!channel) {
      return HttpResponse.json({ error: 'CHANNEL_NOT_FOUND' }, { status: 404 })
    }

    channel.name = input.name.trim().replace(/^#/, '').toLowerCase().replace(/\s+/g, '-')
    channel.description = input.description?.trim()
    channel.isPrivate = input.isPrivate

    const conversation = mockDatabase.conversations.find((item) => item.channelId === channel.id)

    if (conversation) {
      conversation.title = `#${channel.name}`
    }

    return HttpResponse.json(channel)
  }),
  http.patch(`${apiBaseUrl}/channels/:channelId/members`, async ({ params, request }) => {
    const input = (await request.json()) as { memberIds: string[] }
    const channel = mockDatabase.channels.find((item) => item.id === params.channelId)

    if (!channel) {
      return HttpResponse.json({ error: 'CHANNEL_NOT_FOUND' }, { status: 404 })
    }

    channel.memberIds = input.memberIds
    const conversation = mockDatabase.conversations.find((item) => item.channelId === channel.id)

    if (conversation) {
      conversation.memberIds = input.memberIds
    }

    return HttpResponse.json(channel)
  }),
  http.get(`${apiBaseUrl}/conversations`, () => HttpResponse.json(mockDatabase.conversations)),
  http.get(`${apiBaseUrl}/notifications`, () => HttpResponse.json(mockDatabase.notifications)),
  http.patch(`${apiBaseUrl}/notifications/:notificationId/read`, ({ params }) => {
    const notification = mockDatabase.notifications.find(
      (item) => item.id === params.notificationId
    )

    if (!notification) {
      return HttpResponse.json({ error: 'NOTIFICATION_NOT_FOUND' }, { status: 404 })
    }

    notification.isRead = true
    return HttpResponse.json(notification)
  }),
  http.patch(`${apiBaseUrl}/notifications/read-all`, () => {
    mockDatabase.notifications.forEach((notification) => {
      notification.isRead = true
    })

    return HttpResponse.json(mockDatabase.notifications)
  }),
  http.get(`${apiBaseUrl}/conversations/:conversationId/messages`, ({ params, request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? 4)
    const conversationMessages = mockDatabase.messages
      .filter((message) => message.conversationId === params.conversationId)
      .sort(
        (first, second) =>
          new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
      )
    const end = Number(url.searchParams.get('cursor') ?? conversationMessages.length)
    const start = Math.max(end - limit, 0)
    const items = conversationMessages.slice(start, end)
    const nextCursor = start > 0 ? String(start) : null

    return HttpResponse.json({ items, nextCursor })
  }),
  http.post(`${apiBaseUrl}/conversations/:conversationId/messages`, async ({ params, request }) => {
    const input = (await request.json()) as {
      senderId: string
      body: string
      replyToMessageId?: string
      attachments?: Attachment[]
    }
    const now = new Date().toISOString()
    const message = {
      id: crypto.randomUUID(),
      conversationId: String(params.conversationId),
      senderId: input.senderId,
      body: input.body.trim(),
      replyToMessageId: input.replyToMessageId,
      status: 'sent' as const,
      reactions: [],
      attachments: input.attachments ?? [],
      createdAt: now
    }

    mockDatabase.messages.push(message)

    const conversation = mockDatabase.conversations.find(
      (item) => item.id === params.conversationId
    )

    if (conversation) {
      conversation.lastMessageId = message.id
      conversation.updatedAt = now
    }

    return HttpResponse.json(message, { status: 201 })
  }),
  http.patch(`${apiBaseUrl}/messages/:messageId`, async ({ params, request }) => {
    const input = (await request.json()) as { body: string }
    const message = mockDatabase.messages.find((item) => item.id === params.messageId)

    if (!message) {
      return HttpResponse.json({ error: 'MESSAGE_NOT_FOUND' }, { status: 404 })
    }

    message.body = input.body.trim()
    message.updatedAt = new Date().toISOString()

    return HttpResponse.json(message)
  }),
  http.delete(`${apiBaseUrl}/messages/:messageId`, ({ params }) => {
    mockDatabase.messages = mockDatabase.messages.filter(
      (message) => message.id !== params.messageId
    )

    return new HttpResponse(null, { status: 204 })
  }),
  http.patch(`${apiBaseUrl}/messages/:messageId/read`, ({ params }) => {
    const message = mockDatabase.messages.find((item) => item.id === params.messageId)

    if (!message) {
      return HttpResponse.json({ error: 'MESSAGE_NOT_FOUND' }, { status: 404 })
    }

    message.status = 'read'
    return HttpResponse.json(message)
  }),
  http.patch(`${apiBaseUrl}/messages/:messageId/reactions`, async ({ params, request }) => {
    const input = (await request.json()) as { emoji: string; userId: string }
    const message = mockDatabase.messages.find((item) => item.id === params.messageId)

    if (!message) {
      return HttpResponse.json({ error: 'MESSAGE_NOT_FOUND' }, { status: 404 })
    }

    const reaction = message.reactions.find((item) => item.emoji === input.emoji)

    if (!reaction) {
      message.reactions.push({ emoji: input.emoji, count: 1, userIds: [input.userId] })
      return HttpResponse.json(message)
    }

    if (reaction.userIds.includes(input.userId)) {
      reaction.userIds = reaction.userIds.filter((userId) => userId !== input.userId)
      reaction.count = reaction.userIds.length
      message.reactions = message.reactions.filter((item) => item.count > 0)
      return HttpResponse.json(message)
    }

    reaction.userIds.push(input.userId)
    reaction.count = reaction.userIds.length

    return HttpResponse.json(message)
  }),
  http.get(`${apiBaseUrl}/search/messages`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase() ?? ''
    const results = mockDatabase.messages.filter((message) =>
      message.body.toLowerCase().includes(query)
    )

    return HttpResponse.json(results)
  })
]
