FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable



FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=genima_api --prod /prod/api
RUN pnpm deploy --filter=genima_web --prod /prod/web



FROM base AS genima_api
COPY --from=build /prod/genima_api /prod/api
WORKDIR /prod/genima_api
EXPOSE 4000
CMD [ "pnpm", "start" ]



FROM base AS genima_web
COPY --from=build /prod/genima_web /prod/web
WORKDIR /prod/genima_web
EXPOSE 3000
CMD [ "pnpm", "start" ]
