# Epitaphe 360 - Agency Website

## Overview

This is a modern creative agency website for Epitaphe 360, a 360° communication agency based in Casablanca, Morocco. The site is a single-page application featuring a hero section, services showcase, client testimonials, portfolio gallery, blog section, and contact form. The design follows Awwwards-style agency aesthetics with bold typography (Montserrat/Muli fonts), generous whitespace, and sophisticated interactions. Content is in French.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api/*`
- **Development**: Vite middleware for HMR in development
- **Production**: Static file serving from `dist/public`

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Current Tables**: `users`, `contact_messages`
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`
- **Fallback**: In-memory storage (`MemStorage`) when database unavailable

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Page sections and UI components
│   │   ├── pages/        # Route pages (home, not-found)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── static.ts     # Static file serving
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migrations
```

### Design System
- **Primary Color**: Pink/Magenta (#E91E63 equivalent in HSL)
- **Accent Color**: Teal
- **Typography**: Montserrat (headings), Muli (body)
- **Theme**: CSS variables with light/dark mode toggle
- **Spacing**: Tailwind's spacing scale (4, 8, 12, 16, 20, 24, 32)

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **zod**: Runtime schema validation
- **react-hook-form**: Form state management with `@hookform/resolvers`

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **class-variance-authority**: Component variant styling
- **tailwind-merge**: Tailwind class merging utility
- **lucide-react**: Icon library
- **embla-carousel-react**: Carousel component

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for Express

### Build & Development
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database migration tooling

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling