<script setup lang="ts">
import { LogIn } from '@lucide/vue'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { loginSchema } from '@/schemas/auth.schema'

const route = useRoute()
const router = useRouter()
const { login, isLoading, errorMessage } = useAuth()
const validationMessage = ref('')
const form = reactive({
  email: 'ahmed@example.com',
  password: 'Password123!'
})

async function submitLogin() {
  validationMessage.value = ''
  const result = loginSchema.safeParse(form)

  if (!result.success) {
    validationMessage.value = result.error.issues[0]?.message ?? 'Enter valid login details.'
    return
  }

  await login(result.data)
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/chat'
  await router.push(redirect)
}
</script>

<template>
  <AuthLayout title="Login">
    <form class="space-y-4" @submit.prevent="submitLogin">
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
          autocomplete="current-password"
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
        <LogIn class="size-4" />
        <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
      </button>

      <p class="text-center text-sm text-slate-400">
        Need an account?
        <RouterLink class="font-medium text-cyan-300 hover:text-cyan-200" to="/register">
          Register
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
