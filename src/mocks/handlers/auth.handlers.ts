import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/config/api'
import { currentUserId, mockUsers } from '@/mocks/data'

export const authHandlers = [
  http.post(`${apiBaseUrl}/auth/login`, () => {
    const user = mockUsers.find((mockUser) => mockUser.id === currentUserId)

    if (!user) {
      return HttpResponse.json({ message: 'Mock user not found' }, { status: 500 })
    }

    return HttpResponse.json({
      user,
      accessToken: 'mock-access-token'
    })
  }),
  http.post(`${apiBaseUrl}/auth/register`, async ({ request }) => {
    const input = (await request.json()) as { name?: string; email?: string }

    return HttpResponse.json({
      user: {
        id: 'user-new',
        name: input.name ?? 'New User',
        email: input.email ?? 'new-user@example.com',
        avatarUrl: null,
        status: 'online'
      },
      accessToken: 'mock-access-token'
    })
  }),
  http.get(`${apiBaseUrl}/users/me`, () => {
    const user = mockUsers.find((mockUser) => mockUser.id === currentUserId)

    if (!user) {
      return HttpResponse.json({ message: 'Mock user not found' }, { status: 500 })
    }

    return HttpResponse.json(user)
  })
]
