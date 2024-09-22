import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type API_KeyDocument = HydratedDocument<API_Key>

@Schema()
export class API_Key {
  @Prop({ required: true, unique: true })
  value: string

  @Prop({ default: 3 })
  usesLeft: number

  @Prop({ required: true, immutable: true })
  expiry_date: Date
}

export const API_KeySchema = SchemaFactory.createForClass(API_Key)
