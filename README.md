<h1 align="center">
  <br>
  🤖 AI-Powered ATS
  <br>
</h1>

<p align="center">
  <strong>A full-stack, AI-driven Applicant Tracking System for modern hiring teams.</strong><br>
  Parse resumes · Rank candidates · Schedule interviews · Manage your pipeline — all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Sequelize-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🧠 AI-Powered Intelligence
- **Resume Parsing** — Automatically extracts name, skills, experience, education, and projects from PDF/DOCX resumes using Gemini AI
- **Smart Scoring** — Hybrid ranking engine combining keyword matching (ATS score) with semantic similarity (embedding cosine similarity) for accurate candidate ranking
- **Interview Questions** — Generates role-specific technical interview questions based on the candidate's resume and job description

### 👥 Role-Based Access Control
| Role | Capabilities |
|------|-------------|
| **Admin** | Full access: manage users, approve recruiters, view all data, audit logs |
| **Recruiter** | Manage jobs, upload resumes, rank candidates, schedule interviews |
| **Candidate** *(public)* | Browse jobs, submit applications |

### 📊 Recruitment Pipeline
- Create and manage **job postings** with required skills and descriptions
- Upload candidate resumes (PDF/DOCX) and auto-parse them in seconds
- View a **ranked leaderboard** of candidates per job (hybrid AI score)
- Update candidate status: `New → Shortlisted → Interviewing → Hired / Rejected`
- Add **private notes** and **tags** to candidates for collaboration
- Track all actions via **Audit Logs**

### 📅 Interview Management
- Schedule interviews with date, time, and join link (Google Meet, Zoom, etc.)
- View upcoming interviews per job or per candidate
- Email notifications sent automatically on scheduling

### 🔒 Security
- JWT-based authentication with secure `httpOnly` approach
- Rate limiting on all API routes (stricter on auth endpoints)
- CORS locked to configured frontend origin
- Passwords hashed with `bcrypt` (salt rounds: 10)

### 💅 Modern UI
- LinkedIn-style **Feed, Network, and Profile** pages
- Responsive dark/light theme with smooth animations (Framer Motion)
- Role-specific dashboards with charts (Recharts)
- Drag-and-drop resume upload

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + Vite | UI framework + fast dev server |
| React Router v7 | Client-side routing |
| Axios | HTTP client with interceptors |
| Framer Motion | Animations and transitions |
| Recharts | Dashboard charts |
| Lucide React | Icon library |
| React Hook Form | Form management |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express 5 | API server |
| PostgreSQL + Sequelize | Database + ORM |
| JSON Web Token (JWT) | Authentication |
| bcrypt | Password hashing |
| Multer | File uploads (resume PDF/DOCX) |
| pdf-parse + Mammoth | Resume text extraction |
| @google/generative-ai | Gemini AI (parsing, scoring, embeddings) |
| Nodemailer | Email notifications |
| express-rate-limit | API rate limiting |

---

## 📁 Project Structure

```
ai-powered-ats/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, multer, env config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Auth, rate limiter, error handler
│   │   ├── models/          # Sequelize models (User, Job, Candidate…)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic (AI, email, candidate)
│   │   ├── utils/           # Helper utilities
│   │   ├── app.js           # Express app setup + middleware
│   │   └── server.js        # Entry point (DB sync + server start)
│   ├── uploads/             # Runtime file uploads (gitignored)
│   ├── .env.example         # ← copy to .env and fill in your values
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instances
│   │   ├── components/      # Reusable UI components
│   │   │   ├── layout/      # Sidebar, Navbar, etc.
│   │   │   └── linkedin/    # Feed, PostCard, PeopleCard
│   │   ├── context/         # AuthContext (JWT + user state)
│   │   ├── layout/          # Page layout wrappers
│   │   ├── pages/           # Route-level pages
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── candidate/   # Candidate portal pages
│   │   │   └── employer/    # Employer/recruiter pages
│   │   ├── services/        # API service wrappers
│   │   ├── App.jsx          # Root component + router
│   │   └── main.jsx         # App entry point
│   ├── .env.example         # ← copy to .env and fill in your values
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ (LTS recommended) — [Download](https://nodejs.org/)
- **PostgreSQL** v14+ — [Download](https://www.postgresql.org/download/)
- **Google Gemini API Key** — [Get one free](https://aistudio.google.com/)
- *(Optional)* Gmail App Password for email features — [Setup guide](https://support.google.com/accounts/answer/185833)

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file from the template
cp .env.example .env
# On Windows:
# copy .env.example .env

# 4. Edit .env with your real values (DB, JWT secret, Gemini key)
# See Environment Variables section below

# 5. Start the development server
npm run dev
```

> ✅ Backend runs on **http://localhost:5000**

> **First run tip:** Set `DB_SYNC_FORCE=true` in `.env` to create all database tables automatically, then set it back to `false`.

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create your environment file from the template
cp .env.example .env
# On Windows:
# copy .env.example .env

# 4. (Optional) Edit VITE_API_URL if your backend runs on a different port

# 5. Start the dev server
npm run dev
```

> ✅ Frontend runs on **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend — `backend/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `FRONTEND_URL` | Yes | Frontend URL for CORS (e.g. `http://localhost:5173`) |
| `JWT_SECRET` | **Yes** | Long random string for signing tokens. App won't start without it |
| `DATABASE_URL` | **Yes** | Full PostgreSQL connection URL (`postgresql://USER:PASS@HOST:5432/DB`) |
| `DB_SYNC_FORCE` | No | `true` to drop and recreate all tables (⚠️ destructive!) |
| `DB_SYNC_ALTER` | No | `true` to add missing columns without data loss |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for AI features |
| `GEMINI_MODEL` | No | Gemini model name (default: `gemini-1.5-flash`) |
| `GEMINI_EMBEDDING_MODEL` | No | Embedding model (default: `gemini-embedding-001`) |
| `SMTP_HOST` | No | SMTP server host (default: `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_USER` | No | Email address for sending notifications |
| `SMTP_PASS` | No | Email password / App Password |

> 💡 Email settings are optional — the app works without them, skipping email notifications.

### Frontend — `frontend/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: `http://localhost:5000/api`) |

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | None | Register a new recruiter |
| `POST` | `/api/auth/login` | None | Login and receive JWT |
| `PATCH` | `/api/auth/change-password` | JWT | Change your password |

### Jobs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/jobs` | JWT | Get all jobs (admin/recruiter) |
| `GET` | `/api/jobs/public` | None | Get public job listings |
| `POST` | `/api/jobs` | JWT | Create a new job |
| `DELETE` | `/api/jobs/:id` | JWT | Delete a job |

### Candidates
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/candidates/upload` | JWT | Upload resume for a job (PDF/DOCX) |
| `POST` | `/api/candidates/apply` | None | Public job application |
| `GET` | `/api/candidates/job/:jobId` | JWT | Get ranked candidates for a job |
| `GET` | `/api/candidates/search?q=` | JWT | Global candidate search |
| `PATCH` | `/api/candidates/:id/status` | JWT | Update candidate status |
| `DELETE` | `/api/candidates/:id` | JWT (Admin) | Delete a candidate |
| `GET` | `/api/candidates/:id/interview-questions` | JWT | Generate AI interview questions |
| `GET/POST/DELETE` | `/api/candidates/:id/notes` | JWT | Manage recruiter notes |
| `POST/DELETE` | `/api/candidates/:id/tags/:tag` | JWT | Manage candidate tags |

### Interviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/interviews` | JWT | Schedule an interview |
| `GET` | `/api/interviews/upcoming` | JWT | Get upcoming interviews |
| `GET` | `/api/interviews/job/:jobId` | JWT | Interviews for a job |
| `PATCH` | `/api/interviews/:id` | JWT | Update interview details |

### Admin & Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users` | JWT (Admin) | List all users |
| `PATCH` | `/api/users/:id/status` | JWT (Admin) | Approve/suspend a user |
| `GET` | `/api/dashboard` | JWT | Dashboard stats |
| `GET` | `/api/audit-logs` | JWT (Admin) | View all audit logs |
| `GET` | `/api/health` | None | Health check |

---

## 🚀 Deployment

### Recommended: [Render.com](https://render.com/) (Free tier available)

**1. Database** → New PostgreSQL → copy the Internal Database URL

**2. Backend** → New Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: add all from `backend/.env.example`

**3. Frontend** → New Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variables: `VITE_API_URL=https://your-backend.onrender.com/api`

> After deploy, set `FRONTEND_URL` in your backend service to your frontend's live URL.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with clear messages: `git commit -m "feat: add your feature"`
4. Push to your fork and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for personal and commercial projects.

---

<p align="center">
  Built with ❤️ using React, Node.js, PostgreSQL &amp; Google Gemini AI
</p>