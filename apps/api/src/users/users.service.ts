import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { UpdateUserDto } from '@api/users/dto/update-user.dto'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto)
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
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec()
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete({ _id: id }).exec()
  }
}
