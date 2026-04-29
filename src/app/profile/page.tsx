import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, ShieldCheck, Clock, Settings, LogOut, ArrowRight } from "lucide-react";

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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-blue-600 h-32 relative"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-[1.25rem] bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.[0] || "U"
                  )}
                </div>
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  {user.name || "Anonymous User"}
                  {user.isVerified && <ShieldCheck className="w-6 h-6 text-blue-500" />}
                </h1>
                <p className="text-gray-500 font-medium flex items-center gap-1 text-sm">
                  <Mail className="w-3 h-3" /> {user.email}
                </p>
              </div>
            </div>
            <Link
              href="/onboarding"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Change Role
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase ${
                  user.role === 'SELLER' ? 'bg-orange-100 text-orange-700' :
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                {user.role === 'SELLER'
                  ? "You can list startups and receive acquisition requests."
                  : "You can browse verified startups and request access."}
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Listings</h3>
                  <p className="text-3xl font-black text-gray-900">{user._count.listings}</p>
                </div>
                <Link href="/dashboard/seller" className="text-xs font-bold text-blue-600 hover:underline mt-4 flex items-center gap-1">
                  Go to Seller Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Bookmarks</h3>
                  <p className="text-3xl font-black text-gray-900">{user._count.bookmarks}</p>
                </div>
                <Link href="/dashboard/buyer" className="text-xs font-bold text-blue-600 hover:underline mt-4 flex items-center gap-1">
                  Go to Buyer Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Subscription Status</p>
                    <p className="text-xs text-gray-500">{user.isSubscribed ? `Active: ${user.subscriptionTier}` : "Free Plan"}</p>
                  </div>
                </div>
                <Link href="/pricing" className="text-xs font-bold text-blue-600 hover:underline">
                  {user.isSubscribed ? "Manage Plan" : "Upgrade Now"}
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Member Since</p>
                    <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out of account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
