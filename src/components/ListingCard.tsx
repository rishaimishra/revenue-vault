"use client";

import { StartupListing } from "@prisma/client";
import { DollarSign, BarChart2, TrendingUp, Bookmark, Loader2, Zap, ShieldCheck } from "lucide-react";
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

  // Professional M&A Multiples calculations
  const profitMultiple = listing.profit > 0 ? (listing.price / listing.profit).toFixed(1) : null;

  // Helper to format values compactly (e.g. $5M, $250K) to prevent text overflow in grid layouts
  const formatCompact = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(num);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-[2rem] border p-6 bg-white transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl ${
        listing.isFeatured
          ? "border-indigo-200/80 shadow-premium hover:shadow-indigo-500/10 ring-2 ring-indigo-500/15"
          : "border-slate-100 shadow-premium hover:border-indigo-100 hover:shadow-indigo-500/5"
      }`}
    >
      {/* Stretched absolute Link overlay covering the entire card at z-0 */}
      <Link
        href={`/listings/${listing.id}`}
        className="absolute inset-0 z-0 rounded-[2rem]"
        aria-label={`View details for ${listing.title}`}
      />

      {/* Decorative top-right abstract blur element for premium touch */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500 -z-10" />
      
      {/* Header Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pointer-events-none">
        {listing.isFeatured && (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-glow-purple shadow-sm z-10">
            <Zap className="w-3 h-3 fill-white animate-pulse" /> Featured
          </span>
        )}
        <span className="inline-flex items-center text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50 z-10">
          {listing.category}
        </span>
        {profitMultiple && (
          <span className="inline-flex items-center text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50 z-10">
            📈 {profitMultiple}x EBITDA
          </span>
        )}
        {listing.foundedYear && (
          <span className="inline-flex items-center text-[10px] text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 z-10">
            Est. {listing.foundedYear}
          </span>
        )}
      </div>
      
      {/* Title and Tagline */}
      <div className="flex justify-between items-start gap-4 mb-4 z-10">
        <div className="space-y-1 flex-1 pointer-events-none">
          <h3 className="text-xl font-extrabold text-slate-900 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
            {listing.title}
          </h3>
          {listing.tagline && (
            <p className="text-xs text-slate-400 font-medium italic line-clamp-1">
              &ldquo;{listing.tagline}&rdquo;
            </p>
          )}
        </div>
        {session?.user && (session.user as { role?: string }).role === "ADMIN" ? null : (
          <button
            onClick={handleBookmark}
            disabled={isLoading}
            className={`relative z-10 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 active:scale-95 shrink-0 ${
              isBookmarked 
                ? 'text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100/50' 
                : 'text-slate-400 bg-slate-50/30'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark className="w-4 h-4 transition-transform group-hover:scale-105" fill={isBookmarked ? "currentColor" : "none"} />
            )}
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem] tracking-wide mb-5 pointer-events-none z-10">
        {listing.description}
      </p>

      {/* Financial Metrics Grid - Micro modules */}
      <div className="bg-slate-50/40 rounded-2xl border border-slate-100/60 p-4 grid grid-cols-3 gap-3 mb-6 transition-colors duration-300 group-hover:bg-indigo-50/10 group-hover:border-indigo-100/30 pointer-events-none z-10">
        {/* Revenue */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-slate-400" /> TTM Revenue
          </span>
          <span className="font-extrabold text-slate-800 text-xs md:text-sm tracking-tight">
            ${formatCompact(listing.revenue)}
          </span>
        </div>
        
        {/* Net Profit */}
        <div className="flex flex-col gap-1 border-l border-slate-200/40 pl-3">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> Net Profit
          </span>
          <span className="font-extrabold text-emerald-600 text-xs md:text-sm tracking-tight">
            ${formatCompact(listing.profit)}
          </span>
        </div>

        {/* Asking Price */}
        <div className="flex flex-col gap-1 border-l border-slate-200/40 pl-3">
          <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <BarChart2 className="w-3 h-3 text-indigo-500" /> Asking Price
          </span>
          <span className="font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-xs md:text-sm tracking-tight">
            ${formatCompact(listing.price)}
          </span>
        </div>
      </div>

      {/* Footer Area */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/80 pointer-events-none z-10">
        {/* Seller profile snippet */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100/30 shrink-0">
            {listing.seller.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1 leading-none truncate">
              {listing.seller.name || 'Anonymous Seller'}
              {listing.seller.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" stroke="white" strokeWidth="2.5" />
              )}
            </span>
            <span className="text-[9px] text-slate-400 font-medium mt-0.5">Verified Seller</span>
          </div>
        </div>
      </div>
    </div>
  );
};
