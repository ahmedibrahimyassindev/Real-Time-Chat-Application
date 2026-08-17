export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read' | 'failed'

export interface MessageReaction {
  emoji: string
  count: number
  userIds: string[]
}

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  previewUrl?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  body: string
  replyToMessageId?: string
  status: MessageDeliveryStatus
  reactions: MessageReaction[]
  attachments: Attachment[]
  createdAt: string
  updatedAt?: string
}
