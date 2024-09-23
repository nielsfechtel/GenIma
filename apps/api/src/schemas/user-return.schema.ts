import { UserSchema } from '@api/users/schemas/user.schema'
import { InferSchemaType } from 'mongoose'

export type UserReturnSchema = Pick<
  InferSchemaType<typeof UserSchema>,
  'email' | 'firstName' | 'lastName' | 'profileImage' | 'role' | 'tier' | 'api_keys'
>
