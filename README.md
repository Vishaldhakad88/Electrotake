# ElectroMart - Admin Backend

This repository contains the Admin backend for ElectroMart (MERN stack). This phase focuses on Admin Authentication and backend foundation.

## Quick Start

1. Copy `.env.example` to `.env` and set values (e.g., PORT, MONGO_URI, JWT_SECRET)
2. Install dependencies: `npm install`
3. Run in dev mode: `npm run dev`

## What we implemented in this step
- Project initialization with recommended dev tooling (ESLint, Prettier, nodemon)
- Basic Express server with health endpoint
- DB connection placeholder
- Project structure scaffold (src/, config/, routes/, scripts/)

Next step (awaiting your confirmation): Create Express server routes, connect to MongoDB, and add the Admin Mongoose model and auth routes.

## Admin Auth APIs (manual testing)

1) Login
- Endpoint: `POST /api/v1/admin/login`
- Headers: `Content-Type: application/json`
- Body (example):
  {
    "email": "admin@example.com",
    "password": "ChangeMe123!"
  }
- Success (200):
  {
    "token": "<jwt-token>",
    "admin": { "id": "<id>", "email": "admin@example.com" }
  }
- Errors:
  - 400: { "error": "Email and password are required" }
  - 401: { "error": "Invalid credentials" }

2) Get current admin
- Endpoint: `GET /api/v1/admin/me`
- Headers: `Authorization: Bearer <jwt-token>`
- Success (200):
  {
    "admin": { "_id": "<id>", "email": "admin@example.com", "createdAt": "..." }
  }
- Errors:
  - 401: { "error": "Missing Authorization header" }
  - 401: { "error": "Invalid or expired token" }

## Seeding an Admin
- Set `MONGO_URI`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your local `.env`.
- Run: `npm run seed` (this will create the admin if it doesn't exist).

## Troubleshooting MongoDB connection issues
If you see errors like "buffering timed out" or "Operation `admins.findOne()` buffering timed out" or a timeout stack trace:

- Check your `MONGO_URI` in `.env` for correctness:
  - Ensure the database username and password are correct.
  - If the password contains special characters (e.g. `@`, `:`), URL-encode it using `encodeURIComponent`.
  - For example: `mongodb+srv://user:encodeURIComponent(password)@cluster.../dbname`.
- If using Atlas, ensure your IP is allowed in the Network Access / IP whitelist (or add `0.0.0.0/0` for testing).
- Verify DNS resolution for `mongodb+srv://` URIs (Internet access required).
- Test connectivity locally with `mongosh <your-uri>` or a simple Node script that calls `mongoose.connect`.
- The code has a 10s server selection timeout; if your network is slow temporarily, increase `serverSelectionTimeoutMS` in `src/config/db.js`.

If you want, share the (redacted) `MONGO_URI` (replace actual password with `<PASSWORD>`) and I can help spot issues.
