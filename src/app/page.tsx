import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe, Lock, BarChart3, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 fill-blue-700" /> The Modern Startup Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Buy and Sell Startups <br className="hidden md:block" />
            <span className="text-blue-600 italic">With Total Anonymity.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            RevenueVault is the most secure platform to exit your startup or acquire your next venture. Verified financials, escrow-ready deals, and private communication.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              Explore Marketplace <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/onboarding"
              className="w-full sm:w-auto bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              List Your Startup
            </Link>
          </div>

          {/* Social Proof Placeholder */}
          <div className="mt-20 pt-10 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by founders from</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale">
              <div className="text-2xl font-black">STRIPE</div>
              <div className="text-2xl font-black">VERCEL</div>
              <div className="text-2xl font-black">PRISMA</div>
              <div className="text-2xl font-black">AWS</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Privacy First</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sell your startup without alerting your competitors or employees. Your identity is hidden until you approve a buyer.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verified Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  We verify revenue and profit claims before a listing goes live, reducing the risk of fraud and wasted time.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Smart Deal Flow</h3>
                <p className="text-gray-600 leading-relaxed">
                  Manage the entire acquisition process in one dashboard. From initial interest to due diligence and closing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center">
          <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Ready to find your <br /> next startup venture?</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto font-medium">
                Join 5,000+ founders and investors already using RevenueVault to browse, buy, and sell digital assets.
              </p>
              <Link
                href="/onboarding"
                className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all inline-block shadow-xl shadow-blue-900/20"
              >
                Start for Free
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}
