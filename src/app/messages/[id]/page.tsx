import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { DollarSign, BarChart2, TrendingUp, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { DealStatusManager } from "@/components/DealStatusManager";

async function getDeal(id: string, userId: string) {
  let deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      listing: {
        include: {
          seller: {
            select: { id: true, name: true, isVerified: true }
          }
        }
      },
      buyer: {
        select: { id: true, name: true, isVerified: true }
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: { name: true, image: true }
          }
        }
      }
    }
  });

  // Fallback: If no deal is found directly by ID, the ID might be a listing ID.
  // Find a deal for this listing where the current user is either the buyer or the seller.
  if (!deal) {
    deal = await prisma.deal.findFirst({
      where: {
        listingId: id,
        OR: [
          { buyerId: userId },
          { listing: { sellerId: userId } }
        ]
      },
      include: {
        listing: {
          include: {
            seller: {
              select: { id: true, name: true, isVerified: true }
            }
          }
        },
        buyer: {
          select: { id: true, name: true, isVerified: true }
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: { name: true, image: true }
            }
          }
        }
      }
    });
  }

  if (!deal) return null;

  // Verify user is part of this deal
  if (deal.listing.sellerId !== userId && deal.buyerId !== userId) {
    return null;
  }

  return deal;
}

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const deal = await getDeal(id, (session.user as any).id);

  if (!deal) {
    notFound();
  }

  const isSeller = deal.listing.sellerId === (session.user as any).id;
  const otherParty = isSeller ? deal.buyer : deal.listing.seller;
  const receiverId = isSeller ? deal.buyerId : deal.listing.sellerId;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/dashboard/seller" // Or dashboard/buyer if I had one
        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {otherParty.name?.[0] || (isSeller ? "B" : "S")}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Chat with {otherParty.name || (isSeller ? "Buyer" : "Seller")}
                  {otherParty.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                </h1>
                <p className="text-sm text-gray-500">Discussing: <span className="font-medium text-gray-700">{deal.listing.title}</span></p>
              </div>
            </div>
            <div className="hidden md:block">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                deal.status === 'CLOSED' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
              }`}>
                {deal.status}
              </span>
            </div>
          </div>

          <ChatInterface
            dealId={deal.id}
            receiverId={receiverId}
            initialMessages={JSON.parse(JSON.stringify(deal.messages))}
          />
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Deal Management</h2>
            <DealStatusManager dealId={deal.id} currentStatus={deal.status} isSeller={isSeller} />
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Startup Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{deal.listing.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-3">{deal.listing.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase flex items-center gap-1 font-bold">
                    <DollarSign className="w-3 h-3" /> Revenue
                  </p>
                  <p className="text-sm font-bold text-gray-900">${deal.listing.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase flex items-center gap-1 font-bold">
                    <TrendingUp className="w-3 h-3" /> Profit
                  </p>
                  <p className="text-sm font-bold text-gray-900">${deal.listing.profit.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-400 uppercase flex items-center gap-1 font-bold">
                  <BarChart2 className="w-3 h-3" /> Asking Price
                </p>
                <p className="text-lg font-extrabold text-blue-700">${deal.listing.price.toLocaleString()}</p>
              </div>
              <Link
                href={`/listings/${deal.listing.id}`}
                className="w-full bg-gray-900 text-white text-center py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors block"
              >
                View Full Listing
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
