import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, MessageSquare, ArrowRight, Clock, Shield, Search } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";

async function getBuyerData(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      listing: {
        include: {
          seller: {
            select: { name: true, isVerified: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const accessRequests = await prisma.accessRequest.findMany({
    where: { buyerId: userId },
    include: {
      listing: true,
    },
    orderBy: { updatedAt: "desc" }
  });

  const activeDeals = await prisma.deal.findMany({
    where: {
      buyerId: userId,
      status: { not: "CLOSED" }
    },
    include: {
      listing: true,
      _count: {
        select: { messages: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return { bookmarks, accessRequests, activeDeals };
}

export default async function BuyerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const { bookmarks, accessRequests, activeDeals } = await getBuyerData((session.user as any).id);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600">Track your interests, bookmarks, and active conversations.</p>
        </div>
        <Link
          href="/marketplace"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Search className="w-4 h-4" /> Browse Marketplace
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Active Conversations & Requests */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Deals */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" /> My Active Conversations
            </h2>

            {activeDeals.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
                <p className="text-gray-500">No active conversations yet. Start by requesting access to a listing.</p>
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
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{deal.listing.title}</h4>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
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

          {/* Access Requests Status */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" /> Access Request Status
            </h2>

            {accessRequests.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
                <p className="text-gray-500">You haven't requested access to any listings.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {accessRequests.map((request) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{request.listing.title}</h4>
                      <p className="text-[10px] text-gray-400">Requested on {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column: Bookmarks */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" /> Bookmarked
              <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {bookmarks.length}
              </span>
            </h2>

            <div className="space-y-4">
              {bookmarks.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-sm text-gray-500">You haven't bookmarked any startups yet.</p>
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <ListingCard key={bookmark.listingId} listing={bookmark.listing} isBookmarked={true} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
