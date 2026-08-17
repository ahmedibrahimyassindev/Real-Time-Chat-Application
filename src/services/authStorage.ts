const authTokenStorageKey = 'realtime-chat.auth-token'

export const authStorage = {
  getToken() {
    return localStorage.getItem(authTokenStorageKey)
  },
  setToken(token: string) {
    localStorage.setItem(authTokenStorageKey, token)
  },
  removeToken() {
    localStorage.removeItem(authTokenStorageKey)
  }
}
