// modules/user/user.trpc.ts
import { CreateAPIKeySchema } from '@api/schemas/create-apikey.schema'
import { UpdateNamesSchema } from '@api/schemas/update-names.schema'
import { TierService } from '@api/tier/tier.service'
import { TrpcService } from '@api/trpc/trpc.service'
import { UsersService } from '@api/users/users.service'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class UserTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UsersService,
    private readonly tierService: TierService
  ) {}

  userRouter = this.trpc.router({
    getUser: this.trpc.protectedProcedure.query(async ({ ctx }) => {
      return await this.userService.findOneByEmail(ctx.user.email)
    }),

    getAll: this.trpc.protectedAdminProcedure.query(async () => {
      return await this.userService.findAll()
    }),

    getAllTiers: this.trpc.protectedAdminProcedure.query(
      async () => await this.tierService.findAll()
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

    getAPIKeys: this.trpc.protectedProcedure.query(async ({ ctx }) => {
      return await this.userService.getAPIKeysOfUser(ctx.user.email)
    }),

    deleteAPIKey: this.trpc.protectedProcedure
      .input(z.object({ value: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await this.userService.deleteAPIKey(ctx.user.email, input.value)
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
