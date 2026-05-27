import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CrmDashboardClient } from "@/components/admin/CrmDashboardClient";
import { Sparkles } from "lucide-react";

export default async function AdminCrmPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all users with listings, deals, and payments counts
  const dbUsers = await prisma.user.findMany({
    include: {
      listings: {
        select: { id: true },
      },
      dealsAsBuyer: {
        select: { id: true },
      },
      payments: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map database users to a clean type safe list for CRM
  const contacts = dbUsers.map((u) => ({
    id: u.id,
    name: u.name || "Anonymous User",
    email: u.email || "No email",
    role: u.role,
    crmStage: u.crmStage || "PROSPECT",
    listingsCount: u.listings.length,
    dealsCount: u.dealsAsBuyer.length,
    paymentsCount: u.payments.length,
    isSubscribed: u.isSubscribed,
    subscriptionTier: u.subscriptionTier || "FREE",
    isVerified: u.isVerified,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Decorative top glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-xs relative overflow-hidden select-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/30">
              Operations Control
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Admin CRM Control Deck
            </h1>
          </div>
        </div>
      </div>

      {/* Render the Client Dashboard */}
      <CrmDashboardClient initialUsers={contacts} />
    </div>
  );
}
