import type { User } from '@/types/user'

export const mockUsers: User[] = [
  {
    id: 'user-ahmed',
    name: 'Ahmed Ibrahim',
    email: 'ahmed@example.com',
    status: 'online'
  },
  {
    id: 'user-sarah',
    name: 'Sarah Hassan',
    email: 'sarah@example.com',
    status: 'away'
  },
  {
    id: 'user-mohamed',
    name: 'Mohamed Ali',
    email: 'mohamed@example.com',
    status: 'busy'
  },
  {
    id: 'user-nour',
    name: 'Nour Samir',
    email: 'nour@example.com',
    status: 'offline'
  }
]

export const currentUserId = 'user-ahmed'
