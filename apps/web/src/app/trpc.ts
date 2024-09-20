import { AppRouter } from '@api/trpc/trpc.router'
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import { auth } from '@web/src/auth'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      // TODO you should update this to use env variables
      url: 'http://localhost:4000/trpc',
      async headers() {
        const session = await auth()
        if (session?.accessToken) {
          return { Authorization: `Bearer ${session?.accessToken}` }
        }
        return {}
      },
    }),
    // log to console only in development
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === 'development' &&
          typeof window !== 'undefined') ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
  ],
})
