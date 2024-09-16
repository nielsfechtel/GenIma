import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: Partial<UserDocument>): Promise<UserDocument> {
    const createdUser = new this.userModel({
      ...userData,
      isVerified: false,
      role: 'USER',
      tier: 'FREE',
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
    return this.userModel.findOne({ email: email }).exec()
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

  async deleteMany(): Promise<void> {
    await this.userModel.deleteMany()
  }
}
