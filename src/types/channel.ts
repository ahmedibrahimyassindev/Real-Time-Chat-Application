export interface Channel {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  memberIds: string[]
}
