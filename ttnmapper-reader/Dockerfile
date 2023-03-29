# Base image
FROM node:lts-alpine

# Create app directory
WORKDIR /app

RUN apk update && apk add --no-cache libc6-compat=1.2.3-r4
RUN corepack enable && corepack prepare pnpm@7.4.1 --activate

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN pnpm install --offline
RUN pnpm build

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
