// modules/user/user.trpc.ts
import { CreateAPIKeySchema } from '@api/schemas/create-apikey.schema'
import { ObjectIdSchema } from '@api/schemas/object-id.schema'
import { UpdateNamesSchema } from '@api/schemas/update-names.schema'
import { TrpcService } from '@api/trpc/trpc.service'
import { UsersService } from '@api/users/users.service'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class UserTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UsersService
  ) {}

  userRouter = this.trpc.router({
    getOneByEmail: this.trpc.protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        return this.userService.findOneByEmail(input.email)
      }),

    getOne: this.trpc.protectedProcedure
      .input(ObjectIdSchema)
      .query(async ({ input }) => {
        const id = input.id.toString()
        return this.userService.findOne(id)
      }),

    getAll: this.trpc.protectedProcedure.query(
      async () => await this.userService.findAll()
    ),

    hasPassword: this.trpc.protectedProcedure.query(async ({ ctx }) => {
      return this.userService.hasPassword(ctx.user.email)
    }),

    isAdmin: this.trpc.protectedProcedure.query(async ({ ctx }) => {
      return this.userService.isAdmin(ctx.user.email)
    }),

    addAPIKey: this.trpc.protectedProcedure
      .input(CreateAPIKeySchema)
      .mutation(async ({ ctx, input }) => {
        return await this.userService.createAPIKey(
          ctx.user.email,
          input.name,
          input.expiry_date
        )
      }),

    deleteAPIKey: this.trpc.protectedProcedure
      .input(CreateAPIKeySchema)
      .mutation(async ({ ctx, input }) => {
        return await this.userService.deleteAPIKey(ctx.user.email, input.name)
      }),

    updateNames: this.trpc.protectedProcedure
      .input(UpdateNamesSchema)
      .mutation(async ({ input, ctx }) => {
        return await this.userService.updateNames(
          ctx.user.email,
          input.firstName,
          input.lastName
        )
      }),

  })
}
