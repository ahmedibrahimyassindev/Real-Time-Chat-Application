import { describe, expect, it } from 'vitest'

import { loginSchema, registerSchema } from './auth.schema'

describe('auth schemas', () => {
  it('accepts valid login input', () => {
    expect(
      loginSchema.safeParse({
        email: 'ahmed@example.com',
        password: 'password123'
      }).success
    ).toBe(true)
  })

  it('rejects mismatched registration passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Ahmed',
      email: 'ahmed@example.com',
      password: 'password123',
      confirmPassword: 'different123'
    })

    expect(result.success).toBe(false)
  })
})
