# AI-Powered ATS - Copilot Instructions

## Project Overview
Monorepo with **Express/PostgreSQL backend** and **React/Vite frontend** for an AI-powered Applicant Tracking System. Uses **Google Gemini AI** for resume parsing, candidate scoring, and interview question generation.

## Architecture

### Monorepo Structure
- `backend/` - Express.js API with Sequelize ORM
- `frontend/` - React 19 SPA with Vite, TailwindCSS, react-router-dom

### Backend (`backend/src`)
**Stack**: Express 5, Sequelize 6, PostgreSQL, JWT auth, Google Gemini AI, Multer (file uploads)

**Directory Structure**:
```
controllers/   → Handle HTTP requests, call services
services/      → Business logic (AI, candidate operations)
models/        → Sequelize models (User, Job, Candidate)
routes/        → Express route definitions
middleware/    → authMiddleware, errorHandler, rateLimiter
config/        → db.js (Sequelize), env.js, multer.js
utils/         → hybridScoring.js, resumeTextExtractor.js
```

**Key Patterns**:
- **MVC-ish**: Controllers → Services → Models
- **Role-based access**: `ADMIN` (all jobs) vs `RECRUITER` (own jobs only)
- **Auth**: JWT tokens (7-day expiry), `Authorization: Bearer <token>` header
- **Database**: PostgreSQL with JSONB columns (`aiParsedJson`, `scoreBreakdown`)
- **File uploads**: Multer stores resumes in `backend/uploads/resumes/`

### Frontend (`frontend/src`)
**Stack**: React 19, React Router 7, TailwindCSS 3, Axios, Recharts, react-hot-toast

**Directory Structure**:
```
pages/         → Top-level routes (Dashboard, Jobs, Candidates, etc.)
components/    → Reusable UI (Layout, StatCard, ScoreRing, Badge, etc.)
context/       → AuthContext (JWT state management)
services/      → api.js (Axios instance with interceptors)
hooks/         → useDebouncedValue, useIsMobile
```

**Key Patterns**:
- **API client**: `frontend/src/services/api.js` - Axios instance with JWT interceptor
- **Auth flow**: JWT stored in localStorage (`ats_token`, `ats_user`), decoded client-side
- **Context**: `AuthContext` manages user state, auto-decodes JWT on mount
- **Theme**: Custom Tailwind config with CSS variables in `index.css` for theming
- **Protected routes**: `ProtectedRoute` component wraps authenticated pages

## Critical Workflows

### Development Setup
```bash
# Backend
cd backend
npm install
# Create .env with: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, PORT
npm run dev  # Runs nodemon on port 5000

# Frontend (new terminal)
cd frontend
npm install
# Create .env with: VITE_API_URL (default: http://localhost:5000/api)
npm run dev  # Runs Vite on port 5173
```

### Database Management
- **Connection**: Uses `DATABASE_URL` env var (PostgreSQL connection string)
- **Sync**: On server start, Sequelize syncs models (controlled by `DB_SYNC_FORCE`/`DB_SYNC_ALTER`)
- **Migrations**: Manual SQL files in `backend/migrations/` (e.g., `20260218_update_user_role_enum.sql`)
- **Models**: Sequelize models define schema; associations in `backend/src/models/index.js`

### AI Service Integration (`backend/src/services/ai.service.js`)
**Google Gemini Model** (env: `GEMINI_API_KEY`, `GEMINI_MODEL`)

**Three main functions**:
1. **`parseResumeToJson(resumeText)`** - Extracts structured JSON from resume text:
   - Returns: `{ name, email, phone, skills[], education[], experience[], projects[], certifications[], summary, totalExperienceYears }`
   - **Important**: Prompt includes skill synonym expansion (e.g., "JavaScript" → also include "JS")

2. **`scoreResumeAgainstJob(resumeText, job)`** - Strict ATS scoring rubric (0-100):
   - **40 pts**: Skills match (divides 40 by number of required skills)
   - **35 pts**: Professional experience (distinguishes projects from paid work)
   - **25 pts**: Job description alignment
   - Returns: `{ score, reason, sectionScores: { skills, experience, alignment } }`

3. **`generateInterviewQuestions(candidate, job)`** - Creates 5 role-specific questions

### Hybrid Scoring System (`backend/src/services/candidate.service.js`)
**Formula**: `(AI×45%) + (Skills×30%) + (Semantic×15%) + (Experience×10%)`

**Components**:
- **AI Rubric** (45%): LLM evaluation using strict scoring rubric
- **Skill Match** (30%): Deterministic keyword matching with synonym resolution (`hybridScoring.js`)
- **Semantic Similarity** (15%): Embedding-based (Google Gemini embeddings + cosine similarity)
- **Experience Years** (10%): Candidate years vs required years (linear scoring)

**Skill Synonym Resolution** (`backend/src/utils/hybridScoring.js`):
- Maps common tech aliases: "JS"↔"JavaScript", "ML"↔"Machine Learning", "React"↔"ReactJS", etc.
- Resolves both required and candidate skills to canonical form before comparison
- Three-tier matching: exact canonical → substring → raw normalized

**Auto-status Assignment**:
- `≥75` → SHORTLISTED
- `<35` → REJECTED
- Else → APPLIED (default)

## Environment Variables

### Backend (`.env` in `backend/`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ats_db
JWT_SECRET=your-secret-key-change-in-production
GEMINI_API_KEY=your-google-ai-studio-key
GEMINI_MODEL=gemini-1.5-flash  # or gemini-1.5-pro
PORT=5000
FRONTEND_URL=http://localhost:5173  # For CORS
```

### Frontend (`.env` in `frontend/`)
```env
VITE_API_URL=http://localhost:5000/api
```

## Data Models

### User (`backend/src/models/User.js`)
```javascript
{ id, email, password (hashed), role: ENUM("ADMIN", "RECRUITER") }
```

### Job (`backend/src/models/job.js`)
```javascript
{ 
  id, title, description, 
  requiredSkills: STRING[], 
  experienceRequired: STRING,  // e.g., "2-4 years"
  userId (foreign key → User)
}
```

### Candidate (`backend/src/models/candidate.model.js`)
```javascript
{ 
  id: UUID, name, email, phone,
  jobId, recruiterId,
  resumePath: STRING,
  extractedText: TEXT,
  aiParsedJson: JSONB,           // Parsed resume structure
  aiScore: FLOAT,                // LLM rubric score (0-100)
  aiMatchReason: TEXT,
  hybridScore: FLOAT,            // Final weighted score
  scoreBreakdown: JSONB,         // { skills, semantic, experience, matchedSkills, missingSkills }
  status: ENUM("APPLIED", "SHORTLISTED", "REJECTED", "HIRED"),
  aiUpdatedAt: DATE
}
```

## API Conventions

### Authentication
- **Register**: `POST /api/auth/register` - Body: `{ email, password }`
- **Login**: `POST /api/auth/login` - Returns: `{ token }` (JWT, 7-day expiry)
- **Protected routes**: Require `Authorization: Bearer <token>` header

### Rate Limiting
- `/api/auth/*` routes: 5 requests per 15 minutes
- All `/api/*` routes: 100 requests per 15 minutes

### Key Endpoints
- **Jobs**: `GET/POST /api/jobs`, `DELETE /api/jobs/:id`
- **Candidates**: 
  - `POST /api/candidates/upload` (multipart/form-data: resume, name, email, jobId)
  - `GET /api/candidates/job/:jobId` (returns all candidates for job)
  - `PATCH /api/candidates/:id/status` (update candidate status)
  - `GET /api/candidates/:id/interview-questions` (AI-generated)
- **Dashboard**: `GET /api/dashboard` (stats: totalJobs, totalCandidates, shortlistedCount, hiredCount, rejectedCount)

## Frontend Patterns

### API Client (`frontend/src/services/api.js`)
```javascript
import { auth, jobs, candidates, dashboard } from './services/api';

// Usage:
await auth.login(email, password);           // Returns { data: { token } }
await jobs.getAll();                         // Returns { data: Job[] }
await candidates.uploadResume(formData);     // Multipart upload
await candidates.updateStatus(id, "SHORTLISTED");
```

**Interceptors**:
- Request: Auto-attaches JWT from localStorage
- Response: On 401 (non-auth routes), clears localStorage and redirects to `/login`

### Auth Context (`frontend/src/context/AuthContext.jsx`)
```javascript
const { user, token, isAuthenticated, loading, login, logout } = useAuth();
// login(token) - decodes JWT, stores in localStorage, updates state
// logout() - clears localStorage, resets state
```

### Component Conventions
- **Layouts**: `<Layout title="Page Title">` wrapper with sidebar/navbar
- **Loading states**: Use `<Skeleton />` component during data fetching
- **Tables**: Tailwind cards with responsive grid layouts (not `<table>`)
- **Icons**: `lucide-react` for consistent icon set
- **Charts**: `recharts` for dashboard visualizations
- **Toasts**: `react-hot-toast` for notifications

### Styling Conventions
- **Tailwind utility-first**: No custom CSS classes except theme variables
- **Card pattern**: `className="card"` (defined in `index.css` with shadow, rounded, padding)
- **Buttons**: `.btn` class with variants (`.btn-primary`, `.btn-danger`)
- **Colors**: Primary violet-600, success emerald-500, danger red-500
- **Typography**: `font-head` for headings (defined in Tailwind config)

## Common Pitfalls

1. **Resume parsing failures**: AI service gracefully degrades (stores `aiError` in candidate record, status remains APPLIED)
2. **Skill matching**: Always use `hybridScoring.js` functions, not raw string comparison
3. **Access control**: Controllers must check `canAccessJob(user, job)` for RECRUITER role
4. **File paths**: Resume paths stored as relative (`uploads/resumes/...`), resolved in controller
5. **JWT expiry**: Frontend auto-redirects to login on 401, except `/auth/*` routes
6. **Database sync**: In production, disable `DB_SYNC_FORCE` to prevent data loss

## Testing & Debugging

### Backend
```bash
# Manual API testing
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Frontend
- React DevTools: Inspect component state, context values
- Network tab: Check API responses, verify JWT in headers
- Console: Look for Axios errors (logged by interceptor)

## When Adding Features

1. **New model**: Create in `backend/src/models/`, add associations in `models/index.js`
2. **New API route**: 
   - Add controller in `backend/src/controllers/`
   - Add service logic in `backend/src/services/` (if complex)
   - Register route in `backend/src/routes/`
   - Update `backend/src/app.js` to mount route
3. **New page**: 
   - Create in `frontend/src/pages/`
   - Add route in `frontend/src/App.jsx` or router config
   - Add API call in `frontend/src/services/api.js`
4. **AI enhancements**: Modify prompts in `backend/src/services/ai.service.js`, test with real resumes

## Production Considerations

- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (32+ chars)
- Enable HTTPS (update CORS origins)
- Use managed PostgreSQL (update `DATABASE_URL`)
- Set `DB_SYNC_FORCE=false` and `DB_SYNC_ALTER=false`
- Increase rate limits if needed
- Add monitoring (error tracking, performance)
