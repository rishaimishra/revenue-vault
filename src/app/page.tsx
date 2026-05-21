import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Lock, BarChart3, TrendingUp, Check, 
  Search, Bell, Sparkles, Star, MessageSquare, Files, SlidersHorizontal, Eye
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50/50 min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-6 max-w-7xl mx-auto">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-3xl rounded-full -z-10 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600 animate-pulse" /> The Modern Startup Marketplace
            </div>
            
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              Buy and Sell Startups <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent italic font-serif font-semibold tracking-normal">
                With Total Anonymity.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
              RevenueVault is the most secure platform to exit your startup or acquire your next venture. Verified financials, escrow-ready deals, and private communication.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-8 py-4.5 rounded-full font-bold text-base hover:shadow-lg hover:shadow-indigo-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group shadow-md"
              >
                Explore Marketplace <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/onboarding"
                className="w-full sm:w-auto bg-white border border-indigo-100 text-indigo-600 px-8 py-4.5 rounded-full font-bold text-base hover:bg-indigo-50/20 hover:border-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center shadow-sm"
              >
                List Your Startup
              </Link>
            </div>

            {/* Badges/Trust Row */}
            <div className="pt-4 flex flex-wrap gap-y-3 gap-x-6 text-slate-500 font-semibold text-sm">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100/80 shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100/80 shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span>Escrow-Ready Deals</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100/80 shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span>Verified Financials</span>
              </div>
            </div>
          </div>

          {/* Right Mockup Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-8">
            <div className="absolute inset-0 bg-dot-grid -z-20 mask-gradient opacity-60"></div>
            
            {/* Dashboard UI Card Mockup */}
            <div className="w-full max-w-[560px] bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden transition-all duration-500 hover:shadow-2xl animate-float-subtle">
              {/* Window Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
                {/* Search Bar Mockup */}
                <div className="w-52 h-7 bg-slate-100 rounded-full flex items-center px-3 gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-medium">Search startups...</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold">JD</div>
                </div>
              </div>

              {/* Dashboard Layout */}
              <div className="grid grid-cols-12 h-[380px]">
                {/* Mini Sidebar */}
                <div className="col-span-3 bg-slate-50/50 border-r border-slate-100 p-4 space-y-4">
                  <div className="text-[10px] font-extrabold text-indigo-600/80 uppercase tracking-widest px-2">RevenueVault</div>
                  <nav className="space-y-1.5">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-indigo-50/70 text-indigo-600 font-bold text-xs cursor-pointer">
                      <Sparkles className="w-3.5 h-3.5" /> Overview
                    </div>
                    {["Listings", "Messages", "Watchlist", "Documents", "Notifications", "Earnings"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 font-semibold text-xs transition-colors cursor-pointer">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {item}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Dashboard Main Content */}
                <div className="col-span-9 p-5 space-y-4 overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-extrabold text-slate-800">Marketplace Overview</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-600 rounded-full animate-ping"></span> Live Market
                    </span>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Listings</p>
                      <p className="text-sm font-black text-slate-800 mt-1">2,541</p>
                      <span className="text-[8px] font-extrabold text-emerald-600">+12.3%</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">New This Week</p>
                      <p className="text-sm font-black text-slate-800 mt-1">312</p>
                      <span className="text-[8px] font-extrabold text-emerald-600">+8.5%</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Deal Value</p>
                      <p className="text-sm font-black text-slate-800 mt-1">$150.6M</p>
                      <span className="text-[8px] font-extrabold text-emerald-600">+10.2%</span>
                    </div>
                  </div>

                  {/* Listings Table & Deal Flow Chart split */}
                  <div className="grid grid-cols-12 gap-3">
                    {/* Left: Recent Listings */}
                    <div className="col-span-7 bg-slate-50 p-3 rounded-2xl border border-slate-100/50 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-800">Recent Listings</span>
                        <span className="text-indigo-600 cursor-pointer hover:underline">View all</span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { name: "SaaS Analytics Platform", arr: "$2.4M", price: "$12M", color: "from-blue-500 to-indigo-500" },
                          { name: "Fintech Workflow App", arr: "$1.1M", price: "$7.5M", color: "from-purple-500 to-violet-500" },
                          { name: "AI Content Tool", arr: "$820K", price: "$4.7M", color: "from-fuchsia-500 to-rose-500" }
                        ].map((row, idx) => (
                          <div key={idx} className="bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-between hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${row.color} flex items-center justify-center text-[9px] font-bold text-white`}>
                                {row.name[0]}
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-slate-800 truncate w-24">{row.name}</p>
                                <p className="text-[7px] text-slate-400 font-bold">ARR: {row.arr}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-extrabold text-slate-800">{row.price}</p>
                              <p className="text-[7px] text-emerald-600 font-bold">Escrow</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Deal Flow & Profit */}
                    <div className="col-span-5 flex flex-col gap-3">
                      {/* Deal Flow Chart Card */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Deal Flow</p>
                          <span className="text-[7px] font-black text-emerald-600">+18.5%</span>
                        </div>
                        {/* Mini SVG Sparkline */}
                        <div className="w-full h-8 mt-1">
                          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M0,35 Q15,30 30,15 T60,25 T90,5 T100,5" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
                            <path d="M0,35 Q15,30 30,15 T60,25 T90,5 T100,5 L100,40 L0,40 Z" fill="url(#chart-glow)" />
                          </svg>
                        </div>
                      </div>

                      {/* Profit Card */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Total Profit Distributed</p>
                        <p className="text-xs font-black text-slate-800 mt-0.5">$42.7M</p>
                        <span className="text-[7px] font-extrabold text-emerald-600">+11.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Mobile Device Mockup */}
            <div className="absolute -bottom-8 -left-4 w-52 bg-white rounded-[32px] border-4 border-slate-900 shadow-2xl p-3 overflow-hidden z-10 transition-all duration-500 hover:rotate-2 hover:scale-105 animate-float hidden sm:block">
              {/* Notch */}
              <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto mb-3.5 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-slate-800"></span>
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">ProjectTrunk</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center space-y-2">
                  <div>
                    <p className="text-[7px] font-bold text-slate-400 uppercase">Selling Price</p>
                    <p className="text-base font-black text-slate-800 mt-0.5">$2.4M</p>
                  </div>
                  <div className="h-px bg-slate-200/60 my-1"></div>
                  <div>
                    <p className="text-[7px] font-bold text-slate-400 uppercase">Weekly Profit</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">$210K</p>
                  </div>
                </div>

                {/* Mobile Button Mockup */}
                <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[9px] font-extrabold tracking-wide hover:opacity-90 cursor-pointer shadow-sm active:scale-[0.98] transition-all">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Brand Grid */}
      <section className="bg-white border-y border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Trusted by Founders & Investors</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:opacity-75 transition-all duration-300">
            {/* Stripe */}
            <div className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-1 font-sans">
              stripe
            </div>
            {/* Vercel */}
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
              <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 75 65">
                <polygon points="37.5,0 75,65 0,65" />
              </svg>
              Vercel
            </div>
            {/* Prisma */}
            <div className="text-2xl font-extrabold tracking-widest text-slate-900 font-mono">
              PRISMA
            </div>
            {/* AWS */}
            <div className="text-xl font-black tracking-tight text-slate-800 font-sans relative">
              aws
              <svg className="w-8 h-2.5 text-orange-500 absolute -bottom-2.5 left-0" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M10,10 Q50,30 90,10" />
              </svg>
            </div>
            {/* Linear */}
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
              <div className="w-5 h-5 rounded-full border-3 border-slate-900 flex items-center justify-center font-bold text-[8px]">L</div>
              Linear
            </div>
            {/* Shopify */}
            <div className="flex items-center gap-1 text-2xl font-black text-slate-800 tracking-tight">
              shopify
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Props (3 Columns) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Privacy First",
              desc: "Sell or buy startups without revealing your identity. Our priority is to protect your privacy and keep your data secure.",
              icon: <Lock className="w-5 h-5 stroke-[2.2]" />,
              color: "from-blue-500 to-indigo-500",
              bgColor: "bg-blue-50"
            },
            {
              title: "Verified Data",
              desc: "We verify revenue and profit claims before a listing goes live, reducing the risk of fraud and wasted time.",
              icon: <Check className="w-5 h-5 stroke-[2.5]" />,
              color: "from-indigo-500 to-purple-500",
              bgColor: "bg-indigo-50"
            },
            {
              title: "Smart Deal Flow",
              desc: "Manage the entire acquisition process in one dashboard. From initial interest to due diligence and closing.",
              icon: <TrendingUp className="w-5 h-5 stroke-[2.2]" />,
              color: "from-purple-500 to-pink-500",
              bgColor: "bg-purple-50"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-6">
                <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center text-indigo-600 bg-gradient-to-br transition-all duration-300 group-hover:scale-105`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm">{item.desc}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-50">
                <Link href="/about" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  Learn more <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="bg-white border-y border-slate-100 py-24 px-6 relative">
        <div className="absolute inset-0 bg-dot-grid -z-10 opacity-30"></div>
        <div className="max-w-7xl mx-auto space-y-16 text-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100/60 px-4.5 py-1.5 rounded-full">
              All the tools you need to buy or sell
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
              Everything you need, <br /> all in one <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">secure</span> platform.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Anonymous Communication",
                desc: "Chat privately and negotiate without revealing your identity.",
                icon: <MessageSquare className="w-5 h-5" />,
                color: "bg-blue-50 text-blue-600 border-blue-100"
              },
              {
                title: "Escrow-Ready Deals",
                desc: "Secure transactions with built-in escrow integration.",
                icon: <ShieldCheck className="w-5 h-5" />,
                color: "bg-indigo-50 text-indigo-600 border-indigo-100"
              },
              {
                title: "Verified Financials",
                desc: "Detailed financials verified by our team before listing.",
                icon: <BarChart3 className="w-5 h-5" />,
                color: "bg-purple-50 text-purple-600 border-purple-100"
              },
              {
                title: "Document Vault",
                desc: "Share and manage documents securely in one place.",
                icon: <Files className="w-5 h-5" />,
                color: "bg-violet-50 text-violet-600 border-violet-100"
              },
              {
                title: "Advanced Search & Filters",
                desc: "Find the perfect match with powerful filters and search.",
                icon: <SlidersHorizontal className="w-5 h-5" />,
                color: "bg-rose-50 text-rose-600 border-rose-100"
              },
              {
                title: "Watchlist & Notifications",
                desc: "Track listings and get notified about new opportunities.",
                icon: <Eye className="w-5 h-5" />,
                color: "bg-emerald-50 text-emerald-600 border-emerald-100"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50/50 p-7.5 rounded-3xl border border-slate-100 flex items-start gap-5 hover:bg-white hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-slate-900 tracking-tight">{feature.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blue/Purple Stats Bar */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/10 overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid -z-10 opacity-15"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-6 md:px-12 text-center items-center relative divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {[
              { stat: "2,500+", desc: "Startups Listed" },
              { stat: "5,000+", desc: "Active Buyers" },
              { stat: "$150M+", desc: "Total Deal Value" },
              { stat: "98%", desc: "User Satisfaction" }
            ].map((metric, idx) => (
              <div key={idx} className="space-y-2 pt-6 first:pt-0 lg:pt-0">
                <p className="text-4xl md:text-5xl font-black tracking-tight">{metric.stat}</p>
                <p className="text-indigo-100/90 text-sm font-semibold tracking-wide uppercase">{metric.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50/50 border-t border-slate-100 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16 text-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100/60 px-4.5 py-1.5 rounded-full">
              Loved by our community
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              What our <span className="italic text-indigo-600 font-serif font-semibold">users</span> say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                text: "RevenueVault made selling our startup a smooth and private experience. The verified buyers saved us so much time.",
                name: "Alex R.",
                role: "Founder",
                avatar: "AR",
                color: "bg-blue-600"
              },
              {
                text: "The level of due diligence and secure communication on this platform is unmatched. Highly recommended!",
                name: "Sarah M.",
                role: "Investor",
                avatar: "SM",
                color: "bg-indigo-600"
              },
              {
                text: "Found my next acquisition within weeks. The smart filters and verified data are game-changers.",
                name: "Daniel K.",
                role: "Acquirer",
                avatar: "DK",
                color: "bg-violet-600"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-premium transition-shadow duration-300">
                <div className="space-y-5">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-slate-50">
                  <div className={`w-10 h-10 rounded-full ${testimonial.color} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm">{testimonial.name}</h5>
                    <p className="text-slate-400 text-xs font-semibold">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Pagination */}
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 p-12 md:p-20 text-white overflow-hidden shadow-2xl">
          {/* Decorative Glowing Blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              {/* Rocket icon container */}
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg animate-float-subtle">
                <svg className="w-8 h-8 text-indigo-300 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 15 2 22" />
                  <path d="M15 9 22 2" />
                </svg>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  Ready to find your <br className="hidden md:block" /> next startup venture?
                </h2>
                <p className="text-slate-300 text-sm md:text-base font-semibold max-w-xl leading-relaxed">
                  Join 5,000+ founders and investors already using RevenueVault to buy, sell and grow.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                href="/onboarding"
                className="bg-white text-indigo-900 px-10 py-5 rounded-full font-bold text-lg hover:shadow-xl hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-block text-center shadow-lg"
              >
                Start for Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
