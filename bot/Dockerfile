# 1st Stage
FROM node:14.15.1-alpine3.12 AS builder

RUN apk add --no-cache python3 make git curl g++

RUN mkdir /build && chown -R node:node /build

WORKDIR /build

COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json
COPY --chown=node:node tsconfig.json tsconfig.json

USER node

RUN npm ci

COPY --chown=node:node src/ src/
RUN npm run build

RUN npm prune --production

# 2nd Stage
FROM node:14.15.1-alpine3.12

RUN apk add --no-cache git

ARG REDIS_URL=redis://cache
ENV REDIS_URL=${REDIS_URL}
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

USER node

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /build/package.json /build/package-lock.json ./
COPY --chown=node:node --from=builder /build/node_modules/ node_modules/
COPY --chown=node:node --from=builder /build/dist/ dist/

EXPOSE 3001

# do this for now as we need write access to the sqllite db, look into changing this
USER root

CMD ["node", "dist/index.js"]
