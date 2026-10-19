# Hero Ranker

Web application for rating fictional characters from TV series.

## Tech Stack

Frontend: Next.js, Tailwind CSS
Backend: NestJS
Database: PostgreSQL
ORM: Prisma
Infrastructure: Docker

## Requirements

Before running the application, make sure you have installed:

- Node.js (LTS)
- Docker Desktop
- Git

## Installation

Install dependencies

### 1. Backend:

```
cd api
npm install
```

### 2. Frontend:

```
cd ../web
npm install
```

### 3. Start the PostgreSQL DB

From the project root:

```
docker compose up -d
```

Check that the database container is running:

```
docker compose ps
```

### 4. Run database migrations

Go to the backend:

```
cd api
```

Run Prisma migrations:

```
npx prisma migrate dev
```

This creates the database tables defined in `prisma/schema.prisma.

### 5. Start the backend

From api/

```
npm run start:dev
```

### 6. Start the frontend

From web/

```
npm run dev
```

The frontend should now be available at:

http://localhost:3000

## Backend Testing

All test commands below are run from the `api/` directory.

### Unit tests

Run the unit test suite:

```
npm test
```

### End-to-end tests

The e2e tests use a separate PostgreSQL database in Docker. The test database is available on port `5433` and uses the `hero_ranker_test` database.

Reset the test database, apply migrations, and insert deterministic seed data:

```
npm run test:e2e:db:reset
```

Run the complete e2e test suite against the prepared database:

```
npm run test:e2e:run
```

The usual complete workflow is:

```
npm run test:e2e:db:reset && npm run test:e2e:run
```

To run only a specific e2e test without reseeding the database:

```
npx cross-env DATABASE_URL=postgresql://app:password@localhost:5433/hero_ranker_test npm run test:e2e -- --runInBand -t "complete Vote workflow"
```

The test database can be started without resetting its data with:

```
npm run test:e2e:db:up
```
