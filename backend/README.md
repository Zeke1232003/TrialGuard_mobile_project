# TrialGuard Backend

Express backend for TrialGuard.

## Features
- Verify local bearer token (`Authorization: Bearer local-token-<uid>`)
- Subscription CRUD APIs (in-memory)
- Per-user data isolation by token user id

## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Run `npm run dev`

## Endpoints
- `GET /health`
- `GET /api/subscriptions`
- `POST /api/subscriptions`
- `GET /api/subscriptions/:id`
- `PATCH /api/subscriptions/:id`
- `DELETE /api/subscriptions/:id`

All `/api/subscriptions*` routes require a bearer token in `local-token-<uid>` format.
