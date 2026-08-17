import { http, HttpResponse } from 'msw'

import {
  mockChannels,
  mockConversations,
  mockMessages,
  mockNotifications,
  mockUsers
} from '@/mocks/data'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const chatHandlers = [
  http.get(`${apiBaseUrl}/users`, () => HttpResponse.json(mockUsers)),
  http.get(`${apiBaseUrl}/channels`, () => HttpResponse.json(mockChannels)),
  http.get(`${apiBaseUrl}/conversations`, () => HttpResponse.json(mockConversations)),
  http.get(`${apiBaseUrl}/notifications`, () => HttpResponse.json(mockNotifications)),
  http.get(`${apiBaseUrl}/conversations/:conversationId/messages`, ({ params }) => {
    const conversationMessages = mockMessages.filter(
      (message) => message.conversationId === params.conversationId
    )

    return HttpResponse.json(conversationMessages)
  }),
  http.get(`${apiBaseUrl}/search/messages`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase() ?? ''
    const results = mockMessages.filter((message) => message.body.toLowerCase().includes(query))

    return HttpResponse.json(results)
  })
]
