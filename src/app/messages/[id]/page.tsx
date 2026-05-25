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
    <div className="min-h-full bg-slate-50/50 bg-dot-grid py-8 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <Link
          href={isSeller ? "/dashboard/seller" : "/dashboard/buyer"}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all mb-6 duration-200"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-premium backdrop-blur-md flex items-center justify-between transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                  {otherParty.name?.[0] || (isSeller ? "B" : "S")}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Chat with {otherParty.name || (isSeller ? "Buyer" : "Seller")}
                    {otherParty.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50" /> Verified
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                    Discussing: <span className="font-semibold text-slate-700 underline decoration-slate-200 underline-offset-4">{deal.listing.title}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live connection
                    </span>
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  deal.status === 'CLOSED' 
                    ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse'
                }`}>
                  {deal.status === 'CLOSED' ? 'Closed' : 'Active Deal'}
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
            <section className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-premium backdrop-blur-md transition-all">
              <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                Deal Progress
              </h2>
              <DealStatusManager dealId={deal.id} currentStatus={deal.status} isSeller={isSeller} />
            </section>

            <section className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-premium backdrop-blur-md transition-all">
              <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                Startup Financials
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    <Link href={`/listings/${deal.listing.id}`}>{deal.listing.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{deal.listing.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-xl transition-all hover:bg-slate-50">
                    <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-bold tracking-wider">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Revenue
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">${deal.listing.revenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-xl transition-all hover:bg-slate-50">
                    <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-bold tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Net Profit
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">${deal.listing.profit.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-tr from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100/50 flex flex-col justify-center">
                  <p className="text-[10px] text-blue-600 uppercase flex items-center gap-1.5 font-bold tracking-wider">
                    <BarChart2 className="w-3.5 h-3.5 text-blue-500" /> Asking Price
                  </p>
                  <p className="text-xl font-extrabold text-blue-700 mt-1">${deal.listing.price.toLocaleString()}</p>
                </div>
                <Link
                  href={`/listings/${deal.listing.id}`}
                  className="w-full bg-slate-950 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all block shadow-sm shadow-slate-900/10"
                >
                  View Full Listing
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
