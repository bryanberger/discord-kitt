FROM node:14.15.0

# Env
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Compile Typescript
RUN npm run tsc

# Run
CMD ["node", "dist/index.js"]
