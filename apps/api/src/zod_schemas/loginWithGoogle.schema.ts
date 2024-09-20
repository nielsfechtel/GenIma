import { SignUpSchema } from '@api/zod_schemas/signup.schema'
import { z } from 'zod'

// we need this information in case the user needs to be signed up
// they can also be verified instantly if Google says it's okay
export const SignUpWithGoogleSchema = SignUpSchema.extend({
  isVerifiedEmail: z.string(),
  googleIDtoken: z.string(),
})
