import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { Schema, string } from 'zod'

@Schema()
export class User {
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  isVerified: boolean

  @Prop({ required: true })
  firstName: string

  @Prop()
  lastName: string

  @Prop({
    type: string,
    required: true,
    enum: ['user', 'admin'],
  })
  role: string

  // chats @prop({ type: mongoose.schema.types.objectid, ref: 'chat' })
  // chats: chat

  // API TOKENS @prop({ type: mongoose.schema.types.objectid, ref: 'chat' })
  // apiTokens: ApiToken

  @Prop({
    type: string,
    required: true,
    enum: ['FREE', 'PREMIUM', 'BUSINESS'],
  })
  tier: string
}

export const UserSchema = SchemaFactory.createForClass(User)
