FROM node:14.15.0-alpine

# Arguments
ARG DISCORD_TOKEN
ARG OWNER_ID
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION

# Env
ENV DISCORD_TOKEN=$DISCORD_TOKEN
ENV OWNER_ID=$OWNER_ID
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION
ENV NODE_ENV=production

# FFMPEG Path
# ENV PATH="/usr/src/app/node_modules/ffmpeg-static:${PATH}"

# Setup Work directory.
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Let's install everything!
RUN apk add --update \
    && apk add --no-cache --virtual .build python make git curl build-base g++ \
    && apk add --no-cache ffmpeg-libs musl sdl2 ffmpeg \
    && npm install \
    && apk del .build

# Copy project to our WORKDIR
COPY . .

# Compile Typescript
RUN npm run tsc

# Run
CMD ["node", "dist/index.js"]
