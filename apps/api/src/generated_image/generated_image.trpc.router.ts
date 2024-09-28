import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { CreatedImageSchema } from '@api/schemas/created-image.schema'
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
          path: '/images',
          protect: true,
          summary: 'Create an image',
          description:
            'Create an image by providing a prompt and a list of options. Authenticate with an API token.',
        },
      })
      .input(CreateImageSchema)
      .output(CreatedImageSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await this.genImService.create({
          email: ctx.user?.email || ctx.key?.email,
          apiKeyName: ctx.key?.name,
          inputText: input.inputText,
          categoriesObject: input.inputOptions,
        })
        return result
      }),
  })
}
