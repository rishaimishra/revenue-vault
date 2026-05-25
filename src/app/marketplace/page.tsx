import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function getListings(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  const listings = await prisma.startupListing.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
      ...(q ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { tagline: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
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
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return listings;
}

export default async function MarketplacePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const listings = await getListings(searchParams);

  const session = await getServerSession(authOptions);
  let bookmarkedListingIds = new Set<string>();

  if (session?.user) {
    // @ts-expect-error session.user.id is injected by next-auth callbacks
    const userId = session.user.id;
    const userBookmarks = await prisma.bookmark.findMany({
      where: { userId },
      select: { listingId: true },
    });
    bookmarkedListingIds = new Set(userBookmarks.map((b) => b.listingId));
  }

  const categories = [
    "SaaS", "E-commerce", "Marketplace", "Agency", "Mobile App", "Content Site", "Other"
  ];

  const qVal = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Premium Hero Header Section with Dot Grid Background */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-white bg-dot-grid py-12 md:py-16 mb-12">
        {/* Colorful gradient blurs for modern visual depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest leading-none bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100/50">
                Premium Marketplace
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
                Startup Marketplace
              </h1>
              <p className="text-slate-600 font-medium text-base md:text-lg leading-relaxed">
                Acquire pre-vetted, high-margin SaaS platforms, e-commerce stores, and digital assets.
              </p>
            </div>
            
            {session?.user && (session.user as any).role === "ADMIN" ? null : (
              <Link
                href="/listings/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-4 rounded-2xl font-black text-sm hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300 border border-indigo-500/10 group"
              >
                List Your Startup
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search and Filters Hub */}
        <div className="flex flex-col items-center gap-6 mb-12 w-full max-w-4xl mx-auto">
          {/* Centered Glassmorphic Search Bar */}
          <Suspense fallback={<div className="h-14 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl w-full max-w-2xl animate-pulse shadow-premium" />}>
            <SearchBar />
          </Suspense>

          {/* Sleek Horizontal Pill Layout for Categories */}
          <div className="flex flex-wrap justify-center gap-2.5 w-full">
            <Link
              href={`/marketplace${qVal ? `?q=${encodeURIComponent(qVal)}` : ""}`}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-200 active:scale-95 ${
                !searchParams.category
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-500 text-white shadow-glow-blue shadow-md animate-pulse"
                  : "bg-white/80 backdrop-blur-sm border-slate-200/60 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white hover:shadow-sm"
              }`}
            >
              All Startups
            </Link>
            {categories.map((cat) => {
              const isActive = typeof searchParams.category === 'string' && searchParams.category.toLowerCase() === cat.toLowerCase();
              return (
                <Link
                  key={cat}
                  href={`/marketplace?category=${encodeURIComponent(cat)}${qVal ? `&q=${encodeURIComponent(qVal)}` : ""}`}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-500 text-white shadow-glow-blue shadow-md"
                      : "bg-white/80 backdrop-blur-sm border-slate-200/60 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Listings Section */}
        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-slate-200/50 shadow-premium max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <svg 
                className="w-8 h-8 text-indigo-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-slate-800 text-lg font-extrabold tracking-tight">No startups found</h3>
            <p className="text-slate-500 text-sm mt-1.5 max-w-sm mx-auto">
              We couldn&apos;t find any startups matching your criteria. Try adjusting your query or resetting filters.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/marketplace"
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-sm"
              >
                Clear all filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isBookmarked={bookmarkedListingIds.has(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
