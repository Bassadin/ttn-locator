# ttnmapper-reader

Part of my [Master's Thesis in summer semester 2023](https://github.com/Bassadin/Master-Thesis-INM)

A simple "microservice" that reads data from TTNMapper and stores it in a PostgreSQL database.

## Important note

**Not at all production-ready yet!**

## 🍔 Stack Specs

- Node.js
- Express
- TypeScript
- Prisma
- Postgres

## 🧬 Development

- `pnpm i`
- `pnpm i -g prisma ts-node`
- Copy the `.env.sample` to `.env` and fill in the values if needed
- Run `docker-compose up -d` to start the database
- `prisma generate` to generate the Prisma client classes
- `prisma migrate reset` to run the migrations and seeders
- `pnpm run dev` to start the development server
- `pnpm run jest:test` to run the tests

## 🚀 Production Build

- Run the production build

```bash
pnpm build
```

- Start the production server

```bash
pnpm start
```
