# code-test

# ER CareView — Patient Registration

Option C. Form submission with shared Zod validation, TanStack Query mutation,
and accessible UI.

## Decisions

- **useReducer over React Hook Form** — four fields don't justify a form library.
  The reducer makes state transitions explicit and testable.
- **Shared Zod schema** — same schema validates on blur (client), on submit (client),
  and in the API route (server). One source of truth.
- **CSS Modules** — scoped styles with no build-time utility class resolution.
  Design tokens via CSS custom properties.
- **Custom hooks as primary abstraction** — `useRegistrationForm` owns all form logic.
  The component is a thin render shell.
- **Colocated tests** — test files sit next to the code they test.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/register](http://localhost:3000/register).

## Running Tests

```bash
npm test
```

15 tests across 3 files covering validation logic, component behaviour, and API contract.

## Project Structure

```
src/
  app/              → Next.js App Router pages and API routes
  features/         → Domain-specific code (registration)
  components/       → Shared UI components (FormRow, ActionButton, StatusMessage)
  lib/              → Shared logic (Zod validation schema)
  types/            → Shared TypeScript types
  styles/           → Global CSS and design tokens
```

## What I'd Add

- Playwright E2E covering the full browser interaction
- Accessible date picker component
- Server Actions for progressive enhancement
- Rate limiting on the API route
- Error boundary for unexpected failures
