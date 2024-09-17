import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsEmail } from 'class-validator'
import { HydratedDocument } from 'mongoose'

// this I've also seen written as 'export type UserDocument =  User & Document'
// it's a type that includes mongo-specific properties like _id, which we don't want to
// specify in our schema below.
export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsEmail()
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
    type: String,
    required: true,
    enum: ['USER', 'ADMIN'],
  })
  role: string

  // chats @prop({ type: mongoose.schema.types.objectid, ref: 'chat' })
  // chats: chat

  // API TOKENS @prop({ type: mongoose.schema.types.objectid, ref: 'api_tokens' })
  // apiTokens: ApiToken

  @Prop({
    type: String,
    required: true,
    enum: ['FREE', 'PREMIUM', 'BUSINESS'],
  })
  tier: string
}

export const UserSchema = SchemaFactory.createForClass(User)
