import { CloudinaryService } from '@api/cloudinary/cloudinary.service'
import { Module } from '@nestjs/common'
import { GeneratedImageService } from './generated_image.service'

@Module({
  providers: [GeneratedImageService, CloudinaryService],
})
export class GeneratedImageModule {}
