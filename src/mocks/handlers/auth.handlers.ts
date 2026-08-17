import { http, HttpResponse } from 'msw'

import { currentUserId, mockUsers } from '@/mocks/data'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const authHandlers = [
  http.post(`${apiBaseUrl}/auth/login`, () => {
    const user = mockUsers.find((mockUser) => mockUser.id === currentUserId)

    if (!user) {
      return HttpResponse.json({ message: 'Mock user not found' }, { status: 500 })
    }

    return HttpResponse.json({
      user,
      token: 'mock-access-token'
    })
  }),
  http.post(`${apiBaseUrl}/auth/register`, async ({ request }) => {
    const input = (await request.json()) as { name?: string; email?: string }

    return HttpResponse.json({
      user: {
        id: 'user-new',
        name: input.name ?? 'New User',
        email: input.email ?? 'new-user@example.com',
        status: 'online'
      },
      token: 'mock-access-token'
    })
  }),
  http.get(`${apiBaseUrl}/me`, () => {
    const user = mockUsers.find((mockUser) => mockUser.id === currentUserId)

    if (!user) {
      return HttpResponse.json({ message: 'Mock user not found' }, { status: 500 })
    }

    return HttpResponse.json(user)
  })
]
