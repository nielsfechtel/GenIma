// modules/user/user.trpc.ts
import { TrpcService } from '@api/trpc/trpc.service'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class AuthTrpcRouter implements OnModuleInit {
  private router: ReturnType<typeof this.createRouter>
  constructor(private readonly trpcService: TrpcService) {}

  onModuleInit() {
    this.router = this.createRouter()
  }

  private createRouter() {
    const tRpc = this.trpcService.trpc
    return tRpc.router({
      auth: tRpc.router({
        signUp: tRpc.procedure.mutation(() => []),
        login: tRpc.procedure.query(() => []),
        changePassword: tRpc.procedure.mutation(() => {
          // when logged in and old password fits, we can just change it
        }),
        resetPassword: tRpc.procedure.query(() => {
          // This is when not logged in (check for that)
          // Then, send a reset-password-email with a token.action of "RESET_PASSWORD"
        }),
        deleteAccount: tRpc.procedure.query(() => {
          // send verify-deletion-email with a token.action of "DELETE_ACCOUNT"
        }),
        verifyToken: tRpc.procedure.mutation(() => {
          // depending on token.action, this will verify the user,
          // change the password or delete the user
        }),
      }),
    })
  }
}
