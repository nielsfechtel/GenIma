import { z } from 'zod'

export const CreateAPIKeySchema = z.object({
  inputText: z.string().min(50).max(1500),
  inputOptions: z.enum([
    'ASCII-art',
    'Copy art',
    'Drawing',
    'Dystopian',
    'Fantasy',
    'Futuristic',
    'Medieval',
    'Nature',
    'Painting',
    'Photograph',
    'Photorealistic',
    'Prehistoric',
    'Scifi',
    'Sketch',
  ]),
})
