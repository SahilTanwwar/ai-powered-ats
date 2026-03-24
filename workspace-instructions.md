# Workspace Instructions Template

## Template
1. **Project Rundown** — One paragraph that orients readers to the architecture, business domain, and high-level folders they will touch.
2. **Quick Setup & Tooling** — Commands for installing dependencies plus environment variables or credentials that must be configured before running the app.
3. **Development Workflows** — Approval-required CPUs such as linting, formatting, test, or scaffolding commands along with any manual verification steps.
4. **Architecture and Patterns** — Key services, utilities, data flows, and code conventions (naming, styling, error handling, data modeling) that team members must follow.
5. **Pitfalls & Anti-Patterns** — Frequent sources of bugs or rework and behaviors that should be avoided.
6. **Verification & Testing** — How to run tests/builds and what to look for in outputs or logs.

## Principles
- Keep it concise and scoped to things that would save an engineer at least 15 minutes of trial-and-error work.
- Prefer concrete instructions over vague guidance ("Run `npm run dev`" instead of "Use the dev server").
- Surface the difference between similar flows (backend vs frontend, admin vs recruiter, dev vs prod). 
- Mention the files or directories that exemplify the patterns you are describing.
- Keep the tone collaborative and actionable; assume the reader has read the README but might still need context.

## Anti-Patterns
- Copying README verbatim without filtering for the team context.
- Listing every file without explaining why it matters.
- Prescribing code style without linking to the authoritative source (e.g., lint config or shared styles).
- Ignoring where local overrides (env vars, scripts) diverge from defaults used in documentation.
- Forgetting to mention the commands that agents and humans both rely on for testing and verification.
