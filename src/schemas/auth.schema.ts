import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2),
    confirmPassword: z.string().min(8)
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  })

export type RegisterInput = z.infer<typeof registerSchema>
