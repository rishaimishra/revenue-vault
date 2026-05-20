# Plan: Multi-Step Listing Creation Flow

## Context
The current listing creation flow is a single large form. The user requested a 5-step wizard for better UX:
1. Basic Info
2. Business Details
3. Financials
4. Assets & Traction
5. Seller Verification

## Approach
1. **Schema Update**: Update `prisma/schema.prisma` to include the new fields required for the multi-step form (tagline, country, founded year, business model, USP, reason for selling, website, customer count, traffic, etc.).
2. **Validation**: Update `src/lib/validations.ts` to include the new fields with appropriate Zod schemas for multi-step validation.
3. **Form Component**: Refactor `src/app/listings/new/page.tsx` into a multi-step form wizard using state management (e.g., `useState` for current step).
4. **Backend Update**: Update the API handler for `POST /api/listings` to accept the expanded dataset.
5. **Database Migration**: Run `npx prisma db push` to synchronize changes.

## Steps
1. Add necessary fields to `StartupListing` model in `prisma/schema.prisma`.
2. Expand `listingSchema` in `src/lib/validations.ts` to match the new form structure.
3. Redesign `src/app/listings/new/page.tsx` to include `step` state and conditional rendering for each section.
4. Update `onSubmit` handler to send the collected form data to `POST /api/listings`.

## Verification
1. Navigate to `/listings/new`.
2. Progress through all 5 steps of the form.
3. Ensure validation triggers correctly for each step.
4. Verify that submitting the final step correctly saves all data to the database.
