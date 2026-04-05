# Epitaphe 360 — Copilot Instructions

## Project Overview
Funeral services management platform (Epitaphe 360) with CMS, client portal, payment system, and public website.

## Tech Stack
- **Backend**: Express.js + TypeScript, Drizzle ORM, PostgreSQL (Supabase)
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn/ui, wouter (router)
- **CMS Dashboard**: `cms-dashboard/` with Zustand auth store
- **Payments**: Stripe integration
- **Email**: Nodemailer SMTP
- **Deployment**: Railway (auto-deploy from `main` branch)

## Project Structure
```
server/           — Express backend (routes, middleware, DB)
client/src/       — React SPA frontend
cms-dashboard/    — Admin CMS dashboard
shared/schema.ts  — Drizzle ORM schema (shared types)
migrations/       — PostgreSQL migration SQL files
```

## Key Conventions
- **Validation**: Use Zod schemas for all API input validation
- **Auth**: JWT tokens, bcrypt password hashing, `requireAdmin` middleware
- **DB queries**: Drizzle ORM (parameterized by default, no raw SQL)
- **Frontend state**: React Query (@tanstack/react-query) for server state, Zustand for auth
- **Styling**: Tailwind CSS utility classes, shadcn/ui components
- **Security**: Helmet CSP, CORS whitelist, rate limiting on sensitive endpoints

## Code Style
- TypeScript strict mode, no `any` types
- camelCase for variables/functions, PascalCase for types/components
- Async/await with try/catch for error handling
- Named exports preferred over default exports
