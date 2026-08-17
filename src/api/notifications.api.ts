import { http } from './http'

import type { Notification } from '@/types/notification'

export async function getNotifications() {
  const response = await http.get<Notification[]>('/notifications')
  return response.data
}
