# ttn-locator-backend

Part of my [Master's Thesis in summer semester 2023](https://github.com/Bassadin/Master-Thesis-INM)

A simple service that reads data from TTNMapper and stores it in a PostgreSQL database.
Supports device subscriptions from which it will pull data from TTNMapper to get RSSI and GPS data according to the gateways that received the signal.

The goal is to write queries that can determine a device's location based on the RSSI and/or ToA data alone.

## Important note

**Not at all production-ready yet!**

## 🍔 Stack Specs

-   Node.js
-   Express
-   TypeScript
-   Prisma
-   Postgres

## 🧬 Development

-   `pnpm i`
-   `pnpm i -g prisma ts-node`
-   Copy the `.env.sample` to `.env` and fill in the values if needed
-   Run `docker-compose up -d` to start the database
-   `prisma generate` to generate the Prisma client classes
-   `prisma migrate reset` to run the migrations and seeders
-   `pnpm run dev` to start the development server
-   `pnpm run test:run` to run the tests

## 🚀 Production Build

-   Run the production build

```bash
pnpm build
```

-   Start the production server

```bash
pnpm start
```
