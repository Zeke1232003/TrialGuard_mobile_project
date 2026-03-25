# TrialGuard Backend

Express + Firebase Admin backend for TrialGuard.

## Features
- Verify Firebase ID token (`Authorization: Bearer <token>`)
- Subscription CRUD APIs (Firestore)
- Per-user data isolation (`users/{uid}/subscriptions`)

## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Fill Firebase Admin credentials from your service account JSON
5. Run `npm run dev`

## Endpoints
- `GET /health`
- `GET /api/subscriptions`
- `POST /api/subscriptions`
- `GET /api/subscriptions/:id`
- `PATCH /api/subscriptions/:id`
- `DELETE /api/subscriptions/:id`

All `/api/subscriptions*` routes require Firebase Auth token.
