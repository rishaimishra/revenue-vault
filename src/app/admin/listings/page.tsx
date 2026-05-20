import { prisma } from "@/lib/prisma";
import { PendingListings } from "@/components/admin/PendingListings";

export default async function AdminListingsPage() {
  const pendingListings = await prisma.startupListing.findMany({
    where: { status: "PENDING_APPROVAL" },
    include: {
      seller: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="p-8">
      <PendingListings listings={pendingListings} />
    </div>
  );
}
