# CodeSense Frontend — LLM Context

## Project Overview

CodeSense is a Next.js app that connects to GitHub repositories and provides AI-powered code review via configurable LLM providers. Users authenticate via Google OAuth, connect their GitHub account, select repositories, and configure LLM providers (Gemini, Ollama, AWS Bedrock, Nvidia) for automated PR review.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.2.2 (App Router, RSC) |
| React | 19.2.4 |
| Language | TypeScript 5.x (strict) |
| CSS | Tailwind CSS v4 (`@theme inline`), `tw-animate-css` |
| UI | shadcn/ui radix-nova style, lucide-react icons |
| Utilities | `clsx` + `tailwind-merge` (via `cn()`), `class-variance-authority` |
| Syntax | `react-syntax-highlighter` + `refractor` |
| Diff | `react-diff-view` |
| Linting | ESLint v9 with `eslint-config-next` |
| Git Hooks | husky v8 |

## Project Structure

```
src/
  app/              # Next.js App Router pages & layouts
    (auth)/         # Auth-adjacent routes (login)
    (protected)/    # Authenticated-only routes (dashboard, repos, settings, profile)
    (public)/       # Landing page
    auth/           # Auth API routes (google OAuth, logout, refresh)
    api/backend/    # Universal reverse proxy to backend API
  components/
    ui/             # shadcn/ui primitives (Button, Card, Input, Badge, Table, etc.)
  config/           # env.ts, routes.ts, site.ts
  lib/              # api.ts (fetch wrapper), utils.ts (cn), constants.ts, validations.ts
  modules/
    app-shell/      # Header, Sidebar, ProtectedLayoutShell
    auth/           # AuthProvider, LoginCard, OAuthButton, server session helpers
    github/         # GitHub integration: API client, hooks, components (repo table, PR details, PR diff)
    landing/        # Landing page sections (Hero, Features, Metrics, etc.)
    llm/            # LLM providers: API client, hooks, AddKeyDialog, provider grids
    theme/          # ThemeProvider, ThemeToggle
  store/            # Dead code — not used anywhere
  styles/           # globals.css (imported), tailwind.css (dead)
  types/            # Minimal global types (User, AuthState)
```

## Architecture & Key Patterns

- **No external state library** — React Context (auth, theme) + custom hooks with `useState` (useGithub, useLLM) + localStorage for persistence
- **Hooks-as-API** pattern: domain logic lives in custom hooks that expose state + action methods; components consume hooks
- **Server-side auth guard** in `(protected)/layout.tsx` — reads cookies, redirects if missing
- **Reverse proxy** — all `/api/backend/*` requests proxy to the backend API, keeping auth cookies server-side (no CORS issues)
- **Custom DOM events** for cross-cutting concerns (session expiry)
- **Module structure**: each module has `api/`, `components/`, `hooks/`, `types/`, optionally `providers/`, `server/`, `store/`, `pages/`

## State Management

- `AuthProvider` (React Context): `isAuthenticated`, `logout()`, snackbar state, session-expired listener
- `ThemeProvider` (React Context): theme preference, system preference detection, applies `.dark` class to `<html>`
- `useGithub()` hook: manages accounts, repos, selectedRepoIds, all action methods (connect, sync, save, unselect)
- `useLLM()` hook: manages provider groups, CRUD operations
- `src/store/index.ts` is **dead code** — do not use

## API Layer

1. **Server-side proxy**: `src/app/api/backend/[...backendPath]/route.ts` — forwards all HTTP methods, strips disallowed headers, forwards cookies
2. **Client-side fetch wrapper**: `src/lib/api.ts` — `apiFetch()` with auto 401 refresh, deduplication, session-expired event
3. **Module API objects**: `githubApi`, `llmApi` — plain objects of methods calling `apiFetch()`, throw typed errors (`GithubApiError`, `LLMApiError`)

## Routing

| URL | Access | Component |
|-----|--------|-----------|
| `/` | Public | LandingPage (redirects if authed) |
| `/login` | Public | LoginPage (redirects if authed) |
| `/dashboard` | Protected | DashboardPage |
| `/repositories` | Protected | RepositoriesPage |
| `/repositories/:repoId` | Protected | RepositoryConfigPage |
| `/repositories/:repoId/pull-requests/:prId` | Protected | PullRequestDetailsPage |
| `/profile` | Protected | ProfilePage (placeholder) |
| `/settings` | Protected | SettingsPage |
| `/github/callback` | Protected | GitHub App installation |
| `/github/oauth/callback` | Protected | GitHub OAuth callback |

## Coding Conventions

- **Path alias**: `@/` → `src/`
- **Named exports** for all components (except landing components and pages)
- **"use client"** directive at top of client components; server components have no directive
- **Type-only imports**: `import type { ... }`
- **PascalCase** for components, **camelCase** for hooks/utilities
- **File naming**: `Button.tsx`, `useAuth.ts`, `module.api.ts`, `module.types.ts`
- **CSS**: Tailwind v4 inline classes via `cn()` utility; CSS variables in `:root` / `.dark` via `@theme inline`
- **Error handling**: Custom error classes, user-friendly messages, retry buttons, `try/catch/finally`

## Environment Variables

```
API_URL=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run start` — Start production server

## Gotchas / Dead Code

- `src/store/index.ts` — unused global store (state handled via hooks+context)
- `src/lib/validations.ts` — unused zod schemas
- `src/lib/constants.ts` — `API_BASE_URL` not used (defined inline in api.ts)
- `src/styles/tailwind.css` — not imported (only `globals.css` is used)
- `src/modules/llm/api/llm-config.ts` — uses raw `fetch()` instead of `apiFetch()` (inconsistent)
- Theme init via inline `<Script beforeInteractive>` to prevent flash
