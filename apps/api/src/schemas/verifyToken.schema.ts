import { z } from 'zod'

export const VerifyTokenSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  action: z.union([
    z.literal('VERIFY_EMAIL'),
    z.literal('DELETE_ACCOUNT'),
    z.literal('RESET_PASSWORD'),
    z.literal('CHANGE_EMAIL'),
  ]),
  oldEmail: z.string().email().optional(),
})
