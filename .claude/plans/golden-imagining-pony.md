# Plan: Add Filters and Pagination to Admin Listings Page

## Context
The admin listings management page (`/admin/listings`) currently loads all pending listings without any filtering or pagination, which will not scale.

## Approach
1. **Filters**: Add filters for listing status (PENDING, PUBLISHED, REJECTED) and a search input for title/description.
2. **Pagination**: Implement basic server-side pagination using `skip` and `take` with Prisma.
3. **UI/UX**: Reuse the filter/sort pattern implemented for the User Management page.

## Steps
1. **Backend Update**: Modify `src/app/admin/listings/page.tsx` to handle `q` (search), `status` (filter), `page`, and `limit` query parameters.
2. **Database Query**: Update the Prisma query to dynamically include filtering (`where`) and pagination (`skip`, `take`).
3. **Frontend UI**: Create a `ListingFilters` component (or reuse logic if applicable) and add pagination controls at the bottom of the list.

## Verification
1. Navigate to `/admin/listings`.
2. Apply status and search filters, and ensure results update.
3. Verify pagination controls (Next/Previous page) work and correctly fetch different sets of listings.
