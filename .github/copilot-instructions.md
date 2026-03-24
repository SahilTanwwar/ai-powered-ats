# AI-Powered ATS — Copilot Instructions

Refer to [workspace-instructions.md](workspace-instructions.md) for the template, the principles we follow, and the behaviors we avoid when authoring workspace-level guidance.

## Project Snapshot
AI-powered applicant tracking in a single monorepo: the Express/Sequelize backend ingests and scores resumes with Google Gemini AI, while the React/Vite frontend lets recruiters administer jobs, review candidates, and request interview questions.

## Quick Setup

### Backend (API server)
1. `cd backend`
2. `npm install`
3. Copy `.env.example` or create `.env` with `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT` (default 5000), and `FRONTEND_URL` for CORS.
4. `npm run dev` starts Nodemon-driven server on port 5000 (production: `npm start`).
5. Keep `DB_SYNC_FORCE`/`DB_SYNC_ALTER` false in production to avoid data loss.
6. Resume uploads land in `backend/uploads/resumes/`; controllers convert those relative paths into URLs.

### Frontend (React SPA)
1. `cd frontend`
2. `npm install`
3. Create `.env` with `VITE_API_URL` (usually `http://localhost:5000/api`).
4. `npm run dev` runs Vite on 5173; use `npm run build`/`npm run preview` for production checks and `npm run lint` for ESLint.
5. Authentication state resides in `localStorage` under `ats_token`/`ats_user` and is bootstrapped inside `AuthContext`.

## Key Workflows
- **API services**: Axios client at `frontend/src/services/api.js` attaches the JWT and retries 401s by forcing a logout + redirect to `/login` (except auth routes).
- **Role-aware access**: `ADMIN` sees every job while `RECRUITER` must only interact with jobs that satisfy `canAccessJob(user, job)`; controllers enforce this check for every recruiter-affecting route.
- **Hybrid scoring**: `candidate.service` blends LLM (`aiScore`), deterministic skill matching (`hybridScoring.js`), semantic similarity (embeddings), and experience years to compute `hybridScore` (45% AI, 30% skills, 15% semantic, 10% experience).
- **Auto-status thresholds**: `>=75` → `SHORTLISTED`, `<35` → `REJECTED`, otherwise `APPLIED`.
- **Admin scripts**: `backend/scripts/fix-pending-users.js` and `seed-admin.js` perform targeted maintenance tasks; run them from the backend root.

## Architecture Highlights
- **Backend layers**: Routes live under `backend/src/routes`, controllers under `controllers`, and services under `services` (especially `ai.service.js` for Google Gemini prompts and `candidate.service.js` for scoring).
- **AI service key functions**: `parseResumeToJson`, `scoreResumeAgainstJob`, and `generateInterviewQuestions` each wrap Gemini calls with scoring logic that emits structured JSON, rubric scores, and tailored interview questions.
- **Middleware**: `authMiddleware`, `role.middleware`, `rateLimiter`, and `errorHandler` all load in `backend/src/app.js`; rate limiting defaults: 5 requests/15 min on `/api/auth/*`, 100/15 min on other `/api/*`.
- **Utility pieces**: `hybridScoring.js` canonicalizes aliases (`JS` ↔ `JavaScript`, `React` ↔ `ReactJS`, etc.) before matching skills; `resumeTextExtractor.js` turns uploaded PDFs into text for Gemini.
- **Frontend structure**: Pages under `frontend/src/pages`, shared layout components under `components/layout`, and contexts for auth, theme, and toast notifications under `context/`.

## Conventions & Patterns to Follow
- Keep Tailwind-driven styling (no new CSS files); lean on `className="card"`, `.btn` variants, and `font-head` for headings.
- Tightly scope API clients to `frontend/src/services/api.js` and use `ProtectedRoute`/`AuthContext` to guard routes; avoid direct `fetch` calls that bypass the JWT interceptor.
- Use `lucide-react` icons, `Skeleton` during loading states, and `ScoreRing`/`StatCard` components for dashboard metrics.
- Always pass the recruiter’s token when invoking backend endpoints; the backend expects `Authorization: Bearer <token>` and validates it via `authMiddleware`.
- `Candidate` records persist `aiParsedJson`, `scoreBreakdown`, `hybridScore`, and `aiScore` in JSONB columns; keep the `aiMatchReason` text in sync when re-scoring.
- When extending the API, add controllers under `controllers/`, push complex logic to `services/`, import into `routes/`, and wire the route into `backend/src/app.js`.

## Pitfalls & Anti-Patterns
1. Treating resume parsing as guaranteed—Gemini can fail, so capture `aiError`, mark status as `APPLIED`, and surface the failure reason without blocking uploads.
2. Matching skills with raw string comparisons (always normalize through `hybridScoring.js`).
3. Skipping `canAccessJob` in recruiter flows—failure to check leaks other recruiters’ data.
4. Forgetting to sync env-based rate limits before deploying (the defaults assume `FRONTEND_URL` is `http://localhost:5173`).
5. Hardcoding resume paths outside `uploads/resumes`; always use the relative path stored on the candidate record.

## Verification & Testing
- Backend: `npm run dev` + manual `curl` calls (e.g., login at `/api/auth/login`) and inspect Sequelize logs for sync issues.
- Frontend: `npm run lint`, `npm run build`, `npm run dev` (manual QA in browser). No automated unit tests exist—rely on targeted API requests, log inspection, and the UI to confirm flows.

## Production Considerations
- Set `NODE_ENV=production`, disable `DB_SYNC_FORCE`, and lock down `FRONTEND_URL` for CORS.
- Secure `JWT_SECRET` (32+ chars) and rotate `GEMINI_API_KEY`/`GEMINI_MODEL` when moving to prod Gemini models.
- Increase monitoring on the AI scoring endpoints (Gemini latency or errors) and watch for 401 responses that trigger the frontend logout flow.
