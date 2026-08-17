export interface Message {
  id: string
  conversationId: string
  senderId: string
  body: string
  createdAt: string
  updatedAt?: string
}
