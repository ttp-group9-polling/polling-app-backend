# Polling App - Backend

Express + Sequelize + PostgreSQL API for the TTP Summer 2026 Capstone I polling
app. This repository contains the backend only. The React frontend lives in a
separate repository.

## Tech Stack

- Express 5
- Sequelize 6
- PostgreSQL (Neon in production, local Postgres in development)
- morgan, cors, dotenv

## Getting Started

```bash
npm install
cp .env.example .env   # then edit .env with your database URL
npm run seed           # drops and recreates tables with sample data
npm run dev            # starts the server with nodemon
```

The server runs on http://localhost:3000 by default.

### Environment variables

| Variable     | Example                                 |
| ------------ | --------------------------------------- |
| DATABASE_URL | postgres://localhost:5431/polling_app   |
| PORT         | 3000                                    |

## Models

- Poll: title, description
- Option: text, pollId (foreign key)
- Vote: pollId, optionId, voterEmail

A Poll has many Options and Votes. An Option has many Votes. Deleting a poll
cascades to its options and votes. There is a unique index on (pollId,
voterEmail) so each email can vote once per poll.

## Routes

| Method | Route                 | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| GET    | /health               | Health check                                 |
| GET    | /api/polls            | List all polls with their options            |
| POST   | /api/polls            | Create a poll with its options               |
| GET    | /api/polls/:id        | One poll with options and vote counts        |
| POST   | /api/polls/:id/vote   | Cast a vote for an option in this poll        |

### Create a poll

```json
POST /api/polls
{
  "title": "Best day for standup?",
  "description": "Help us pick a recurring slot.",
  "options": ["Monday", "Wednesday", "Friday"]
}
```

Requires a title, a description, and at least 2 non-empty options.

### Cast a vote

```json
POST /api/polls/1/vote
{ "optionId": 1, "voterEmail": "you@example.com" }
```

Returns 409 if that email has already voted in the poll.

## Deployment (Render + Neon)

1. Create a Postgres database on Neon and copy its connection string.
2. On Render, create a Web Service from this repo.
   - Build command: npm install
   - Start command: node app.js
   - Set DATABASE_URL to the Neon connection string.
3. Deploy and share the live URL so the frontend can set VITE_API_URL.
