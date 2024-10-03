###################
# DEVELOPMENT STAGE
###################
FROM node:18-alpine AS development
# get pnpm
RUN npm i -g pnpm

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN pnpm install --prod

WORKDIR /usr/src/app/apps/web

RUN pnpm run build

USER node

###################
# PRODUCTION STAGE
###################
FROM node:18-alpine AS production

WORKDIR /usr/src/app
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

WORKDIR /usr/src/app/apps/web

COPY --chown=node:node --from=development /usr/src/app/apps/web/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/apps/web/dist ./dist

ENV NODE_ENV production

ENTRYPOINT ["node", "dist/main.js"]
