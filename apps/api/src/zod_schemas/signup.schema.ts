import { z } from 'zod'

export const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  lastName: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password length must be below 100 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})
