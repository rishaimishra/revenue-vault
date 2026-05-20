# Plan: Add Rejection Reason to Admin Listing Rejection

## Context
The admin currently rejects listings with a simple "Reject" button in `AdminListingActions`, but the user needs to provide a reason for the rejection, which should be stored.

## Recommended Approach
1. **Database Schema**: Add a `rejectionReason` field (optional string) to `StartupListing` model in `prisma/schema.prisma`.
2. **UI Component (`AdminListingActions`)**: Update the `AdminListingActions` component to include a prompt (e.g., using `window.prompt`) or a small modal to capture the reason when "Reject" is clicked.
3. **API Endpoint (`src/app/api/admin/listings/[id]/route.ts`)**: Update the `PATCH` handler to accept `rejectionReason` and store it in the database.

## Steps
1. Add `rejectionReason String?` to `StartupListing` in `prisma/schema.prisma` and run `npx prisma db push`.
2. Update `src/app/api/admin/listings/[id]/route.ts` to update the new field when `status === 'REJECTED'`.
3. Update `src/components/admin/AdminListingActions.tsx`:
   - Replace the simple alert with a `window.prompt` or a simple state-based input to capture the reason.
   - Send the reason in the `PATCH` body.

## Verification
1. Navigate to `/admin/listings`.
2. Click "Reject" on a listing.
3. Enter a reason in the prompt/input.
4. Confirm the listing status is updated to REJECTED and the reason is saved in the database.
