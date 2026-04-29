import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, BarChart2, TrendingUp, Calendar, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { RequestAccessButton } from "@/components/RequestAccessButton";
import { ReportListingButton } from "@/components/ReportListingButton";

async function getListing(id: string) {
  const listing = await prisma.startupListing.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          name: true,
          isVerified: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) return null;
  return listing;
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  // Check if current user is seller or admin
  const isSeller = session?.user && (session.user as any).id === listing.sellerId;
  // @ts-ignore
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  // Protection: If not published, only seller or admin can see it
  if (listing.status !== "PUBLISHED" && !isSeller && !isAdmin) {
    notFound();
  }

  // Check if buyer has already requested access
  const accessRequest = session?.user
    ? await prisma.accessRequest.findUnique({
        where: {
          listingId_buyerId: {
            listingId: listing.id,
            buyerId: (session.user as any).id,
          },
        },
      })
    : null;

  const isApproved = accessRequest?.status === "APPROVED" || isSeller || isAdmin;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                {listing.category}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-xs">Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">{listing.title}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                <DollarSign className="w-4 h-4" /> Annual Revenue
              </span>
              <span className={`text-2xl font-bold text-gray-900 ${!isApproved ? 'blur-sm select-none' : ''}`}>
                ${listing.revenue.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                <TrendingUp className="w-4 h-4" /> Annual Profit
              </span>
              <span className={`text-2xl font-bold text-gray-900 ${!isApproved ? 'blur-sm select-none' : ''}`}>
                ${listing.profit.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                <BarChart2 className="w-4 h-4" /> Asking Price
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ${listing.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">About this Startup</h2>
            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed relative">
              {listing.description.split('\n').map((para, i) => (
                <p key={i} className={!isApproved && i > 0 ? 'blur-sm select-none' : ''}>
                  {para}
                </p>
              ))}
              {!isApproved && (
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent flex items-end justify-center pb-8">
                  <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg">
                    Detailed info hidden until access is approved
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-96 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Interested in this deal?</h3>
              <p className="text-sm text-gray-600">
                You need to request access to message the seller and view sensitive details.
              </p>

              {!session ? (
                <Link
                  href="/auth/signin"
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center"
                >
                  Sign in to Request Access
                </Link>
              ) : accessRequest?.status === "PENDING" ? (
                <button className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-lg cursor-not-allowed" disabled>
                  Access Request Pending
                </button>
              ) : accessRequest?.status === "APPROVED" ? (
                <Link
                  href={`/messages/${listing.id}`}
                  className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors block text-center"
                >
                  Open Conversation
                </Link>
              ) : (
                <RequestAccessButton listingId={listing.id} />
              )}
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                  {listing.seller.name?.[0] || 'S'}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    {listing.seller.name || 'Anonymous Seller'}
                    {listing.seller.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Seller since {new Date(listing.seller.createdAt).getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> RevenueVault Safe Guard
            </h4>
            <p className="text-xs text-blue-800 leading-normal">
              We verify all financial claims. Never share personal information or payment details before seller approval.
            </p>
          </div>

          {session && (
            <ReportListingButton listingId={listing.id} />
          )}
        </div>
      </div>
    </div>
  );
}
