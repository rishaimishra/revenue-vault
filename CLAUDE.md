# RevenueVault Codebase Documentation

## Project Overview
RevenueVault is a startup marketplace platform for anonymous buying and selling of startups.

## Tech Stack
- **Frontend/Backend**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Google + Email)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Next.js Server Components

## Key Modules Implemented (MVP)
- **User System**: NextAuth integration with Role Selection (Buyer/Seller) and Profile management.
- **Listings Marketplace**: Seller listing creation, Buyer browsing with category filters and text search.
- **Messaging System**: Request-access mechanism and approved-only chat with polling-based updates.
- **Deal Management**: Status tracking (Interested -> Accepted -> In Progress -> Closed).
- **Admin Panel**: Listing approval workflow, User Trust Verification, and Deal Tracking dashboard.
- **Payments**: Simulated Stripe/Razorpay flow for subscriptions and featured listings.

## Key Directories
- `src/app`: Pages, layouts, and API routes.
- `src/components`: UI components (Admin, Chat, Marketplace, Navbar, Providers).
- `src/lib`: Shared utilities (Prisma client, Auth config, Hooks, Validations).
- `prisma/schema.prisma`: Database schema and enums.

## Development Guidelines
- **Type Safety**: Use TypeScript for all new code. Use Zod for validation.
- **Access Control**: Always verify user session and role before performing sensitive operations.
- **Navigation**: Use the global `Navbar` for consistency.
- **Styling**: Stick to Tailwind CSS patterns. Use `lucide-react` for icons.
- **Listing Flow**: Listings default to `PENDING_APPROVAL`. Admins must publish them via `/admin`.
- **Chat Flow**: Access requests must be `APPROVED` by sellers before a `Deal` is created and chat begins.
