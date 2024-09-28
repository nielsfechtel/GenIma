import { API_Key, API_KeyDocument } from '@api/api_key/schemas/api_key.schema'
import { User } from '@api/users/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(API_Key.name) private apikeyModel: Model<API_Key>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async create(creator_email: string, name: string, expiry_date: string) {
    // check if name of key for account is unique
    const user = await this.userModel
      .findOne({ email: creator_email })
      .populate('api_keys')
    if (!user) throw new Error('User not found')

    // make sure the name is unique (for this user)
    for (const api_key of user.api_keys) {
      if (api_key.name === name) throw new Error('Not a unique API Key-name!')
    }

    // instead of UUID, generate a token with the email (to later attribute the image without DB-lookup)
    // and the (for the email) unique name
    const payload = { is_api_key: true, name, email: creator_email }
    const value = await this.jwtService.signAsync(payload)

    const newKey = this.apikeyModel.create({
      name,
      expiry_date: new Date(expiry_date),
      usesLeft: 3,
      value,
    })

    return newKey
  }

  async findAll() {
    return this.apikeyModel.find().exec()
  }

  async findOne(value: string) {
    return this.apikeyModel.findOne({ value }).exec()
  }

  async update(value: string, updates: Partial<API_KeyDocument>) {
    return this.apikeyModel.updateOne({ value }, updates).exec()
  }

  async remove(value: string) {
    return this.apikeyModel.findOneAndDelete({ value }).exec()
  }
}
