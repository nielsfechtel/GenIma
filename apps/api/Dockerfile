###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine AS development

RUN npm i -g pnpm
RUN npm i -g @nestjs/cli


# Create app directory
WORKDIR /usr/src/app

# Copy the monorepo's pnpm-lock.yaml
# and this package's package.json
COPY --chown=node:node ./pnpm-lock.yaml ./
# COPY --chown=node:node ./apps/api/package.json ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install
RUN pnpm build:api

USER node


# ###################
# # BUILD FOR PRODUCTION
# ###################

# FROM node:18-alpine AS build
# RUN npm i -g pnpm

# WORKDIR /usr/src/app

# COPY --chown=node:node pnpm-lock.yaml ./

# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# COPY --chown=node:node . .

# ENV NODE_ENV production

# RUN pnpm install --prod

# RUN pnpm build:api

# USER node

# ###################
# # BUILD FOR PRODUCTION
# ###################
# only COPY the build-files and start them using node

FROM node:18-alpine AS production

# Copy the bundled code from the build stage to the production image
# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/dist ./dist

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]
# Start the server using the production build
ENTRYPOINT "node"
CMD ["dist/main.js"]
