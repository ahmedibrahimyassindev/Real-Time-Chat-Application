import { authHandlers } from './auth.handlers'
import { chatHandlers } from './chat.handlers'

export const handlers = [...authHandlers, ...chatHandlers]
