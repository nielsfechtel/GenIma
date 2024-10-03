###################
# DEVELOPMENT STAGE
###################
FROM node:18-alpine As development
# get pnpm
RUN npm i -g pnpm

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN pnpm install --prod

WORKDIR /usr/src/app/apps/api

RUN pnpm run build

USER node

###################
# PRODUCTION STAGE
###################
FROM node:18-alpine As production


WORKDIR /usr/src/app
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

WORKDIR /usr/src/app/apps/api

COPY --chown=node:node --from=development /usr/src/app/apps/api/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/apps/api/dist ./dist

ENV NODE_ENV production

ENTRYPOINT ["node", "dist/main.js"]
