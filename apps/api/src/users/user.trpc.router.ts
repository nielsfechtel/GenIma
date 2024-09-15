// modules/user/user.trpc.ts
import { TrpcService } from '@api/trpc/trpc.service'
import { UsersService } from '@api/users/users.service'
import { ObjectIdSchema } from '@api/zod_schemas/object-id.schema'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UsersService
  ) {}

  userRouter = this.trpc.router({
    getOne: this.trpc.protectedProcedure
      .input(ObjectIdSchema)
      .query(async ({ input }) => {
        const id = input.id.toString()
        await this.userService.findOne(id)
      }),
    getAll: this.trpc.protectedProcedure.query(
      async () => await this.userService.findAll()
    ),
  })
}
