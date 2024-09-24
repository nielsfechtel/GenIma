import { Injectable } from '@nestjs/common'

@Injectable()
export class GeneratedImageService {
  create() {
    return 'This action adds a new generatedImage'
  }

  findAll() {
    return `This action returns all generatedImage`
  }

  findOne(id: number) {
    return `This action returns a # generatedImage`
  }

  update() {
    return `This action updates a # generatedImage`
  }

  remove(id: number) {
    return `This action removes a # generatedImage`
  }
}
