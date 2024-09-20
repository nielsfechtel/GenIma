// modules/user/user.trpc.ts
import { TrpcService } from '@api/trpc/trpc.service'
import { UsersService } from '@api/users/users.service'
import { ObjectIdSchema } from '@api/zod_schemas/object-id.schema'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class UserTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UsersService
  ) {}

  userRouter = this.trpc.router({
    // TODO security risk? This way anyone can check if an email exists, right?
    getOneByEmail: this.trpc.publicProcedure
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
  })
}
