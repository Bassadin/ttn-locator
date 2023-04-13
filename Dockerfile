# Base image
FROM node:lts-alpine AS base

# Create app directory
WORKDIR /app

RUN apk update && apk add --no-cache libc6-compat=1.2.3-r4
RUN corepack enable && corepack prepare pnpm@8.2.0 --activate

# Copy prisma schema
COPY prisma ./prisma/

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r --offline

RUN pnpm prisma:generate

RUN pnpm build

EXPOSE ${PORT}

# Health check
HEALTHCHECK --timeout=10s CMD node ./additional_scripts/healthcheck.mjs

# Start the server using the production build
CMD pnpm start
