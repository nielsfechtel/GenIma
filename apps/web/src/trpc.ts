import { AppRouter } from '@api/trpc/trpc.router'
import {
  createTRPCProxyClient,
  httpBatchLink,
  loggerLink,
  TRPCClientError,
} from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { auth } from '@web/src/auth'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    // log to console only in development
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${process.env.API_SERVER_URL}/api/trpc`,
      async headers() {
        const session = await auth()

        if (session?.accessToken) {
          return {
            Authorization: `Bearer ${session?.accessToken}`,
          }
        }
        return {}
      },
    }),
  ],
})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError
}
