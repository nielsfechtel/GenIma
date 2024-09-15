import { UserDocument } from '@api/users/schemas/user.schema'

export type ContextType = {
  user: null | Pick<UserDocument, 'email' | 'firstName'>
}
