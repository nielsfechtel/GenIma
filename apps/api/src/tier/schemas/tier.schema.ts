import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {now, HydratedDocument } from 'mongoose'

export type TierDocument = HydratedDocument<Tier>

@Schema({ timestamps: true})
export class Tier {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, unique: true })
  tokenLimit: number

  @Prop({ default: now() })
  createdAt: Date

  @Prop({ default: now() })
  updatedAt: Date
}

export const TierSchema = SchemaFactory.createForClass(Tier)
