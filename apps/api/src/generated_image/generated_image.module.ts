import { Module } from '@nestjs/common'
import { GeneratedImageService } from './generated_image.service'

@Module({
  providers: [GeneratedImageService],
})
export class GeneratedImageModule {}
