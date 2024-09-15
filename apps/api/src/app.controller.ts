import { Public } from '@api/auth/public-strategy'
import { TrpcRouter } from '@api/trpc/trpc.router'
import { renderTrpcPanel } from '@metamorph/trpc-panel'
import { Controller, Get } from '@nestjs/common'

@Controller('app')
export class AppController {
  constructor(private trpcRouter: TrpcRouter) {}

  @Public()
  @Get('trpc-panel')
  getTrpcPanel() {
    const myRouter = this.trpcRouter.appRouter
    // add trpc-panel (a Postman-/Swagger-equivalent for tRPC)
    return renderTrpcPanel(myRouter, {
      url: 'http://localhost:4000/trpc',
    })
  }
}
