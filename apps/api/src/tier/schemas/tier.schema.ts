import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TierDocument = HydratedDocument<Tier>

@Schema()
export class Tier {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, unique: true })
  tokenLimit: number
}

export const TierSchema = SchemaFactory.createForClass(Tier)
