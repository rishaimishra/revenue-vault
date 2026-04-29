import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import Link from "next/link";

async function getListings(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  const listings = await prisma.startupListing.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category } : {}),
      ...(q ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ]
      } : {}),
    },
    include: {
      seller: {
        select: {
          name: true,
          isVerified: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const listings = await getListings(searchParams);

  const categories = [
    "SaaS", "E-commerce", "Marketplace", "Agency", "Mobile App", "Content Site", "Other"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Startup Marketplace</h1>
          <p className="text-gray-600">Buy and sell verified startups anonymously.</p>
        </div>
        <Link
          href="/listings/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-sm"
        >
          List Your Startup
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
        <SearchBar />
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Link
            href="/marketplace"
            className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
              !searchParams.category ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-700 hover:border-blue-500"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/marketplace?category=${cat}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
              className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                searchParams.category === cat ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-700 hover:border-blue-500"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <SearchIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No startups match your search criteria.</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Try adjusting your filters or search keywords.</p>
          <Link href="/marketplace" className="bg-white border border-gray-200 px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all inline-block">
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
