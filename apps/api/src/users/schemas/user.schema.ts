import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsEmail } from 'class-validator'
import mongoose, { HydratedDocument } from 'mongoose'

// this I've also seen written as 'export type UserDocument =  User & Document'
// it's a type that includes mongo-specific properties like _id, which we don't want to
// specify in our schema below.
export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string

  // not necessarily required, as signup with an OAuth-provider is supported
  @Prop()
  password: string

  @Prop({ required: true })
  isVerified: boolean

  @Prop({ required: true })
  firstName: string

  @Prop()
  lastName: string

  @Prop()
  profileImage: string

  @Prop({ required: true })
  tier: mongoose.Schema.Types.ObjectId

  @Prop({
    type: String,
    required: true,
    enum: ['USER', 'ADMIN'],
  })
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User)
