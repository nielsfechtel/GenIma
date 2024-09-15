import mongoose from 'mongoose'
import z from 'zod'

export const ObjectIdSchema = z.object({
  id: z.custom<mongoose.Types.ObjectId>(),
})
