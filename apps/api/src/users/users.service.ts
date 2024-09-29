import { ApiKeyService } from '@api/api_key/api_key.service'
import { API_Key } from '@api/api_key/schemas/api_key.schema'
import { Tier } from '@api/tier/schemas/tier.schema'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { TRPCError } from '@trpc/server'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Tier.name) private tierModel: Model<Tier>,
    @InjectModel(API_Key.name) private apiKeyModel: Model<API_Key>,
    private apikeyService: ApiKeyService
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
    return this.userModel
      .findOne({ email: email })
      .populate('tier')
      .populate('api_keys')
      .exec()
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
    const user = await this.userModel.findOne({ email })
    if (!user) throw new Error('User not found')

    const result = await this.apiKeyModel.deleteMany({
      _id: { $in: user.api_keys },
    })

    // TODO also implement deletion of further linked docs, right now we only have api-keys

    await this.userModel.deleteOne({
      email,
    })
  }

  async hasPassword(email: string) {
    const user = await this.userModel.findOne({ email: email })
    return !!user?.password
  }

  async isAdmin(email: string) {
    const user = await this.userModel.findOne({ email: email })
    return user?.role === 'ADMIN'
  }

  async createAPIKey(email: string, name: string, expiry_date: string) {
    const user = await this.userModel.findOne({ email })
    if (!user)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })

    if (user.api_keys.length >= 3)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Key-limit of 3 reached',
      })

    const newKey = await this.apikeyService.create(email, name, expiry_date)

    user.api_keys.push(newKey)
    await user.save()
  }

  async deleteAPIKey(email: string, name: string) {}

  async updateNames(email: string, firstName: string, lastName?: string) {
    const user = await this.userModel.findOne({ email })
    if (!user)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })

    user.firstName = firstName
    user.lastName = lastName || ''
    await user.save()

    return user
  }
}
