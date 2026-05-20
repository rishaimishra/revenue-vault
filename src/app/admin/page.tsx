import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, LayoutDashboard, Users, FileText } from "lucide-react";

async function getAdminStats() {
  const stats = {
    totalListings: await prisma.startupListing.count(),
    publishedListings: await prisma.startupListing.count({ where: { status: "PUBLISHED" } }),
    totalUsers: await prisma.user.count(),
    activeDeals: await prisma.deal.count({ where: { status: { not: "CLOSED" } } }),
  };
  return stats;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "ADMIN") return null;

  const stats = await getAdminStats();

  return (
    <div className="px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-600">Platform-wide management dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
