import { z } from 'zod'

export const CreateImageSchema = z.object({
  inputText: z.string().max(1500),
  inputOptions: z.object({
    'ASCII-art': z.boolean(),
    'Copy art': z.boolean(),
    Drawing: z.boolean(),
    Dystopian: z.boolean(),
    Fantasy: z.boolean(),
    Futuristic: z.boolean(),
    Medieval: z.boolean(),
    Nature: z.boolean(),
    Painting: z.boolean(),
    Photograph: z.boolean(),
    Photorealistic: z.boolean(),
    Prehistoric: z.boolean(),
    Scifi: z.boolean(),
    Sketch: z.boolean(),
  }),
})
