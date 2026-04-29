import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, X, MessageSquare, ArrowRight, Clock, Shield, Zap } from "lucide-react";
import { AccessRequestActions } from "@/components/AccessRequestActions";
import { FeatureListingButton } from "@/components/FeatureListingButton";

async function getSellerData(userId: string) {
  const listings = await prisma.startupListing.findMany({
    where: { sellerId: userId },
    include: {
      _count: {
        select: { accessRequests: true, deals: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const pendingRequests = await prisma.accessRequest.findMany({
    where: {
      listing: { sellerId: userId },
      status: "PENDING"
    },
    include: {
      listing: true,
      buyer: {
        select: {
          name: true,
          email: true,
          isVerified: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const activeDeals = await prisma.deal.findMany({
    where: {
      listing: { sellerId: userId },
      status: { not: "CLOSED" }
    },
    include: {
      listing: true,
      buyer: {
        select: { name: true }
      },
      _count: {
        select: { messages: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return { listings, pendingRequests, activeDeals };
}

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const { listings, pendingRequests, activeDeals } = await getSellerData(session.user.id);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your listings, access requests, and deals.</p>
        </div>
        <Link
          href="/listings/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Create New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Requests & Deals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Access Requests */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" /> Pending Access Requests
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                {pendingRequests.length}
              </span>
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
                <p className="text-gray-500">No pending access requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {request.buyer.name?.[0] || "B"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-1">
                          {request.buyer.name || "Anonymous Buyer"}
                          {request.buyer.isVerified && <Shield className="w-3 h-3 text-blue-500" />}
                        </p>
                        <p className="text-xs text-gray-500">Requested access to <span className="font-medium text-gray-700">{request.listing.title}</span></p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(request.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <AccessRequestActions requestId={request.id} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Deals */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" /> Active Conversations & Deals
            </h2>

            {activeDeals.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
                <p className="text-gray-500">No active deals or conversations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/messages/${deal.id}`}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition-all shadow-sm group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
                        {deal.status}
                      </span>
                      <span className="text-[10px] text-gray-400">{new Date(deal.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{deal.listing.title}</h4>
                    <p className="text-sm text-gray-600 mb-4 italic">with {deal.buyer.name || "Anonymous Buyer"}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {deal._count.messages} messages
                      </span>
                      <span className="text-blue-600 text-xs font-bold flex items-center gap-1">
                        Open Chat <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column: Listings Summary */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Listings</h2>
            <div className="space-y-3">
              {listings.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-sm text-gray-500">You haven't listed any startups yet.</p>
                </div>
              ) : (
                listings.map((listing) => (
                  <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{listing.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        listing.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                        listing.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {listing.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-[10px] text-gray-400 uppercase">Price</p>
                        <p className="text-xs font-bold text-gray-900">${listing.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-[10px] text-gray-400 uppercase">Requests</p>
                        <p className="text-xs font-bold text-gray-900">{listing._count.accessRequests}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-blue-600 text-[10px] font-bold hover:underline"
                      >
                        View Public Page
                      </Link>
                      <FeatureListingButton listingId={listing.id} isFeatured={listing.isFeatured} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
