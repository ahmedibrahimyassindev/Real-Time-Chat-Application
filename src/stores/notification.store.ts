import { defineStore } from 'pinia'

import { mockNotifications } from '@/mocks/data'
import type { Notification } from '@/types/notification'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [...mockNotifications] as Notification[]
  }),
  getters: {
    unreadCount: (state) =>
      state.notifications.filter((notification) => !notification.isRead).length
  },
  actions: {
    addNotification(notification: Notification) {
      if (this.notifications.some((item) => item.id === notification.id)) {
        return
      }

      this.notifications.unshift(notification)
    },
    markAsRead(notificationId: string) {
      const notification = this.notifications.find((item) => item.id === notificationId)

      if (notification) {
        notification.isRead = true
      }
    },
    markAllAsRead() {
      this.notifications.forEach((notification) => {
        notification.isRead = true
      })
    }
  }
})
