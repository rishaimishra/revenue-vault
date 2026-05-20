# Plan: Add Sorting and Filtering to Admin User Management

## Context
The user requested sorting and filtering functionality for the admin user listing page (`/admin/users`). Currently, this page loads a static list of users.

## Approach
1. **Frontend UI**: Add a search input (for filtering by name/email) and dropdowns (for filtering by role/verification status and sorting by date) to `src/app/admin/users/page.tsx`.
2. **Backend/API Interaction**: Update `src/app/admin/users/page.tsx` to handle these query parameters and perform a filtered/sorted `prisma.user.findMany` query.
3. **Component Update**: Keep the existing `UserTable` as it is simple and reusable.

## Steps
1. Update `src/app/admin/users/page.tsx`:
   - Change component to `"use client"` or maintain as server component but use URLSearchParams to handle filter/sort state.
   - Use `next/navigation` to read search parameters.
   - Update `prisma.user.findMany` query with dynamic `where` and `orderBy` clauses based on searchParams.
   - Add filter/sort UI components at the top of the page.
2. Implement logic:
   - Search: Filter by name or email.
   - Role filter: Filter by user role.
   - Sorting: Sort by createdAt (asc/desc).

## Verification
1. Navigate to `/admin/users`.
2. Apply filters and sorting.
3. Verify the URL updates with query parameters and the list refreshes with correctly filtered/sorted data.
