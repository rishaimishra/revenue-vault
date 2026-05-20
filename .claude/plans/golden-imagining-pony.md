# Plan: Admin Dashboard Refactoring

## Context
The admin dashboard (`/admin`) currently aggregates all data (listings, users, reports, payments) on a single page. The user wants to break this out into separate pages for better organization, as requested by the addition of the new sidebar.

## Recommended Approach
1.  **Extract Data Modules**: Create a shared service file (or reuse current ones if appropriate) for fetching distinct data types (listings, users, reports, payments).
2.  **Create Reusable UI Components**: Move the `table` and `list` components from `admin/page.tsx` into individual components in `src/components/admin/` (e.g., `PendingListingsTable.tsx`, `UserTable.tsx`, `ReportList.tsx`, `PaymentsTable.tsx`).
3.  **Update Pages**:
    -   `/admin/page.tsx`: Keep only the "Stats Overview" and maybe a small summary view.
    -   `/admin/listings/page.tsx`: Display the full list of all listings (or specifically pending ones).
    -   `/admin/users/page.tsx`: Display the full list of users.
    -   `/admin/reports/page.tsx`: Display the full list of reports.
    -   `/admin/payments/page.tsx`: Display the full list of payments.

## Steps
1.  Analyze `admin/page.tsx` to identify the sections.
2.  Create/Update components in `src/components/admin/`:
    - `PendingListings.tsx`
    - `UserVerificationTable.tsx`
    - `ReportsTable.tsx`
    - `PaymentsTable.tsx`
3.  Implement each route:
    - `src/app/admin/listings/page.tsx`
    - `src/app/admin/users/page.tsx`
    - `src/app/admin/reports/page.tsx`
    - `src/app/admin/payments/page.tsx`
4.  Update `src/app/admin/page.tsx` to display summary only.

## Verification
1.  Verify the dashboard home (`/admin`) shows the stats only.
2.  Verify each sidebar link leads to the correct page populated with the appropriate list/table data.
