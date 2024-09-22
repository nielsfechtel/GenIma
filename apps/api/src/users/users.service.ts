import { Tier } from '@api/tier/schemas/tier.schema'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Tier.name) private tierModel: Model<Tier>
  ) {}

  async create(userData: Partial<UserDocument>): Promise<UserDocument> {
    // always add the tier with the lowest tokenLimit (which should be FREE)
    const tiers = await this.tierModel.find().sort({ tokenLimit: 'asc' })

    const lowestTier = tiers[0]
    if (!lowestTier) {
      throw new InternalServerErrorException('No tiers defined')
    }

    const createdUser = new this.userModel({
      ...userData,
      isVerified: false,
      role: 'USER',
      tier: lowestTier,
    })
    return createdUser.save()
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec()
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id }).exec()
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email }).populate('tier').exec()
  }

  async update(
    id: string,
    updateUser: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUser, { new: true })
      .exec()
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete({ _id: id }).exec()
  }

  async deleteOneByEmail(email: string): Promise<void> {
    await this.userModel.deleteOne({
      email,
    })
  }

  async deleteMany(): Promise<void> {
    await this.userModel.deleteMany()
  }
}
