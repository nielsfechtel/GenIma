import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { CreateAPIKeySchema } from '@api/schemas/create-apikey.schema'
import { ObjectIdSchema } from '@api/schemas/object-id.schema'
import { TrpcService } from '@api/trpc/trpc.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GeneratedImageTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly genImService: GeneratedImageService
  ) {}

    generatedImageRouter = this.trpc.router({
    getOne: this.trpc.protectedProcedure
      .input(ObjectIdSchema)
      .query(async ({ input }) => {
        const id = input.id.toString()
        return this.genImService.findOne()
      }),

    getAll: this.trpc.protectedProcedure.query(
      async () => await this.genImService.findAll()
    ),

    addAPIKey: this.trpc.protectedProcedure
      .input(CreateAPIKeySchema)
      .mutation(async ({ ctx, input }) => {
        return await this.genImService
      }),
  })
}

