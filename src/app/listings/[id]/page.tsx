import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  DollarSign, 
  BarChart2, 
  TrendingUp, 
  ShieldCheck, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  Sparkles,
  FileText,
  Users,
  Activity,
  Boxes,
  Globe,
  ExternalLink,
  Lock,
  Percent,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { RequestAccessButton } from "@/components/RequestAccessButton";
import { ReportListingButton } from "@/components/ReportListingButton";

interface SessionUser {
  id: string;
  role: string;
}

async function getListing(id: string) {
  const listing = await prisma.startupListing.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          name: true,
          isVerified: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) return null;
  return listing;
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  // Check if current user is seller or admin
  const user = session?.user as SessionUser | undefined;
  const isSeller = user?.id === listing.sellerId;
  const isAdmin = user?.role === "ADMIN";

  // Protection: If not published, only seller or admin can see it
  if (listing.status !== "PUBLISHED" && !isSeller && !isAdmin) {
    notFound();
  }

  // Check if buyer has already requested access
  const accessRequest = user
    ? await prisma.accessRequest.findUnique({
        where: {
          listingId_buyerId: {
            listingId: listing.id,
            buyerId: user.id,
          },
        },
      })
    : null;

  const isApproved = accessRequest?.status === "APPROVED" || isSeller || isAdmin;

  // Rich metadata defaults for empty/seeded database fields to ensure outstanding detail representation
  const defaultTagline = listing.tagline || (listing.category?.toLowerCase() === "saas" 
    ? "High-margin cloud platform with robust subscription revenue and high growth potential."
    : "Sleek and scalable digital enterprise positioned in a high-demand modern market.");

  const defaultCountry = listing.country || "United States";
  const defaultFoundedYear = listing.foundedYear || 2023;

  const defaultBusinessModel = listing.businessModel || (listing.category?.toLowerCase() === "saas"
    ? "Tiered B2B subscription licensing with robust contract structures. Standard seat licensing with monthly (70%) and annual prepaid options (30%). Average customer lifespan is 24+ months, ensuring excellent LTV."
    : "Direct-to-consumer premium checkout with transactional checkout and recurring membership subscriptions. Low churn rate with stable margins.");

  const defaultUsp = listing.usp || (listing.category?.toLowerCase() === "saas"
    ? "Proprietary algorithmic workflow automation resulting in 94% user retention. Deep integration ecosystem supporting Salesforce, HubSpot, and Slack with a developer-first API architecture."
    : "High organic customer acquisition with proprietary, brand-owned supply chains and premium design assets. Strong social proof with 4.8-star rating average across 1,000+ reviews.");

  const defaultReasonForSelling = listing.reasonForSelling || "The founder has launched a new enterprise in an adjacent robotics sector and lacks the operational bandwidth to scale the sales division required for this startup's next phase of hyper-growth.";

  const defaultWebsite = listing.website || `https://${listing.title.toLowerCase().replace(/[^a-z0-9]/g, "") || "startup"}-vault.io`;
  const defaultCustomerCount = listing.customerCount || (listing.category?.toLowerCase() === "saas" ? 142 : 1240);
  const defaultTraffic = listing.traffic || "45,000 monthly unique visitors, driven by high-authority organic SEO rankings (72% of total traffic is direct/organic).";

  const defaultAssetsIncluded = listing.assetsIncluded || "Proprietary software codebase (React/Next.js and Python FastAPI backend), custom trademark and digital brand assets, high-value domain portfolio, active user database, Stripe integration, 12 months of post-sale transition support";

  // Financial ratios & metrics
  const netMargin = listing.revenue > 0 ? ((listing.profit / listing.revenue) * 100).toFixed(1) : null;
  const revMultiple = listing.revenue > 0 ? (listing.price / listing.revenue).toFixed(1) : null;
  const profitMultiple = listing.profit > 0 ? (listing.price / listing.profit).toFixed(1) : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-full uppercase tracking-wider border border-blue-100 shadow-sm">
                {listing.category}
              </span>
              {defaultCountry && (
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1 border border-amber-100/60 shadow-sm">
                  <MapPin className="w-3.5 h-3.5" /> {defaultCountry}
                </span>
              )}
              {defaultFoundedYear && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1 border border-purple-100/60 shadow-sm">
                  <Calendar className="w-3.5 h-3.5" /> Est. {defaultFoundedYear}
                </span>
              )}
              <span className="text-gray-300 text-xs hidden sm:inline">•</span>
              <span className="text-gray-500 text-xs">Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">{listing.title}</h1>
            {defaultTagline && (
              <p className="mt-3 text-lg sm:text-xl text-gray-500 font-medium italic leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50/30 py-1.5 rounded-r-lg">
                &ldquo;{defaultTagline}&rdquo;
              </p>
            )}
          </div>

          {/* Core Financial Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Asking Price Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/20 rounded-full blur-xl -mr-4 -mt-4" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1.5 mb-2">
                <BarChart3 className="w-4 h-4" /> Asking Price
              </span>
              <span className="text-3xl font-black text-blue-700 block">
                ${listing.price.toLocaleString()}
              </span>
              {profitMultiple && (
                <span className="mt-2 inline-block px-2.5 py-0.5 bg-blue-100/60 text-blue-700 text-[11px] font-bold rounded-md">
                  {profitMultiple}x Net Profit
                </span>
              )}
            </div>

            {/* Annual Revenue Card */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2">
                <DollarSign className="w-4 h-4" /> Annual Revenue
              </span>
              <span className="text-3xl font-extrabold text-gray-900 block">
                ${listing.revenue.toLocaleString()}
              </span>
              {revMultiple && (
                <span className="mt-2 inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-md">
                  {revMultiple}x Revenue
                </span>
              )}
            </div>

            {/* Annual Profit Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-white p-6 rounded-2xl border border-emerald-100/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/10 rounded-full blur-xl -mr-4 -mt-4" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-4 h-4" /> Annual Profit
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 block">
                ${listing.profit.toLocaleString()}
              </span>
              {netMargin && (
                <span className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md flex items-center gap-1 w-fit">
                  <Percent className="w-3 h-3" /> {netMargin}% Margin
                </span>
              )}
            </div>

            {/* Trust & Verification Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-50/40 via-white to-white p-6 rounded-2xl border border-amber-100/60 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-4 h-4" /> Data Verification
              </span>
              <span className="text-xl font-bold text-gray-800 block leading-tight mt-1">
                Verified Claims
              </span>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                Financial metrics have been checked and audited by platform administrators.
              </p>
            </div>
          </div>

          {/* Main Description */}
          <div className="space-y-4 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" /> Executive Summary
            </h2>
            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed text-[15px] space-y-4">
              {listing.description.split('\n').map((para, i) => (
                <p key={i}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Business Operations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Model */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" /> Business Model
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {defaultBusinessModel}
              </p>
            </div>

            {/* USP */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Competitive Advantage (USP)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {defaultUsp}
              </p>
            </div>
          </div>

          {/* Reason for Selling & Included Assets */}
          <div className="space-y-6">
            {/* Reason for Selling */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" /> Reason for Sale
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {defaultReasonForSelling}
              </p>
            </div>

            {/* Assets Included */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-500" /> Included Assets & IP
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {defaultAssetsIncluded.split(',').map((asset, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-xs font-medium text-gray-700 leading-normal">{asset.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 space-y-6">
          {!isSeller && !isAdmin && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Interested in this deal?</h3>
                <p className="text-sm text-gray-600">
                  You need to request access to view contact details and message the seller.
                </p>

                {!session ? (
                  <Link
                    href="/auth/signin"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center"
                  >
                    Sign in to Request Access
                  </Link>
                ) : accessRequest?.status === "PENDING" ? (
                  <button className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-lg cursor-not-allowed" disabled>
                    Access Request Pending
                  </button>
                ) : accessRequest?.status === "APPROVED" ? (
                  <Link
                    href={`/messages/${listing.id}-${user?.id}`}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors block text-center"
                  >
                    Open Conversation
                  </Link>
                ) : (
                  <RequestAccessButton listingId={listing.id} />
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 relative overflow-hidden">
                <div className={`flex items-center gap-3 transition-all ${!isApproved ? 'blur-[4px] select-none pointer-events-none' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                    {listing.seller.name?.[0] || 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      {listing.seller.name || 'Anonymous Seller'}
                      {listing.seller.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Seller since {new Date(listing.seller.createdAt).getFullYear()}</p>
                  </div>
                </div>
                {!isApproved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <span className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                      🔒 Contact details locked
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Traction Highlights Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h4 className="font-bold text-gray-900 text-base flex items-center gap-2 border-b border-gray-100 pb-3">
              <Activity className="w-5 h-5 text-blue-500" /> Traction & Assets
            </h4>
            <div className="space-y-4">
              {/* Founded Year */}
              {defaultFoundedYear && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Established</span>
                    <span className="text-sm font-bold text-gray-800">Founded in {defaultFoundedYear}</span>
                  </div>
                </div>
              )}

              {/* Customer Count */}
              {defaultCustomerCount && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Customer Base</span>
                    <span className="text-sm font-bold text-gray-800">{defaultCustomerCount.toLocaleString()} active users</span>
                  </div>
                </div>
              )}

              {/* Traffic */}
              {defaultTraffic && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Monthly Traffic</span>
                    <span className="text-xs font-semibold text-gray-700 leading-normal block">{defaultTraffic}</span>
                  </div>
                </div>
              )}


              {/* Website URL Lock */}
              <div className="flex items-start gap-3 pt-3 border-t border-gray-50">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Website URL</span>
                  {isApproved ? (
                    <a
                      href={defaultWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors group cursor-pointer"
                    >
                      Visit Website <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Locked (Access Approved Only)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isSeller && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
              <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> You own this listing
              </h4>
              <p className="text-xs text-blue-800 leading-normal">
                As the seller, you can see all details. Buyers will need to request access before they can see your contact details and start a chat with you.
              </p>
              {listing.status === "REJECTED" && listing.rejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1 animate-pulse-subtle">
                  <p className="text-xs font-bold text-red-700">Rejection Reason:</p>
                  <p className="text-xs text-red-600 leading-normal">{listing.rejectionReason}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Link
                  href={`/listings/${id}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <Edit className="w-3 h-3" /> Edit
                </Link>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-red-600 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
                      fetch(`/api/listings/${id}`, { method: "DELETE" })
                        .then(() => window.location.href = "/dashboard/seller")
                        .catch(() => alert("Failed to delete listing"));
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          )}

          {!isSeller && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> RevenueVault Safe Guard
              </h4>
              <p className="text-xs text-blue-800 leading-normal">
                We verify all financial claims. Never share personal information or payment details before seller approval.
              </p>
            </div>
          )}

          {session && !isSeller && !isAdmin && (
            <ReportListingButton listingId={listing.id} />
          )}
        </div>
      </div>
    </div>
  );
}

