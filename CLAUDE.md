# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint to check for code quality.

## Architecture
RevenueVault is a Next.js 14+ marketplace platform.

### Key Directories
- `src/app`: Application pages and API routes (Next.js App Router).
- `src/components`: Reusable UI components.
- `src/lib`: Shared utilities (Prisma client `prisma.ts`, Auth configuration `auth.ts`, Zod schemas `validations.ts`).
- `prisma/schema.prisma`: The single source of truth for the database schema.

### Core Flows
- **Authentication**: Uses NextAuth.js with Prisma adapter (`src/lib/auth.ts`).
- **Listings**: CRUD operations reside in `src/app/api/listings` and UI components in `src/components/marketplace`. Listings default to `PENDING_APPROVAL`.
- **Admin**: All admin operations are gated under `src/app/admin` and API routes in `src/app/api/admin`.
- **Deals/Chat**: Access requests are managed via `src/app/api/access-requests`. Chat functionality is built upon the deal status tracking system.

### Development Guidelines
- Always maintain type safety using TypeScript.
- Use Zod schemas in `src/lib/validations.ts` for validating API inputs and form data.
- When modifying the database schema, update `prisma/schema.prisma` and run `npx prisma db push` or `npx prisma migrate dev`.
- Ensure sensitive operations in API routes verify user session and roles (Admin/Buyer/Seller).
