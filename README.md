
# Hero Ranker

Web application for rating fictional characters from TV series.

## Tech Stack

Frontend: Next.js + TypeScript
Backend: NestJS + TypeScript
Database: PostgreSQL
ORM: Prisma
Infrastructure: Docker Compose

## Requirements

Before running the application, make sure you have installed:

- Node.js (LTS)
- Docker Desktop
- Git

## Installation

Install dependencies

## 1. Backend:

```
cd api
npm install
```

## 2. Frontend:

```
cd ../web
npm install
```

## 3. Start the PostgreSQL DB

From the project root:

```
docker compose up -d
```

Check that the database container is running:

```
docker compose ps
```

## 4. Run database migrations

Go to the backend:

```
cd api
```

Run Prisma migrations:

```
npx prisma migrate dev
```

This creates the database tables defined in `prisma/schema.prisma.

## 5. Start the backend

From api/

```
npm run start:dev
```

## 6. Start the frontend

From web/

```
npm run dev
```

The frontend should now be available at:

http://localhost:3000