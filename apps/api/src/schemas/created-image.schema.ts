import { z } from 'zod'

export const CreatedImageSchema = z.object({
  creator: z.union([
    z.instanceof(Object).transform((id) => id.toString()),
    z.object({
      _id: z.instanceof(Object).transform((id) => id.toString()),
      firstName: z.string(),
      lastName: z.string().optional(),
    }),
  ]),
  _id: z.instanceof(Object).transform((id) => id.toString()),
  inputText: z.string(),
  categories: z.string(),
  finalInput: z.string(),
  prompt: z.string(),
  image_url: z.string(),
})
