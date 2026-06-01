import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  User, Mail, Shield, ShieldCheck, Clock, Settings, LogOut, 
  ArrowRight, Sparkles, CheckCircle2, Bookmark, Briefcase, 
  ChevronRight, Activity, CreditCard, ExternalLink
} from "lucide-react";

export const metadata = {
  title: "Profile | RevenueVault",
  description: "Manage your RevenueVault account, roles, active subscriptions, and view marketplace activity statistics.",
};

async function getUserData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          listings: true,
          bookmarks: true,
          dealsAsBuyer: true,
        }
      }
    }
  });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = await getUserData((session.user as any).id);

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50/50 bg-dot-grid py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium ambient light shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-premium rounded-[2.5rem] overflow-hidden relative z-10">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-10 border-b border-slate-100 bg-slate-50/10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              
              {/* Premium double-bordered avatar */}
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-md shadow-slate-200/40 ring-1 ring-slate-100 flex-shrink-0">
                <div className="w-full h-full rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-3xl font-extrabold text-slate-400 overflow-hidden ring-1 ring-slate-200/20">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || "User profile photo"} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
              </div>

              {/* Name and Mail info */}
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {user.name || "Anonymous User"}
                  </h1>
                  {user.isVerified && (
                    <div 
                      id="verified-badge"
                      className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </div>
                  )}
                </div>
                <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" /> {user.email}
                </p>
              </div>
            </div>

            {/* Change role button */}
            <div className="flex items-center justify-center">
              <Link
                id="change-role-btn"
                href="/onboarding"
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 group cursor-pointer active:scale-98"
              >
                <Settings className="w-4 h-4 text-slate-500 group-hover:rotate-45 transition-transform duration-300" /> 
                Switch Profile Role
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 sm:p-10">

          {/* Grid section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side card: Profile Overview */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-50/70 border border-slate-100/80 p-6 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Active Account Role</p>
                <div className="mb-4">
                  {user.role === 'SELLER' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                      <Briefcase className="w-3.5 h-3.5" /> Seller Account
                    </span>
                  ) : user.role === 'ADMIN' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                      <Shield className="w-3.5 h-3.5" /> Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-50 text-sky-700 border border-sky-200/80 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                      <User className="w-3.5 h-3.5" /> Buyer Account
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {user.role === 'SELLER'
                    ? "You can list startups, manage acquisition requests, and interact with prospective buyers."
                    : user.role === 'ADMIN'
                    ? "You hold system-wide access to review listings, resolve disputes, and moderate accounts."
                    : "You can discover verified startups, save listings, request full financial data, and message sellers."}
                </p>
              </div>

              {/* Time Metadata */}
              <div className="bg-slate-50/30 border border-slate-100 p-6 rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Member Since</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Security Check</span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Secure
                  </span>
                </div>
              </div>
            </div>

            {/* Right side cards: Statistics & System Settings */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Statistic cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Listings Card */}
                <div className="bg-white border border-slate-100 p-6 rounded-[1.75rem] shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-transform group-hover:scale-110 duration-200">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">My Listings</h3>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{user._count.listings}</p>
                  </div>
                  <Link 
                    href="/dashboard/seller" 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-5 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Manage listings <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Bookmarks Card */}
                <div className="bg-white border border-slate-100 p-6 rounded-[1.75rem] shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-4 transition-transform group-hover:scale-110 duration-200">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Bookmarks</h3>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{user._count.bookmarks}</p>
                  </div>
                  <Link 
                    href="/dashboard/buyer" 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-5 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    View bookmarks <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Active Deals Card */}
                <div className="bg-white border border-slate-100 p-6 rounded-[1.75rem] shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-110 duration-200">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Deals</h3>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{user._count.dealsAsBuyer}</p>
                  </div>
                  <Link 
                    href={user.role === "SELLER" ? "/dashboard/seller" : "/dashboard/buyer"} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-5 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Negotiations <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Account, Subscription & Settings rows */}
              <div className="border-t border-slate-100 pt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Platform Monetization & Account
                </h2>
                <div className="space-y-4">
                  
                  {/* Subscription card replaced with Listing Pricing Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100/50 hover:to-slate-100 border border-slate-150 rounded-2xl transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-500 border border-slate-100 shadow-sm shrink-0">
                        <CreditCard className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Listing Price Model</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pay-Per-Listing dynamic pricing model integrated via Razorpay.
                        </p>
                      </div>
                    </div>
                    <Link 
                      id="subscription-tier-btn"
                      href="/pricing" 
                      className="px-4.5 py-2 text-xs font-bold rounded-xl transition-all text-center whitespace-nowrap active:scale-98 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100 hover:shadow-md"
                    >
                      View Pricing
                    </Link>
                  </div>

                  {/* Security Check card */}
                  <div className="flex items-center justify-between p-5 bg-slate-50/40 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm shrink-0">
                        <Shield className="w-5.5 h-5.5 text-indigo-500/80" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Identity Verification</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {user.isVerified 
                            ? "Your account is verified. You have full listing credibility." 
                            : "Verification pending. Verify identity to increase trust."}
                        </p>
                      </div>
                    </div>
                    {!user.isVerified && (
                      <span className="text-xs font-bold text-slate-400 cursor-default">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Sign-out row */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium font-sans">Looking to switch accounts?</p>
                  <Link
                    id="signout-btn"
                    href="/api/auth/signout"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors py-2 px-3 rounded-xl hover:bg-rose-50/50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign out of account
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
