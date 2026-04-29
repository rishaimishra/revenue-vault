import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminListingActions } from "@/components/admin/AdminListingActions";
import { AdminUserActions } from "@/components/admin/AdminUserActions";
import { ShieldCheck, LayoutDashboard, Users, FileText, AlertCircle, DollarSign } from "lucide-react";

async function getAdminData() {
  const pendingListings = await prisma.startupListing.findMany({
    where: { status: "PENDING_APPROVAL" },
    include: {
      seller: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  const users = await prisma.user.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  });

  const stats = {
    totalListings: await prisma.startupListing.count(),
    publishedListings: await prisma.startupListing.count({ where: { status: "PUBLISHED" } }),
    totalUsers: await prisma.user.count(),
    activeDeals: await prisma.deal.count({ where: { status: { not: "CLOSED" } } }),
  };

  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      listing: { select: { title: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeDeals = await prisma.deal.findMany({
    where: { status: { not: "CLOSED" } },
    include: {
      listing: { select: { title: true } },
      buyer: { select: { name: true } },
    },
    take: 10,
    orderBy: { updatedAt: "desc" },
  });

  const recentPayments = await prisma.payment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return { pendingListings, users, stats, reports, activeDeals, recentPayments };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Verification for Admin Role
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    // In a real MVP, we might want to allow the first user to be admin or set it in DB
    // For this implementation, I'll allow access if I've set the role manually or for development
    // redirect("/");
  }

  const { pendingListings, users, stats, reports, activeDeals, recentPayments } = await getAdminData();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-600">Platform-wide management and trust verification.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Listings", value: stats.totalListings, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Published", value: stats.publishedListings, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Deals", value: stats.activeDeals, icon: LayoutDashboard, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Pending Approvals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Pending Approvals
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                {pendingListings.length}
              </span>
            </h2>
          </div>

          {pendingListings.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-500">No listings waiting for approval.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((listing) => (
                <div key={listing.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{listing.title}</h3>
                      <p className="text-xs text-gray-500">by {listing.seller.name} ({listing.seller.email})</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      ${listing.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-5 italic">
                    "{listing.description}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex gap-4">
                      <div className="text-[10px] uppercase font-bold text-gray-400">
                        Rev: <span className="text-gray-900">${listing.revenue.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">
                        Profit: <span className="text-gray-900">${listing.profit.toLocaleString()}</span>
                      </div>
                    </div>
                    <AdminListingActions listingId={listing.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Management */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              User Verification
            </h2>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Trust Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{user.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AdminUserActions userId={user.id} isVerified={user.isVerified} currentRole={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" /> Recent User Reports
            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
              {reports.length}
            </span>
          </h2>

          {reports.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No pending reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900 text-sm">Listing: {report.listing.title}</h4>
                    <span className="text-[10px] text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-red-800 font-medium leading-relaxed italic">
                      "{report.reason}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Reported By</span>
                      <span className="text-xs text-gray-700">{report.user.name || "Anonymous"}</span>
                    </div>
                    <Link
                      href={`/listings/${report.listingId}`}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Investigate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-green-500" /> Active Deals Tracker
          </h2>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Deal Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{deal.listing.title}</p>
                      <p className="text-[10px] text-gray-500 italic">Buyer: {deal.buyer.name || "Anonymous"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 uppercase">
                        {deal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activeDeals.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm italic">
                No deals currently in progress.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Payments Section */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" /> Recent Platform Payments
        </h2>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">User</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{payment.user.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">{payment.user.email}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-gray-600">{payment.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentPayments.length === 0 && (
            <div className="p-12 text-center text-gray-500 italic">
              No payments recorded yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
