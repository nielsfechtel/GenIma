FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_FLAGS="--shamefully-hoist"
# See https://github.com/pnpm/pnpm/issues/9029
RUN pnpm i -g corepack@latest
RUN corepack enable



FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=web --prod /prod/web



FROM base AS api
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 4000
CMD [ "pnpm", "start:prod" ]



FROM base AS web
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web
EXPOSE 3000
CMD [ "pnpm", "start" ]
