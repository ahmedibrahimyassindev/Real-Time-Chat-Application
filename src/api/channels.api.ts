import { http } from './http'

import type { Channel } from '@/types/channel'

export async function getChannels() {
  const response = await http.get<Channel[]>('/channels')
  return response.data
}
