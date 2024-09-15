import { AppRouter } from '@api/trpc/trpc.router'
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    /**
     * The function passed to enabled is an example in case you want to the link to
     * log to your console in development and only log errors in production
     */
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === 'development' &&
          typeof window !== 'undefined') ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    // there also is httpLink, but the batch-version batches
    // requests made shortly after another, improving performance
    httpBatchLink({
      url: 'http://localhost:4000/trpc', // you should update this to use env variables
    }),
  ],
})
