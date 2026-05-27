import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, User, Mail, ShieldAlert, Star, ShieldCheck, 
  Calendar, FileText, DollarSign, MessageSquare, Briefcase, 
  ChevronRight, Landmark, ArrowUpRight, CheckCircle2, TrendingUp 
} from "lucide-react";
import { CrmNotesManager } from "@/components/admin/CrmNotesManager";
import { CrmTasksManager } from "@/components/admin/CrmTasksManager";
import { CrmStageSelector } from "@/components/admin/CrmStageSelector";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function AdminCrmLeadDetailPage({ params }: Props) {
  const { userId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  // Fetch the lead user with complete transaction and CRM records
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      listings: {
        orderBy: { createdAt: "desc" },
      },
      dealsAsBuyer: {
        include: {
          listing: {
            select: { title: true, price: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      crmNotes: {
        include: {
          admin: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      crmTasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Fetch all deals where this user is the Seller (listing owner)
  const dealsAsSeller = await prisma.deal.findMany({
    where: {
      listing: { sellerId: userId },
    },
    include: {
      listing: {
        select: { title: true, price: true },
      },
      buyer: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 pb-16 font-sans relative">
      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 select-none">
        <Link href="/admin" className="hover:text-indigo-600 transition-colors">Console</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/admin/crm" className="hover:text-indigo-600 transition-colors">CRM Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded font-extrabold uppercase">
          Lead Portfolio
        </span>
      </nav>

      {/* Nav back bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-xs select-none">
        <Link
          href="/admin/crm"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-indigo-600 transition-all active:scale-95 duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to CRM Pipeline
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold">CRM Stage:</span>
          <CrmStageSelector userId={user.id} initialStage={user.crmStage} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (4/12): User 360 Information Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm space-y-6 select-none relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center font-black text-white text-3xl mx-auto shadow-md shadow-indigo-100">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
                {user.name || "Anonymous User"}
                {user.isVerified && (
                  <span title="Vetted Trust Badge">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  </span>
                )}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {user.role} Contact Lead
              </p>
            </div>
          </div>

          <div className="space-y-4.5 text-xs">
            {/* Email */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-300" /> Email
              </span>
              <span className="font-extrabold text-slate-700 truncate w-40 text-right">{user.email || "No email"}</span>
            </div>

            {/* Subscribed status */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Star className="w-4 h-4 text-slate-300" /> Subscription
              </span>
              {user.isSubscribed ? (
                <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50 uppercase text-[9px] tracking-wide">
                  {user.subscriptionTier} ACTIVE
                </span>
              ) : (
                <span className="font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase text-[9px]">
                  FREE Tier
                </span>
              )}
            </div>

            {/* Account created */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-300" /> Registered
              </span>
              <span className="font-extrabold text-slate-700">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Onboarded state */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-300" /> Onboarding
              </span>
              {user.isOnboarded ? (
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50 uppercase text-[9px]">
                  Completed
                </span>
              ) : (
                <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/50 uppercase text-[9px]">
                  Pending Selection
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (8/12): Tabs & Operations panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Notes & Tasks Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Notes Timeline Block */}
            <div className="bg-white border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
              <CrmNotesManager userId={user.id} initialNotes={user.crmNotes.map(n => ({
                id: n.id,
                content: n.content,
                createdAt: n.createdAt.toISOString(),
                admin: { name: n.admin.name }
              }))} />
            </div>

            {/* Tasks Checklist Block */}
            <div className="bg-white border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
              <CrmTasksManager userId={user.id} initialTasks={user.crmTasks.map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
                dueDate: t.dueDate ? t.dueDate.toISOString() : null,
                status: t.status
              }))} />
            </div>

          </div>

          {/* User Listings Section */}
          <div className="bg-white border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
            <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-6 select-none">
              <Briefcase className="w-5 h-5 text-indigo-500" /> Listed Startups ({user.listings.length})
            </h3>

            {user.listings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No startup listings created by this founder.
              </div>
            ) : (
              <div className="overflow-x-auto select-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Title & Category</th>
                      <th className="py-3 px-4">Asking Price</th>
                      <th className="py-3 px-4">Annual Profit</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {user.listings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-800">{listing.title}</div>
                          <div className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">{listing.category}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">${listing.price.toLocaleString()}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">${listing.profit.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 border rounded uppercase ${
                            listing.status === "PUBLISHED" 
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                              : listing.status === "PENDING_APPROVAL"
                              ? "bg-amber-50 border-amber-100 text-amber-600"
                              : "bg-slate-100 border-slate-200 text-slate-500"
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/listings/${listing.id}`}
                            target="_blank"
                            className="inline-flex p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-md shrink-0 active:scale-95 transition-all"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Deal negotiations (Buyer and Seller active logs) */}
          <div className="bg-white border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
            <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-6 select-none">
              <MessageSquare className="w-5 h-5 text-indigo-500" /> Deals & Conversations ({user.dealsAsBuyer.length + dealsAsSeller.length})
            </h3>

            {user.dealsAsBuyer.length === 0 && dealsAsSeller.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No active buyer-seller negotiations logged.
              </div>
            ) : (
              <div className="space-y-6 select-none text-xs">
                {/* Deals as Buyer */}
                {user.dealsAsBuyer.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50 px-2.5 py-1 rounded w-fit">
                      Inbound Deals (Buyer Portfolio)
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-indigo-100/50 rounded-2xl overflow-hidden">
                        <thead>
                          <tr className="bg-indigo-50/20 border-b border-indigo-100/30 text-[9px] font-black text-indigo-600 uppercase tracking-wider">
                            <th className="py-2.5 px-4">Startup</th>
                            <th className="py-2.5 px-4">Offer Price</th>
                            <th className="py-2.5 px-4">Deal Status</th>
                            <th className="py-2.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {user.dealsAsBuyer.map((deal) => (
                            <tr key={deal.id} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-4 font-bold text-slate-700">{deal.listing.title}</td>
                              <td className="py-2.5 px-4 font-semibold text-slate-600">${deal.listing.price.toLocaleString()}</td>
                              <td className="py-2.5 px-4">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 border rounded uppercase ${
                                  deal.status === "CLOSED" 
                                    ? "bg-slate-100 border-slate-200 text-slate-500" 
                                    : "bg-indigo-50 border-indigo-100 text-indigo-600"
                                }`}>
                                  {deal.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <Link
                                  href={`/messages?dealId=${deal.id}`}
                                  target="_blank"
                                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 flex items-center justify-end gap-0.5"
                                >
                                  Open Chat <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Deals as Seller */}
                {dealsAsSeller.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none bg-amber-50 px-2.5 py-1 rounded w-fit">
                      Outbound Deals (Seller Portfolio)
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-amber-100/50 rounded-2xl overflow-hidden">
                        <thead>
                          <tr className="bg-amber-50/20 border-b border-amber-100/30 text-[9px] font-black text-amber-700 uppercase tracking-wider">
                            <th className="py-2.5 px-4">Listed Startup</th>
                            <th className="py-2.5 px-4">Interested Buyer</th>
                            <th className="py-2.5 px-4">Deal Status</th>
                            <th className="py-2.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {dealsAsSeller.map((deal) => (
                            <tr key={deal.id} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-4 font-bold text-slate-700">{deal.listing.title}</td>
                              <td className="py-2.5 px-4">
                                <span className="font-semibold text-slate-600">{deal.buyer.name}</span>{" "}
                                <span className="text-[9px] text-slate-400">({deal.buyer.email})</span>
                              </td>
                              <td className="py-2.5 px-4">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 border rounded uppercase ${
                                  deal.status === "CLOSED" 
                                    ? "bg-slate-100 border-slate-200 text-slate-500" 
                                    : "bg-amber-50 border-amber-100 text-amber-700"
                                }`}>
                                  {deal.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <Link
                                  href={`/messages?dealId=${deal.id}`}
                                  target="_blank"
                                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 flex items-center justify-end gap-0.5"
                                >
                                  Open Chat <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Transactions Ledger */}
          <div className="bg-white border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
            <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-6 select-none">
              <DollarSign className="w-5 h-5 text-indigo-500" /> Payments Ledger ({user.payments.length})
            </h3>

            {user.payments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No billing or listing fee payments made by this account.
              </div>
            ) : (
              <div className="overflow-x-auto select-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Amount & Type</th>
                      <th className="py-3 px-4">Payment Provider</th>
                      <th className="py-3 px-4">Provider ID</th>
                      <th className="py-3 px-4">Transaction Status</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {user.payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-800">${p.amount.toLocaleString()}</div>
                          <div className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">{p.type}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-600 uppercase">{p.provider}</td>
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{p.providerId.slice(0, 12)}...</td>
                        <td className="py-3 px-4">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 border rounded uppercase ${
                            p.status === "success" 
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                              : "bg-rose-50 border-rose-100 text-rose-600"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400 font-semibold">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
