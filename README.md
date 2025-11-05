# Task Manager Backend

Simple, production-ready backend for a task management application (REST API).

## Features

- User authentication (register/login, JWT)
- Task CRUD (create, read, update, delete)
- Basic access control (admins manage users tasks)
- Validation and error handling
- Configurable via environment variables

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local, hosted, or Docker)

## Quickstart

1. Clone repository

   ```bash
   git clone <repo-url> .
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Create `.env` (see below) and start in development
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment variables

Example `.env`:

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret
```

## Scripts

- `npm run dev` — start dev server (nodemon)
- `npm start` — start production server
- `npm test` — run tests
- `npm run lint` — run linter
- `npm run build` — build (if applicable)

## API (examples)

Base path: `/api/v1`

Auth

- POST `/auth/register` — register admin
- POST `/auth/login` — login

Tasks (authentication required: Bearer token)

- GET `/tasks` — list admins's tasks (supports paging & filters)
- POST `/tasks` — create task
- GET `/tasks/:id` — get specific task
- PATCH `/tasks/:id` — update task
- DELETE `/tasks/:id` — delete task

Users (authentication required: Bearer token)

- GET `/paginated` — list admins's users (supports paging & filters)
- POST `/users` — create user
- GET `/users` — get all users
- PATCH `/users/:id` — update user
- DELETE `/users/:id` — delete user

Dashboard (authentication required: Bearer token)

- GET `/analytics` — get tasks and user analytics
- GET `/card-stats` — get statistics figures of tasks and users

Responses use JSON and standard HTTP status codes.

## Database

- Default: MongoDB (Mongoose). Change `MONGO_URI` to point to your DB.
