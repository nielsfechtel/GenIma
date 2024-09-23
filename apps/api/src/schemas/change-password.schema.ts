import { z } from 'zod'

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string(),
})
