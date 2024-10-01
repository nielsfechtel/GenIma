import { UserSchema } from '@api/users/schemas/user.schema'
import { HydratedDocument, InferSchemaType } from 'mongoose'

export type UserReturnSchema = Pick<
  HydratedDocument<InferSchemaType<typeof UserSchema>>,
  | '_id'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'role'
  | 'tier'
  | 'api_keys'
  | 'updatedAt'
  | 'createdAt'
  | 'images'
>
