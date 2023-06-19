# Base image
FROM node:lts-alpine AS base

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.6.3

# Copy prisma schema
COPY prisma ./prisma/

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r --offline

RUN pnpm build

ENV NODE_ENV=production

EXPOSE ${PORT}

# Health check
HEALTHCHECK CMD node ./scripts/healthcheck.mjs

# Start the server using the production build
CMD pnpm start:migrate:prod
