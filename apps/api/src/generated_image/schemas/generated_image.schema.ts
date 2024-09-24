import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type GeneratedImageDocument = HydratedDocument<GeneratedImage>

@Schema()
export class GeneratedImage {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, unique: true })
  tokenLimit: number
}

export const GeneratedImageSchema = SchemaFactory.createForClass(GeneratedImage)
