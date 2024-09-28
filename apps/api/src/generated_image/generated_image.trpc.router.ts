import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { TrpcService } from '@api/trpc/trpc.service'
import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

@Injectable()
export class GeneratedImageTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly genImService: GeneratedImageService
  ) {}

  generatedImageRouter = this.trpc.router({
    createImage: this.trpc.protectedProcedure
      .input(CreateImageSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await this.genImService.create(
          input.inputText,
          input.inputOptions
        )
        return result
      }),
  })
}
