FROM node:14.15.1-alpine3.12 AS builder
ARG REDIS_URL=redis://cache
ENV REDIS_URL=${REDIS_URL}
ARG REDIS_URL=redis://cache
ENV REDIS_URL=${REDIS_URL}
RUN apk add --no-cache python3 make git curl g++
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY . .
RUN npm run build

FROM node:14.15.1-alpine3.12
WORKDIR /usr/src/app
# RUN chown -R node:node .
# USER node
RUN npm install -g nodemon
COPY --from=builder /usr/src/app/ .
CMD ["node", "dist/index.js"]
