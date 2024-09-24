import { z } from 'zod'

export const UpdateNamesSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
})
