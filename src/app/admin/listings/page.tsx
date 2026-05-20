import { prisma } from "@/lib/prisma";
import { PendingListings } from "@/components/admin/PendingListings";
import { ListingFilters } from "@/components/admin/ListingFilters";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const q = params.q;
  const status = params.status || "PENDING_APPROVAL";
  const page = parseInt(params.page || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    status,
    ...(q ? {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ]
    } : {}),
  };

  const listings = await prisma.startupListing.findMany({
    where: (where as any),
    include: {
      seller: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const total = await prisma.startupListing.count({ where: (where as any) });
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Listings Management</h1>
      <ListingFilters />
      <div className="mt-6">
        <PendingListings listings={listings} />
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-between items-center">
        <a href={`/admin/listings?page=${Math.max(1, page - 1)}`} className="px-4 py-2 border rounded-lg">Previous</a>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <a href={`/admin/listings?page=${Math.min(totalPages, page + 1)}`} className="px-4 py-2 border rounded-lg">Next</a>
      </div>
    </div>
  );
}
