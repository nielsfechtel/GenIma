import { AppRouter } from '@api/trpc/trpc.router'
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import { auth } from '@web/src/auth'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    // there also is httpLink, but the batch-version batches
    // requests made shortly after another, improving performance
    httpBatchLink({
      // you should update this to use env variables
      url: 'http://localhost:4000/trpc',
      async headers() {
        const session = await auth()
        if (session?.accessToken) {
          return { Authorization: session?.accessToken }
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
