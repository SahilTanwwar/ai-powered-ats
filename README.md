# AI-Powered ATS (Applicant Tracking System)

An **AI-powered Applicant Tracking System (ATS)** built as a full-stack app:
- **Frontend:** React + Vite + Tailwind UI
- **Backend:** Node.js + Express API
- **Database:** PostgreSQL (Sequelize ORM)

It helps recruiters manage jobs and candidates, upload resumes (PDF/DOCX), and generate AI-assisted insights like **candidate ranking** and **interview questions**.

---

## What this project does

### Core workflow
1. Create a **Job** (role + requirements).
2. Upload a **Candidate resume** (PDF/DOCX) for a job.
3. The backend parses the resume and stores candidate data.
4. Candidates can be **ranked/matched to a job** (hybrid ranked list).
5. Recruiters can:
   - search candidates globally
   - generate **AI interview questions** for a candidate
   - add notes and tags
   - update candidate status

---

## Features (from the codebase)

### Authentication & Roles
- Email/password auth with JWT
- Self-registration creates a `RECRUITER` with `PENDING` status (requires admin approval)
- Role-based access control (`ADMIN`, `RECRUITER`)

### Candidate management
- Upload resume: `POST /api/candidates/upload`
- List candidates by job (ranked): `GET /api/candidates/job/:jobId`
- Global search: `GET /api/candidates/search?q=...`
- Candidate status update: `PATCH /api/candidates/:id/status`
- Candidate deletion (admin only): `DELETE /api/candidates/:id`

### AI features
- Generate interview questions:
  - `GET /api/candidates/:candidateId/interview-questions`
- Uses Google Generative AI SDK (`@google/generative-ai`)

### Dashboard & Admin
- Dashboard stats: `GET /api/dashboard`
- User management endpoints under `/api/users`
- Audit logs endpoints under `/api/audit-logs`

### Health check
- `GET /api/health` → confirms backend is running

---

## Repository structure

- `frontend/` — React + Vite client
- `backend/` — Express API + Sequelize + PostgreSQL
- `.github/` — GitHub configuration

---

## Tech Stack

**Frontend**
- React, Vite
- Tailwind CSS
- React Router
- Axios
- Recharts + Framer Motion

**Backend**
- Node.js, Express
- PostgreSQL + Sequelize
- Auth: JWT, bcrypt
- Upload + resume parsing: multer, pdf-parse, mammoth, docx
- AI: `@google/generative-ai`
- Email: nodemailer
- Security: rate limiting (`express-rate-limit`), CORS

---

## Getting started (Local setup)

### Prerequisites
- Node.js (LTS recommended)
- PostgreSQL database
- (Optional) Google Generative AI API key (Gemini)
- (Optional) SMTP credentials if email features are enabled

---

## Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Required auth secret (backend exits if missing)
JWT_SECRET=replace_with_a_long_random_secret

# Database (PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME

# Optional: DB sync behavior
DB_SYNC_FORCE=false
DB_SYNC_ALTER=false
```

Run backend:

```bash
npm run dev
# or
npm start
```

Backend will run on:
- `http://localhost:5000`

---

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:
- `http://localhost:5173`

---

## API Overview (main routes)

Base URL: `http://localhost:5000`

- Auth: `/api/auth`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Health: `GET /api/health`
- Dashboard: `GET /api/dashboard` (protected)
- Jobs: `/api/jobs` (protected)
- Candidates: `/api/candidates` (protected)
  - `POST /api/candidates/upload`
  - `GET /api/candidates/job/:jobId`
  - `GET /api/candidates/search?q=...`
  - `GET /api/candidates/:candidateId/interview-questions`
  - Notes:
    - `GET /api/candidates/:candidateId/notes`
    - `POST /api/candidates/:candidateId/notes`
    - `DELETE /api/candidates/:candidateId/notes/:noteId`
  - Tags:
    - `POST /api/candidates/:id/tags`
    - `DELETE /api/candidates/:id/tags/:tag`

> Many routes require JWT + recruiter/admin roles.

---

## Notes / Improvements (recommended)
- Add a `backend/.env.example` so setup is easier for others.
- Add screenshots/GIFs under a `/screenshots` folder and link them here.
- Add a root `package.json` with workspace scripts (optional) to start frontend+backend together.

---

## License
Choose a license (MIT recommended) if you want others to reuse the project.