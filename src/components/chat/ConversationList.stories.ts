import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ConversationList from './ConversationList.vue'

import { mockConversations } from '@/mocks/data'

const meta = {
  component: ConversationList,
  args: {
    conversations: mockConversations,
    activeConversationId: mockConversations[0].id
  }
} satisfies Meta<typeof ConversationList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
