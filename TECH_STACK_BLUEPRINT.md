# Revenue Vault - Tech Stack Blueprint

## Overview
This document outlines the technology stack and project structure of the Revenue Vault application to facilitate replication.

## Technology Stack

### Framework & Runtime
- **Next.js 16.2.4** - React framework for server-side rendering and static site generation
- **React 19.2.4** - JavaScript library for building user interfaces
- **TypeScript 5.9.3** - Typed superset of JavaScript

### Styling
- **Tailwind CSS ^4** - Utility-first CSS framework
- **Tailwind-merge ^3.5.0** - Utility for conditionally combining Tailwind classes
- **PostCSS** - For processing Tailwind CSS

### State Management & Forms
- **React Hook Form ^7.74.0** - Performant form validation and handling
- **Zod ^4.3.6** - TypeScript-first schema validation library
- **Context API** - For global state management (AuthProvider)

### Authentication & Authorization
- **NextAuth.js ^4.24.14** - Authentication solution for Next.js
- **@auth/prisma-adapter ^2.11.2** - Prisma adapter for NextAuth

### Database & ORM
- **Prisma ^6.19.3** - ORM for database access
- **@prisma/client ^6.19.3** - Prisma client for database operations
- *Note: Requires a PostgreSQL database (configuration in .env)*

### Utilities & Libraries
- **Lucide React ^1.14.0** - Icon library
- **Clsx ^2.1.1** - Utility for constructing className strings conditionally
- **Nodemailer ^7.0.13** - Email sending functionality
- **Hookform Resolvers ^5.2.2** - Integration between React Hook Form and validation schemas

### Development Tools
- **ESLint ^9** - JavaScript/TypeScript linting
- **TS-Node ^10.9.2** - TypeScript execution environment for Node.js
- **Typescript** - Static type checker

## Project Structure

```
revenue-vault/
├── src/                    # Source code
│   ├── app/                # Next.js 13+ app directory
│   │   ├── (routes)/       # Page routes (dashboard, marketplace, admin, etc.)
│   │   ├── api/            # API route handlers
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   ├── loading.tsx     # Loading UI
│   │   └── not-found.tsx   # 404 page
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── chat/           # Chat interface components
│   │   ├── layout/         # Layout components (Footer, Navbar)
│   │   ├── marketplace/    # Marketplace-specific components
│   │   └── ...             # Other shared components
│   ├── lib/                # Utility functions and services
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── hooks/          # Custom React hooks
│   │   ├── prisma.ts       # Prisma client instance
│   │   └── validations.ts  # Zod validation schemas
│   └── proxy.ts            # Proxy configuration (if applicable)
├── prisma/                 # Prisma ORM configuration
│   ├── schema.prisma       # Database schema definition
│   └── seed.ts             # Database seeding script
├── public/                 # Static assets (images, icons, etc.)
├── .env                    # Environment variables (not in repo, see .env.example)
├── .gitignore              # Git ignore rules
├── AGENTS.md               # Agent configuration for Kilo
├── CLAUDE.md               # Claude-specific configuration
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration for Tailwind
├── prisma.config.ts        # Prisma configuration
├── README.md               # Project documentation
├── tsconfig.json           # TypeScript configuration
└── tsconfig.tsbuildinfo    # TypeScript build info
```

## Key Features Implemented
1. **Authentication System** - Sign-in, sign-up, session management with NextAuth
2. **Marketplace** - Listings browsing, creation, editing, and management
3. **Admin Dashboard** - User management, listings moderation, payment tracking, reports
4. **Communication System** - Messaging between users
5. **Payment Processing** - Integration for handling transactions
6. **Access Control** - Role-based permissions (admin, seller, buyer)
7. **Email Notifications** - Automated emails via Nodemailer
8. **Featured Listings** - Promoted listing functionality
9. **Access Requests** - System for requesting access to premium listings
10. **Deal Management** - Tracking of transaction progress

## Environment Variables Required
(.env file - create based on .env.example)
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/revenuevault?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (for Nodemailer)
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
EMAIL_FROM="noreply@revenuevault.com"

# Other configurations
# Add any additional environment variables as needed
```

## Setup Instructions for Replication
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL database
4. Copy `.env.example` to `.env` and configure variables
5. Run Prisma migrations: `npx prisma migrate dev`
6. Seed the database: `npm run prisma:seed`
7. Start development server: `npm run dev`
8. Build for production: `npm run build`
9. Start production server: `npm run start`

## Deployment Notes
- Optimized for Vercel deployment (Next.js framework)
- Can be deployed to any Node.js hosting platform
- Ensure environment variables are set in production environment
- Database should be accessible from the deployment environment

## License
[Specify license if applicable]

---
*Blueprint generated for replication purposes. Adjust versions and configurations as needed for your specific use case.*