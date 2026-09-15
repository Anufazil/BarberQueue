# BarberQueue

A MERN queue-management application for a single barbershop, with public customer discovery, an admin dashboard, and barber workstations. This release repairs the supplied project while retaining its React/Vite and Express/Mongoose architecture.

## Features and roles

- **ADMIN:** dashboard, reports, create/edit/reactivate/deactivate barbers, profile details, status and queue operations.
- **BARBER:** own dashboard and queue only; call next, finish a specific customer, skip, cancel, and change availability.
- **Public customer:** browse active barbers, join using name and a 10-digit phone number, receive a numeric display token and private access link, track position/estimated wait, and cancel while waiting.
- Staff receive authenticated Socket.IO invalidations; customers use polling without sharing personal data through public sockets.

This is a single-shop application. It does not implement tenant isolation, billing, customer accounts, SMS/phone verification, password reset, or refresh tokens.

## Stack and structure

React 19, Vite 8, Tailwind 4, TanStack Query, React Router, Framer Motion, Axios, React Hook Form, Zod, React Hot Toast and Lucide; Node.js 24, Express 5, Mongoose, MongoDB, JWT, bcrypt, express-validator, Helmet, CORS, rate limits, Socket.IO and development Swagger UI.

```
client/
  src/app/           Router and providers
  src/components/    Layouts, guards and shared UI
  src/context/       Authentication and socket lifecycle
  src/features/      admin, auth, barber, customer
  src/lib/           Axios, socket and query configuration
server/
  config/            Database, security, OpenAPI
  controllers/       Request/response handlers
  middleware/        Authentication, roles, ownership, validation
  models/            User, Barber, Queue
  routes/            API routers
  services/          Queue transactions, dashboards and sockets
  scripts/           Secure admin bootstrap and existing-data migration
  tests/             Real database/API/socket integration tests
docs/                Full API contract map and file inventory
```

## Prerequisites

Use **Node.js 24.x** and **MongoDB Atlas or a MongoDB replica set**. Standalone MongoDB cannot run the transactions used to protect queue operations. A local replica set may use one node for development; production should use a properly operated Atlas/replica-set deployment.

MongoDB documents the replica-set requirement and transaction write-conflict behavior in [transaction production considerations](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/).

## Local setup

1. Extract the ZIP. Open a terminal in `server`, run `npm ci`, and copy `.env.example` to `.env`.
2. Set `MONGO_URI` to your database, generate a random `JWT_SECRET` of at least 32 characters, and set `CLIENT_URL=http://localhost:5173`. Keep `TRUST_PROXY=0` for direct local access.
3. If using an existing database, follow **Existing databases** below before starting the application.
4. Create the first administrator using the CLI bootstrap below.
5. In `server`, run `npm run dev` (or `npm start`). The server waits for MongoDB and required indexes before listening on port 5000.
6. In a second terminal in `client`, run `npm ci`, copy `.env.example` to `.env`, then run `npm run dev`.
7. Open `http://localhost:5173`. The Vite proxy forwards `/api` and `/socket.io` to port 5000. Use `/login` for staff.

No working secrets or account passwords are included. To generate a JWT secret locally, use `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and keep the result private.

### Secure first administrator

Set `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, and `BOOTSTRAP_ADMIN_PASSWORD` in the process environment of a trusted server terminal, then run `npm run bootstrap-admin` from `server`. Use a password of at least 8 characters and no more than 72 UTF-8 bytes. Remove those environment variables afterward. The CLI refuses to bootstrap when an ADMIN already exists. Do not run multiple bootstrap processes concurrently.

Further admins may be created using `POST /api/auth/register-admin` with an existing ADMIN JWT. There is no public administrator registration flow. `/register` redirects to login.

### Existing databases — migration required

Back up the database and stop all application writers. Set the intended `MONGO_URI`, then run `npm run migrate` from `server` before starting this release.

The migration checks duplicate barber/token pairs, duplicate active phones, multiple serving entries, orphan queues, and invalid User–Barber references. It refuses to guess how to repair conflicting records. After a clean preflight, it backfills the active-phone uniqueness key, replaces the original nonunique token index, and creates required indexes. Migration is not an all-or-nothing transaction; if index creation fails, resolve the reported issue and rerun during maintenance. It never deletes customer history.

Old numeric status links are retired because the number alone could match another barber's customer. Existing entries remain manageable by staff, but cannot obtain private customer access links retroactively. Finish/cancel existing active queues before rollout when practical.

Deletion now means deactivation and retains chair assignments, login identity and history. Clear active queue entries first; edit the profile to reactivate it. Reactivated barbers initially remain OFFLINE until their status is changed.

## Environment variables

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development` locally; `production` for deployment (disables Swagger) |
| `PORT` | Backend listener, defaults to 5000 |
| `MONGO_URI` / `MONGODB_URI` | Database URI; first name takes precedence |
| `JWT_SECRET` | Random server-only signing secret, at least 32 characters |
| `CLIENT_URL` | Comma-separated exact frontend origins; no trailing slash |
| `TRUST_PROXY` | 0 locally; 1 for Render's proxy topology |
| `VITE_API_BASE_URL` | `/api` locally; full HTTPS backend URL ending in `/api` in production |
| `VITE_SOCKET_URL` | Blank locally; full HTTPS backend origin without `/api` in production |

Vite variables are public build-time configuration. Never put credentials in them. Restart local processes or rebuild the frontend after environment changes.

## Queue rules

- AVAILABLE and BUSY barbers accept joins. BREAK, OFFLINE and inactive barbers do not.
- Display tokens increase per barber without daily resets. A random 256-bit access token authorizes customer status/cancellation; only its hash is persisted.
- A phone can have only one active entry across the shop. Phone ownership is not verified; this prevents accidental duplication, not malicious use of someone else's phone number.
- WAITING → SERVING → COMPLETED; staff may SKIP or CANCEL an active entry. Customers may cancel only WAITING entries. Terminal entries cannot be reopened.
- One customer can be SERVING per barber. Queue, status and deactivation mutations serialize through transactions on the barber document.
- Call next sets BUSY; completing/skipping/cancelling a serving entry returns BUSY to AVAILABLE. Finish requires the specific `queueId` to reject stale actions.
- Queue position is one-based among waiting customers; serving/terminal position is zero. Customers ahead includes the person currently serving. Estimates use the last 100 completed services (20 minutes until history exists), so they are approximate.
- Barber completed/cancelled daily counts and admin daily reports use UTC. Admin dashboard totals and queue analytics cover all history.

## Sessions, sockets and errors

The client restores sessions by requesting `/auth/me`, clears staff cache on logout/401/account changes, and owns socket connection setup in one provider. JWTs expire after seven days. Logout clears the local session; it does not revoke a copied token. Tokens remain in localStorage, so deploy only trusted frontend code and protect against XSS. Inactive accounts are blocked on every staff HTTP request and their current sockets are disconnected.

Socket rooms are assigned by the server using the authenticated user. Queue events go only to the owning barber and admins; payloads contain event/barber IDs, never customer names, phones, passwords or private access tokens. Sockets disconnect at JWT expiry. Staff polling is a fallback when a socket cannot reconnect. Public discovery polls every 15 seconds; customer queue status polls every 10 seconds.

API errors use appropriate 400/401/403/404/409/413/429/500 statuses and a message. Production errors hide stack traces and internal database details. Application request logs intentionally omit URLs because customer queue links contain access credentials.

## Production deployment

### MongoDB Atlas

Create the database and a least-privilege application user, configure network access for your backend, and set its connection URI only in backend environment settings. Run migration on an existing database during maintenance. Backups, retention, monitoring and capacity planning must be configured for your deployment.

### Render backend

`render.yaml` is included. It builds in `server` with `npm ci --omit=dev` and runs `npm start`. Set `MONGO_URI`, `CLIENT_URL` to the Vercel origin, `NODE_ENV=production`, a generated `JWT_SECRET`, and `TRUST_PROXY=1`. Use the `/` health check. Run the bootstrap/migration CLI from a trusted environment when required.

### Vercel frontend

Use `client` as the project root, `npm run build` as the build command, and `dist` as the output directory. Set `VITE_API_BASE_URL=https://YOUR-BACKEND/api` and `VITE_SOCKET_URL=https://YOUR-BACKEND`. The included `vercel.json` rewrites deep SPA routes to `index.html` and sets referrer/nosniff headers. Add the final Vercel origin to backend `CLIENT_URL` and redeploy after changing build-time variables.

Use one backend instance initially. Multiple instances need a shared Socket.IO adapter and distributed rate-limit store; database correctness alone does not synchronize socket rooms or in-memory limits. Ensure proxy/platform logs and analytics do not collect private queue links. This release was not deployed to your cloud accounts.

## API documentation and verification

See `docs/API_CONTRACTS.md` for every frontend action, method, route, controller/service and model. `server/config/openapi.json` documents the endpoints; Swagger UI is at `/api/docs` only outside production.

- `client`: `npm run lint`, `npm run build`
- `server`: `npm test` starts a disposable MongoDB replica set (first run downloads MongoDB).
- If child-process launch is restricted, set `TEST_MONGO_URI` to a fresh local replica-set database named `barberqueue_test_*`. Tests seed that database and never target your application URI. Use a new test database name for each run.
- `npm audit` checks dependency advisories. The audit at delivery reported zero vulnerabilities in both installed dependency trees; this does not guarantee absence of vulnerabilities.

See `AUDIT_REPORT.md` for verified checks, remaining limitations and the complete change list.
