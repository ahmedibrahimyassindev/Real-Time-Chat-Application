import type { Channel } from '@/types/channel'

export const mockChannels: Channel[] = [
  {
    id: 'channel-general',
    name: 'general',
    description: 'Team-wide updates and daily coordination.',
    isPrivate: false,
    memberIds: ['user-ahmed', 'user-sarah', 'user-mohamed', 'user-nour']
  },
  {
    id: 'channel-frontend',
    name: 'frontend',
    description: 'UI architecture, components, and review notes.',
    isPrivate: false,
    memberIds: ['user-ahmed', 'user-sarah']
  },
  {
    id: 'channel-release',
    name: 'release-room',
    description: 'Private coordination for release readiness.',
    isPrivate: true,
    memberIds: ['user-ahmed', 'user-mohamed']
  },
  {
    id: 'channel-design',
    name: 'design',
    description: 'Design review and product feedback.',
    isPrivate: false,
    memberIds: ['user-sarah', 'user-nour']
  }
]
