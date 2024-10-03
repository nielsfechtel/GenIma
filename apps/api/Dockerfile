###################
# DEVELOPMENT STAGE
###################
FROM node:18-alpine As development
# get pnpm
RUN npm i -g pnpm

# Create app directory
WORKDIR /usr/src/monorepo_root

COPY --chown=node:node . .

RUN pnpm install --prod

WORKDIR /usr/src/monorepo_root/apps/api

RUN pnpm run build

USER node

###################
# PRODUCTION STAGE
###################
FROM node:18-alpine As production


WORKDIR /usr/src/monorepo_root
COPY --chown=node:node --from=development /usr/src/monorepo_root/node_modules ./node_modules

WORKDIR /usr/src/monorepo_root/apps/api

COPY --chown=node:node --from=development /usr/src/monorepo_root/apps/api/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/monorepo_root/apps/api/dist ./dist

ENV NODE_ENV production

ENTRYPOINT ["node", "dist/main.js"]
