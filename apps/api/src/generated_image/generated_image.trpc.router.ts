import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { GeneratedImageSchema } from '@api/schemas/generated-image.schema'
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
    createImage: this.trpc.protectedAPIKeyProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/image',
          protect: true,
          summary: 'Create an image',
          description:
            'Create a new image by providing an input-text and a range of categories.',
        },
      })
      .input(CreateImageSchema)
      .output(GeneratedImageSchema)
      .mutation(async ({ ctx, input }) => {
        return this.genImService.create({
          email: ctx.key?.email || ctx.user?.email,
          apiKeyName: ctx.key?.name,
          inputText: input.inputText,
          categoriesObject: input.inputOptions,
        })
      }),
  })
}
