import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { CreatedImageSchema } from '@api/schemas/created-image.schema'
import { TrpcService } from '@api/trpc/trpc.service'
import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

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
    getAllImages: this.trpc.protectedProcedure
      .output(z.array(CreatedImageSchema))
      .query(async () => {
        return await this.genImService.findAll()
      }),
    getImageById: this.trpc.protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await this.genImService.findOne(input.id)
      }),
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
      .output(CreatedImageSchema.omit({ creator: true }))
      .mutation(async ({ ctx, input }) => {
        return await this.genImService.create({
          email: ctx.user?.email || ctx.key?.email,
          apiKeyName: ctx.key?.name,
          inputText: input.inputText,
          categoriesObject: input.inputOptions,
        })
      }),
  })
}
