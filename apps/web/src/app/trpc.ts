import { AppRouter } from "@api/trpc/trpc.router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc", // you should update this to use env variables
    }),
  ],
});
