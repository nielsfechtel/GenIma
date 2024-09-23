import { z } from 'zod'

export const CreateAPIKeySchema = z.object({
  name: z.string().min(3).max(50),
  expiry_date: z
    .date()
    .refine((data) => data > new Date(), {
      message: 'Expiry date has to be in the future',
    }),
})
