import { User } from '@api/users/schemas/user.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type GeneratedImageDocument = HydratedDocument<GeneratedImage>

@Schema({ timestamps: true })
export class GeneratedImage {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  creator: User

  @Prop({ required: true })
  inputText: string

  @Prop({ required: true })
  categories: string

  @Prop({ required: true })
  finalInput: string

  @Prop({ required: true })
  prompt: string

  @Prop({ required: true })
  image_url: string

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  updatedAt: Date
}

export const GeneratedImageSchema = SchemaFactory.createForClass(GeneratedImage)
