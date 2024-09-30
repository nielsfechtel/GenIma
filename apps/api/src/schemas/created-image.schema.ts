import { z } from 'zod'

export const CreatedImageSchema = z.object({
  creator: z.union([
    z.object({
      _id: z.instanceof(Object).transform((id) => id.toString()),
      firstName: z.string(),
      lastName: z.string().optional(),
    }),
    z.instanceof(Object).transform((id) => id.toString()),
  ]),
  _id: z.instanceof(Object).transform((id) => id.toString()),
  inputText: z.string(),
  categories: z.string(),
  image_url: z.string(),
  prompt: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
