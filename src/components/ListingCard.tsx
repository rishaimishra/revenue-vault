"use client";

import { StartupListing } from "@prisma/client";
import { DollarSign, BarChart2, TrendingUp, Bookmark, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ListingCardProps {
  listing: StartupListing & {
    seller: {
      name: string | null;
      isVerified: boolean;
    };
  };
  isBookmarked?: boolean;
}

export const ListingCard = ({ listing, isBookmarked: initialIsBookmarked }: ListingCardProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-lg border shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 relative group ${
      listing.isFeatured
        ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/10"
        : "bg-white border-gray-200"
    }`}>
      {listing.isFeatured && (
        <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1 shadow-lg z-20">
          <Zap className="w-3 h-3 fill-white" /> Featured
        </div>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{listing.category}</p>
        </div>
        <button
          onClick={handleBookmark}
          disabled={isLoading}
          className={`p-2 rounded-full hover:bg-gray-100 transition-colors z-10 ${isBookmarked ? 'text-blue-600' : 'text-gray-400'}`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 py-2 border-y border-gray-100">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Revenue
          </span>
          <span className="font-semibold text-gray-900">${listing.revenue.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Profit
          </span>
          <span className="font-semibold text-gray-900">${listing.profit.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <BarChart2 className="w-3 h-3" /> Price
          </span>
          <span className="font-semibold text-blue-600">${listing.price.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
        {listing.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
            {listing.seller.name?.[0] || 'S'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-900 flex items-center gap-1">
              {listing.seller.name || 'Anonymous Seller'}
              {listing.seller.isVerified && (
                <span className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</span>
              )}
            </span>
            <span className="text-[10px] text-gray-500">Seller</span>
          </div>
        </div>
        <Link
          href={`/listings/${listing.id}`}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
