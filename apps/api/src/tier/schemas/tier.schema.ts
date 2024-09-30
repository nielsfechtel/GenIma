import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TierDocument = HydratedDocument<Tier>

@Schema({ timestamps: true })
export class Tier {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, unique: true })
  tokenLimit: number

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  updatedAt: Date
}

export const TierSchema = SchemaFactory.createForClass(Tier)
