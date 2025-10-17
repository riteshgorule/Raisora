# SAP — Frontend + Backend

This repository contains a small split frontend/backend web app used as a demo/demo-starter for campaigns, events and donations. The project uses a Vite + React frontend and an Express backend with JWT-based authentication.

Repository layout
- `frontend/` — Vite + React app. Contains UI, routes, auth modal and pages.
- `backend/` — Express server that exposes `/api/auth` endpoints for register/login and any other backend routes.

Quick start (development)

Prerequisites
- Node.js (16+ recommended)
- npm (or yarn / pnpm) configured

1) Install dependencies

Frontend:

	cd frontend
	npm install

Backend:

	cd backend
	npm install

2) Start servers (in two terminals)

Frontend (default Vite dev server):

	cd frontend
	npm run dev

Backend (Express API server):

	cd backend
	npm start

Ports
- The backend is expected to run on port `7001` in this workspace (see `backend/server.js`).
- The frontend dev server runs on Vite's default port (3000-ish) unless changed. The frontend calls the backend at `http://localhost:7001/api/auth`.

Environment variables
- Backend may expect an environment file for DB connection and JWT secret. Example variables (place in `backend/.env`):

	PORT=7001
	MONGODB_URI=mongodb://localhost:27017/your-db
	JWT_SECRET=supersecret

Security note: Never commit `.env` files. `.gitignore` in the repo should exclude them.

Auth flow notes
- The backend exposes endpoints under `/api/auth` for register and login. Login returns a JWT; the frontend stores it in `localStorage` and uses an `AuthContext` to manage modal state and redirects.
- Register currently does not auto-login by default (the flow opens the login form after successful registration).

Developer notes & conventions
- Protected pages on the frontend (Dashboard, Donations, Settings) open an auth modal when accessed while unauthenticated. Landing, Campaigns, and Events are browseable without signing in.
- UI: The auth modal is mounted at the top-level to avoid blur; the forms contain their own toggle links for Sign in / Sign up.

Troubleshooting
- ERR_CONNECTION_REFUSED when calling backend: ensure the backend server is running on port `7001`. Check `backend/server.js` for the listening port.
- If the frontend can't find the backend, verify `src/services/authService.js` uses the correct base URL (should be `http://localhost:7001/api/auth`).
- If you change package manager or lockfile strategy, update `.gitignore` accordingly.

What I changed recently
- Moved and consolidated `.gitignore` entries at the repository root to reduce duplicates.
- Wired modal form toggles (Sign in / Sign up) to use the form-level buttons instead of header tabs.

Next steps / suggestions
- Add integration tests (Jest + React Testing Library) for auth flows.
- Optionally return a JWT on registration to auto-login new users (backend change needed).

If you'd like, I can:
- Run both servers here and perform a smoke test.
- Add a short troubleshooting script or `make` / `npm` tasks to start both servers together.

---
Generated on 2025-09-04