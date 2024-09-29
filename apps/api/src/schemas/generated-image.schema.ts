import { z } from 'zod'

export const GeneratedImageSchema = z.object({
  inputText: z.string(),
  categories: z.string(),
  finalInput: z.string(),
  prompt: z.string(),
  image_url: z.string(),
})
