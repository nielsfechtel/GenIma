import { z } from 'zod'

export const CreateAPIKeySchema = z.object({
  name: z.string().min(3).max(50),
  expiry_date: z.string(),
})
