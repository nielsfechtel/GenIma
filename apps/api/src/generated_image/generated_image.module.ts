import { CloudinaryService } from '@api/cloudinary/cloudinary.service'
import { GeneratedImageTrpcRouter } from '@api/generated_image/generated_image.trpc.router'
import {
  GeneratedImage,
  GeneratedImageSchema,
} from '@api/generated_image/schemas/generated_image.schema'
import { TrpcService } from '@api/trpc/trpc.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GeneratedImageService } from './generated_image.service'

@Module({
  exports: [GeneratedImageService],
  imports: [
    MongooseModule.forFeature([
      { name: GeneratedImage.name, schema: GeneratedImageSchema },
    ]),
  ],
  providers: [
    GeneratedImageService,
    CloudinaryService,
    GeneratedImageTrpcRouter,
    TrpcService,
  ],
})
export class GeneratedImageModule {}
