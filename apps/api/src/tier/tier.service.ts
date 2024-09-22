import { Tier, TierDocument } from '@api/tier/schemas/tier.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class TierService {
  constructor(@InjectModel(Tier.name) private tierModel: Model<Tier>) {}

  findAll(): Promise<TierDocument[]> {
    return this.tierModel.find().exec()
  }

  findOne(id: string) {
    return this.tierModel.findById(id.toString()).exec()
  }

  /*
  Currently, only direct DB editing is supported for Tiers
  */

  // create(createTierDto: CreateTierDto) {
  //   return 'This action adds a new tier';
  // }

  // update(id: number, updateTierDto: UpdateTierDto) {
  //   return `This action updates a #${id} tier`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tier`;
  // }
}
