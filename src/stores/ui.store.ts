import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    theme: 'dark' as 'light' | 'dark',
    isSidebarOpen: true
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
    }
  }
})
