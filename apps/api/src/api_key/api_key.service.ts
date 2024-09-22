import { Injectable } from '@nestjs/common'

@Injectable()
export class ApiKeyService {
  create() {
    return 'This action adds a new apiKey'
  }

  findAll() {
    return `This action returns all apiKey`
  }

  findOne(id: number) {
    return `This action returns a #${id} apiKey`
  }

  update(id: number) {
    return `This action updates a #${id} apiKey`
  }

  remove(id: number) {
    return `This action removes a #${id} apiKey`
  }
}
