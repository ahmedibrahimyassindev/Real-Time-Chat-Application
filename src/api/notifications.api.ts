import { http } from './http'

import type { Notification } from '@/types/notification'

export async function getNotifications() {
  const response = await http.get<Notification[]>('/notifications')
  return response.data
}

export async function markNotificationRead(notificationId: string) {
  const response = await http.patch<Notification>(`/notifications/${notificationId}/read`)
  return response.data
}

export async function markAllNotificationsRead() {
  const response = await http.patch<Notification[]>('/notifications/read-all')
  return response.data
}
