import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageComposer from './MessageComposer.vue'

const meta = {
  component: MessageComposer,
  args: {
    replyToMessage: null
  }
} satisfies Meta<typeof MessageComposer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
