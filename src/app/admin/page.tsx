import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  ShieldCheck, LayoutDashboard, Users, FileText, DollarSign, 
  AlertTriangle, TrendingUp, UserCheck, Calendar, Zap, ArrowUpRight, 
  MessageSquare, Layers, ShieldAlert, BadgePercent, Landmark
} from "lucide-react";
import { AdminListingActions } from "@/components/admin/AdminListingActions";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getAdminData() {
  const [
    totalListings,
    publishedListings,
    pendingListingsCount,
    totalUsers,
    buyerCount,
    sellerCount,
    activeDeals,
    pendingReportsCount,
    successfulPayments,
    pendingListings,
    recentReports,
    recentUsers
  ] = await Promise.all([
    prisma.startupListing.count(),
    prisma.startupListing.count({ where: { status: "PUBLISHED" } }),
    prisma.startupListing.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.deal.count({ where: { status: { not: "CLOSED" } } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.payment.findMany({
      where: { status: "success" },
      select: { amount: true }
    }),
    prisma.startupListing.findMany({
      where: { status: "PENDING_APPROVAL" },
      include: {
        seller: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.report.findMany({
      where: { status: "PENDING" },
      include: {
        listing: { select: { title: true } },
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const totalRevenue = successfulPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    stats: {
      totalListings,
      publishedListings,
      pendingListingsCount,
      totalUsers,
      buyerCount,
      sellerCount,
      activeDeals,
      pendingReportsCount,
      totalRevenue
    },
    pendingListings,
    recentReports,
    recentUsers
  };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const { stats, pendingListings, recentReports, recentUsers } = await getAdminData();

  return (
    <div className="relative space-y-10 pb-16">
      {/* Decorative top ambient light */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Modern Premium Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/50 shadow-premium relative overflow-hidden">
        {/* Animated accent gradient line at the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-glow-purple shadow-md shrink-0">
            <ShieldCheck className="w-9 h-9 text-white stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest leading-none bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100/50">
                Enterprise Console
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
              Admin Control Center
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Real-time platform operations and system health auditing desk.
            </p>
          </div>
        </div>

        {/* Header Metadata Info */}
        <div className="flex items-center gap-4 bg-slate-50/50 px-5 py-3 border border-slate-100 rounded-2xl">
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logged In As</span>
            <span className="text-xs font-black text-slate-800">{session.user.name || "Administrator"}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-indigo-100/30">
            <Landmark className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Row 1: Premium Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Platform Revenue */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 shadow-premium hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100/50">
              <DollarSign className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> System Fees
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Revenue</p>
          <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight mt-1">
            ${stats.totalRevenue.toLocaleString()}
          </h3>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Volume of listings & upgrades</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>

        {/* Pending Approvals (Alert Card) */}
        <div className={`bg-white/80 backdrop-blur-md p-6 rounded-3xl border shadow-premium hover:shadow-2xl transition-all duration-300 group relative overflow-hidden ${
          stats.pendingListingsCount > 0 
            ? "border-amber-200/80 ring-2 ring-amber-500/10 hover:shadow-amber-500/5" 
            : "border-slate-200/50 hover:shadow-indigo-500/5"
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              stats.pendingListingsCount > 0 
                ? "bg-amber-50 text-amber-600 border-amber-100" 
                : "bg-slate-50 text-slate-500 border-slate-100"
            }`}>
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            {stats.pendingListingsCount > 0 && (
              <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Verification</p>
          <h3 className={`text-3xl font-black tracking-tight mt-1 ${
            stats.pendingListingsCount > 0 ? "text-amber-600" : "text-slate-800"
          }`}>
            {stats.pendingListingsCount} <span className="text-sm font-bold text-slate-400">listings</span>
          </h3>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>New applications to review</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </div>
        </div>

        {/* Active Deals / Negotiations */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 shadow-premium hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100/50">
              <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              M&A Deals
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Negotiations</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">
            {stats.activeDeals} <span className="text-sm font-bold text-slate-400">conversations</span>
          </h3>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Active buyer-seller rooms</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>

        {/* Total Registered Users */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 shadow-premium hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100/50">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
              Platform Size
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Founders</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">
            {stats.totalUsers} <span className="text-sm font-bold text-slate-400">accounts</span>
          </h3>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <span className="text-blue-600">{stats.buyerCount} Buyers</span>
            <span className="text-slate-300">•</span>
            <span className="text-purple-600">{stats.sellerCount} Sellers</span>
          </div>
        </div>
      </div>

      {/* Row 2: Split Administration Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (65% width): Pending Listings Approvals Desk */}
        <div className="lg:col-span-8 bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/50 shadow-premium relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-indigo-500" /> Startup Verification Desk
              </h2>
              <p className="text-slate-500 text-xs font-semibold">
                Audit financials, descriptions, and seller claims before publishing listing to the public feed.
              </p>
            </div>
            <Link 
              href="/admin/listings" 
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 px-3.5 py-2 rounded-xl border border-indigo-100/50 flex items-center gap-1 transition-all"
            >
              All Applications <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingListings.length === 0 ? (
            <div className="bg-slate-50/50 border border-dashed border-slate-200/80 rounded-3xl p-16 text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 border border-indigo-100/50 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-slate-800 font-black text-sm">Inbox Fully Cleared</p>
                <p className="text-slate-400 text-xs mt-1">There are no pending startup listings awaiting approval at this time.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {pendingListings.map((listing) => (
                <div key={listing.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative group">
                  
                  {/* Top line with Category & Founded Year */}
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                          {listing.title}
                        </h3>
                        <span className="text-[9px] text-indigo-600 font-extrabold uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/40">
                          {listing.category}
                        </span>
                        {listing.foundedYear && (
                          <span className="text-[9px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            Est. {listing.foundedYear}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        By <span className="font-bold text-slate-600">{listing.seller.name || "Anonymous Seller"}</span> ({listing.seller.email})
                      </p>
                    </div>
                    
                    {/* Asking Price Badge */}
                    <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-right">
                      <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Asking Price</p>
                      <p className="text-sm font-black text-slate-800">${listing.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Tagline or description preview */}
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 mb-5">
                    {listing.tagline && (
                      <p className="text-xs font-black text-slate-700 italic mb-1">
                        &ldquo;{listing.tagline}&rdquo;
                      </p>
                    )}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {listing.description}
                    </p>
                  </div>

                  {/* Financial Audit Row & Action Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-100 gap-4">
                    {/* Multiples metrics */}
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Annual Revenue</span>
                        <span className="font-extrabold text-slate-800 text-xs">${listing.revenue.toLocaleString()}</span>
                      </div>
                      <div className="border-l border-slate-200/60 pl-6">
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Annual Profit</span>
                        <span className="font-extrabold text-emerald-600 text-xs">${listing.profit.toLocaleString()}</span>
                      </div>
                      {listing.profit > 0 && (
                        <div className="border-l border-slate-200/60 pl-6">
                          <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Multiple</span>
                          <span className="font-extrabold text-indigo-600 text-xs">{(listing.price / listing.profit).toFixed(1)}x EBITDA</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="w-full sm:w-auto flex justify-end gap-3 shrink-0">
                      <Link
                        href={`/listings/${listing.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black transition-colors"
                      >
                        Investigate Listing <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <AdminListingActions listingId={listing.id} status={listing.status} />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (35% width): Platform Activity / Reported listings */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section: Platform Integrity & Security Alerts */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-200/50 shadow-premium relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" /> Platform Integrity
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Reported Listings Feed</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                stats.pendingReportsCount > 0 
                  ? "bg-rose-50 border-rose-100 text-rose-600 animate-pulse" 
                  : "bg-slate-50 border-slate-100 text-slate-400"
              }`}>
                {stats.pendingReportsCount} unresolved
              </span>
            </div>

            {recentReports.length === 0 ? (
              <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-8 text-center text-xs text-slate-500 italic">
                No active complaints or safety alerts reported.
              </div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="bg-white border border-rose-100/50 p-4.5 rounded-2xl shadow-sm border-l-4 border-l-rose-500 space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-extrabold text-slate-800 text-xs truncate w-40">
                        {report.listing.title}
                      </h4>
                      <span className="text-[8px] text-slate-400 font-bold">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/30">
                      <p className="text-[11px] text-rose-800 italic leading-relaxed font-medium">
                        &ldquo;{report.reason}&rdquo;
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-50">
                      <div className="text-slate-400">
                        By <span className="font-bold text-slate-500">{report.user.name || "Anonymous"}</span>
                      </div>
                      <Link
                        href={`/listings/${report.listingId}`}
                        target="_blank"
                        className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                      >
                        Audit <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Latest Onboarding feed */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-200/50 shadow-premium">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
              <UserCheck className="w-5 h-5 text-emerald-500" /> New Registrants
            </h3>
            
            <div className="space-y-3.5">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border ${
                      user.role === "ADMIN" 
                        ? "bg-purple-50 text-purple-600 border-purple-100" 
                        : user.role === "SELLER"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black text-slate-800 leading-none truncate w-32">
                        {user.name || "Anonymous User"}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold truncate w-32 mt-1">
                        {user.email || "No email provided"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${
                      user.role === "ADMIN" 
                        ? "bg-purple-50 border-purple-100/50 text-purple-600" 
                        : user.role === "SELLER"
                        ? "bg-amber-50 border-amber-100/50 text-amber-600"
                        : "bg-blue-50 border-blue-100/50 text-blue-600"
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-[8px] text-slate-400 mt-1 font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
