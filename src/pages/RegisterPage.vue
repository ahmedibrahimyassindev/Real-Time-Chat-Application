<script setup lang="ts">
import { UserPlus } from '@lucide/vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { registerSchema } from '@/schemas/auth.schema'

const router = useRouter()
const { register, isLoading, errorMessage } = useAuth()
const validationMessage = ref('')
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function submitRegistration() {
  validationMessage.value = ''
  const result = registerSchema.safeParse(form)

  if (!result.success) {
    validationMessage.value = result.error.issues[0]?.message ?? 'Enter valid registration details.'
    return
  }

  await register(result.data)
  await router.push({ name: 'chat' })
}
</script>

<template>
  <AuthLayout title="Register">
    <form class="space-y-4" @submit.prevent="submitRegistration">
      <label class="block">
        <span class="text-sm font-medium text-slate-300">Name</span>
        <input
          v-model="form.name"
          class="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          type="text"
          autocomplete="name"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-300">Email</span>
        <input
          v-model="form.email"
          class="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          type="email"
          autocomplete="email"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-300">Password</span>
        <input
          v-model="form.password"
          class="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          type="password"
          autocomplete="new-password"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-300">Confirm password</span>
        <input
          v-model="form.confirmPassword"
          class="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          type="password"
          autocomplete="new-password"
        />
      </label>

      <p v-if="validationMessage || errorMessage" class="text-sm text-red-300">
        {{ validationMessage || errorMessage }}
      </p>

      <button
        class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        :disabled="isLoading"
      >
        <UserPlus class="size-4" />
        <span>{{ isLoading ? 'Creating account...' : 'Create account' }}</span>
      </button>

      <p class="text-center text-sm text-slate-400">
        Already registered?
        <RouterLink class="font-medium text-cyan-300 hover:text-cyan-200" to="/login">
          Sign in
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
