import { z } from 'zod'

export const SignUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  password: z.string().min(8),
  email: z.string().email(),
})
