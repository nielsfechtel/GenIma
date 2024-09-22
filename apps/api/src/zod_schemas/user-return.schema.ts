import { TierSchema } from '@api/tier/schemas/tier.schema'
import { InferSchemaType } from 'mongoose'

export type UserReturnSchema = {
  email: string
  firstName: string
  lastName: string
  profileImage: string
  role: string
  tier: Pick<InferSchemaType<typeof TierSchema>, 'name' | 'tokenLimit'>
}
