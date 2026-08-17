export const isMockApiEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'true'

export const apiBaseUrl = isMockApiEnabled ? '/api' : (import.meta.env.VITE_API_BASE_URL ?? '/api')
