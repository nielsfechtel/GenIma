import { API_Key, API_KeyDocument } from '@api/api_key/schemas/api_key.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// Some packages can't be found via imports, not sure why. VS-Code problem?
// The library even says you can import it via ESM, so not sure what's happening
const { v4: uuidv4 } = require('uuid')

@Injectable()
export class ApiKeyService {
  constructor(@InjectModel(API_Key.name) private apikeyModel: Model<API_Key>) {}

  async create(name: string, expiry_date: Date) {
    let value = uuidv4()
    let isUnique = !(await this.apikeyModel.findOne({ value }))
    while (!isUnique) {
      isUnique = !(await this.apikeyModel.findOne({ value }))
      value = uuidv4()
      console.log('are we stuck here?')
    }

    const newKey = this.apikeyModel.create({
      name,
      expiry_date,
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
