import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Lock, BarChart3, TrendingUp, Check, 
  Search, Bell, Sparkles, MessageSquare, SlidersHorizontal, Eye,
  HelpCircle, CheckCircle2, Globe, FileSpreadsheet, Mail, DollarSign, Users,
  SearchCode
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session?.user && (session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="bg-slate-50/50 min-h-screen overflow-x-hidden">
      {/* Hero Section Wrapper with Background Image */}
      <div 
        className="w-full relative overflow-hidden bg-no-repeat bg-cover bg-center border-b border-slate-100" 
        style={{ backgroundImage: "url('/bg1.png')" }}
      >
        {/* Subtle ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/30 -z-20 pointer-events-none"></div>

        {/* Hero Section */}
        <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-6 max-w-7xl mx-auto z-10">
          <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>
          <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-3xl rounded-full -z-10 pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600 animate-pulse" /> Verified SaaS Marketplace
              </div>
              
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] flex flex-col gap-2">
                <span>The All-in-One SaaS Acquisition Platform</span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent italic font-serif font-semibold tracking-normal text-2xl md:text-3xl xl:text-4xl leading-snug">
                  Discover. Analyze. Discuss. Acquire.
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
                Stop wasting time switching between marketplaces, spreadsheets, emails, and DMs. RevenueVault brings everything you need into one platform—discover verified SaaS opportunities, analyze key business metrics, connect directly with founders, and buy or sell with confidence.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/marketplace"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-7 py-3.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-indigo-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group shadow-md"
                >
                  Explore Marketplace <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {(!session?.user || (session.user as any).role === "SELLER") && (
                  <Link
                    href="/onboarding"
                    className="w-full sm:w-auto bg-white border border-indigo-100 text-indigo-600 px-7 py-3.5 rounded-full font-bold text-sm hover:bg-indigo-50/30 hover:border-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center shadow-sm"
                  >
                    List Your SaaS
                  </Link>
                )}
              </div>

              {/* Trusted Badges Section */}
              <div className="pt-6 border-t border-slate-200/60 space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Trusted by Founders & Buyers</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700 font-semibold text-xs">
                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-xs hover:border-indigo-100 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Verified Business Listings</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-xs hover:border-indigo-100 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>Transparent SaaS Metrics</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-xs hover:border-indigo-100 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>Anonymous Founder Discussions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-xs hover:border-indigo-100 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>Built for Indian Founders. Open to Global Buyers.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Mockup Column */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-4">
              <div className="absolute inset-0 bg-dot-grid -z-20 mask-gradient opacity-60"></div>
              
              {/* Dashboard UI Card Mockup */}
              <div className="w-full max-w-[500px] bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden transition-all duration-500 hover:shadow-2xl animate-float-subtle">
                {/* Window Header */}
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="w-28 sm:w-52 h-7 bg-slate-100 rounded-full flex items-center px-3 gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-medium">Search verified SaaS...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold">RV</div>
                  </div>
                </div>

                {/* Dashboard Layout */}
                <div className="grid grid-cols-12 h-[320px]">
                  {/* Mini Sidebar */}
                  <div className="hidden md:block col-span-3 bg-slate-50/50 border-r border-slate-100 p-3 space-y-3">
                    <div className="text-[10px] font-extrabold text-indigo-600/80 uppercase tracking-widest px-2">RevenueVault</div>
                    <nav className="space-y-1.5">
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-indigo-50/70 text-indigo-600 font-bold text-xs cursor-pointer">
                        <Sparkles className="w-3.5 h-3.5" /> Discover
                      </div>
                      {["Analyze", "Discuss", "Acquire", "Metrics", "Verification", "Messaging"].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 font-semibold text-xs transition-colors cursor-pointer">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          {item}
                        </div>
                      ))}
                    </nav>
                  </div>

                  {/* Dashboard Main Content */}
                  <div className="col-span-12 md:col-span-9 p-4 space-y-3 overflow-y-auto">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-extrabold text-slate-800">Featured SaaS Opportunities</h4>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1 h-1 bg-emerald-600 rounded-full animate-ping"></span> Live Market
                      </span>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI Platform</p>
                        <p className="text-sm font-black text-slate-800 mt-1">$4,200</p>
                        <span className="text-[8px] font-extrabold text-emerald-600">MRR (+18%)</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dev API</p>
                        <p className="text-sm font-black text-slate-800 mt-1">$9,800</p>
                        <span className="text-[8px] font-extrabold text-emerald-600">MRR (42% margin)</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Marketing</p>
                        <p className="text-sm font-black text-slate-800 mt-1">$2,900</p>
                        <span className="text-[8px] font-extrabold text-indigo-600">MRR (Since 2023)</span>
                      </div>
                    </div>

                    {/* Featured Cards Split */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 md:col-span-7 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-800">Verified Opportunities</span>
                          <span className="text-indigo-600 cursor-pointer hover:underline">Explore</span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { name: "AI Customer Support", mrr: "$4,200 MRR", tag: "310 Customers", color: "from-blue-500 to-indigo-500" },
                            { name: "Developer API SaaS", mrr: "$9,800 MRR", tag: "42% Margin", color: "from-purple-500 to-violet-500" },
                            { name: "Marketing Automation", mrr: "$2,900 MRR", tag: "Since 2023", color: "from-fuchsia-500 to-rose-500" }
                          ].map((row, idx) => (
                            <div key={idx} className="bg-white p-1.5 rounded-lg border border-slate-100 flex items-center justify-between hover:scale-[1.01] transition-transform">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${row.color} flex items-center justify-center text-[9px] font-bold text-white`}>
                                  {row.name[0]}
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-800 truncate w-24">{row.name}</p>
                                  <p className="text-[7px] text-slate-400 font-bold">{row.tag}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] font-extrabold text-slate-800">{row.mrr}</p>
                                <p className="text-[7px] text-emerald-600 font-bold">Verified</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-5 flex flex-col gap-2">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Metrics Verification</p>
                            <span className="text-[7px] font-black text-emerald-600">100% Live</span>
                          </div>
                          <div className="w-full h-6 mt-1">
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

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Acquisition Flow</p>
                          <p className="text-xs font-black text-slate-800 mt-0.5">Private & Direct</p>
                          <span className="text-[7px] font-extrabold text-indigo-600">Zero Detective Work</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Mobile Device Mockup */}
              <div className="absolute -bottom-6 -left-4 w-44 bg-white rounded-[28px] border-4 border-slate-900 shadow-2xl p-2.5 overflow-hidden z-10 transition-all duration-500 hover:rotate-2 hover:scale-105 animate-float hidden sm:block">
                <div className="w-12 h-2.5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">RevenueVault</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center space-y-1.5">
                    <div>
                      <p className="text-[7px] font-bold text-slate-400 uppercase">Featured SaaS</p>
                      <p className="text-xs font-black text-slate-800 mt-0.5">Developer API</p>
                    </div>
                    <div className="h-px bg-slate-200/60 my-1"></div>
                    <div>
                      <p className="text-[7px] font-bold text-slate-400 uppercase">MRR / Margin</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">$9,800 / 42%</p>
                    </div>
                  </div>

                  <button className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-[8px] font-extrabold tracking-wide hover:opacity-90 cursor-pointer shadow-xs">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Why RevenueVault? Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-4 mb-10">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-900/60 border border-indigo-700/50 px-4 py-1.5 rounded-full inline-block">
              Why RevenueVault?
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Buying a SaaS shouldn't feel like detective work.
            </h2>
            <p className="text-slate-300 text-base md:text-lg font-medium">
              Today, buyers spend weeks:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {[
              { title: "Searching multiple marketplaces", icon: <SearchCode className="w-5 h-5 text-rose-400" /> },
              { title: "Requesting spreadsheets", icon: <FileSpreadsheet className="w-5 h-5 text-amber-400" /> },
              { title: "Chasing founders through email", icon: <Mail className="w-5 h-5 text-indigo-400" /> },
              { title: "Verifying revenue manually", icon: <DollarSign className="w-5 h-5 text-emerald-400" /> },
              { title: "Comparing businesses one by one", icon: <SlidersHorizontal className="w-5 h-5 text-purple-400" /> },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-slate-200">• {item.title}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-2xl text-center md:flex items-center justify-between gap-4">
            <p className="text-lg md:text-xl font-bold tracking-tight mb-3 md:mb-0">
              ⚡ RevenueVault brings every step into one place.
            </p>
            <Link 
              href="/marketplace"
              className="bg-white text-indigo-950 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-indigo-50 transition-all inline-flex items-center gap-2 shrink-0 shadow-md"
            >
              Explore Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Everything You Need Before You Buy Section */}
      <section className="bg-white border-y border-slate-100 py-24 px-6 relative">
        <div className="absolute inset-0 bg-dot-grid -z-10 opacity-30"></div>
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block">
              Comprehensive Platform
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need Before You Buy
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-medium">
              RevenueVault brings every step of your acquisition journey into one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Discover */}
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-premium transition-all duration-300 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                🔍 Discover
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Browse SaaS businesses across AI, SaaS, E-commerce, Developer Tools, FinTech, Healthcare, Marketing, and more.
              </p>
              <div className="pt-2">
                <p className="text-blue-900 text-xs font-bold bg-blue-100/70 px-3.5 py-2 rounded-xl">
                  Find opportunities that match your budget, industry, and goals.
                </p>
              </div>
            </div>

            {/* Analyze */}
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-premium transition-all duration-300 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                📊 Analyze
              </h3>
              <p className="text-slate-600 font-medium text-sm">
                Review everything that matters before contacting a founder:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-1.5">• Monthly Recurring Revenue (MRR)</li>
                <li className="flex items-center gap-1.5">• Annual Recurring Revenue (ARR)</li>
                <li className="flex items-center gap-1.5">• Profit</li>
                <li className="flex items-center gap-1.5">• Growth Rate</li>
                <li className="flex items-center gap-1.5">• Customer Metrics</li>
                <li className="flex items-center gap-1.5">• Asking Price</li>
                <li className="flex items-center gap-1.5 col-span-1 sm:col-span-2">• Business Overview</li>
              </ul>
              <div className="pt-2 flex items-center gap-3">
                <span className="bg-emerald-100/70 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-xl">No spreadsheets.</span>
                <span className="bg-emerald-100/70 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-xl">No guessing.</span>
              </div>
            </div>

            {/* Discuss */}
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-premium transition-all duration-300 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                💬 Discuss
              </h3>
              <div className="space-y-2 text-slate-600 font-medium text-sm">
                <p>Connect with founders inside RevenueVault.</p>
                <p>Ask questions.</p>
                <p>Negotiate privately.</p>
              </div>
              <div className="pt-2">
                <p className="text-indigo-900 text-xs font-bold bg-indigo-100/70 px-3.5 py-2 rounded-xl">
                  Build trust before sharing sensitive information.
                </p>
              </div>
            </div>

            {/* Acquire */}
            <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-premium transition-all duration-300 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                🤝 Acquire
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                When you're ready, move confidently toward acquisition with all the information already in one place.
              </p>
              <div className="pt-2">
                <p className="text-amber-900 text-xs font-bold bg-amber-100/70 px-3.5 py-2 rounded-xl">
                  Seamless transition from inquiry to deal close.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buyers Love & Why Founders List Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Why Buyers Love RevenueVault */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Why Buyers Love RevenueVault</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Save hours of research",
                "Compare businesses faster",
                "View important metrics instantly",
                "Talk directly with founders",
                "Discover opportunities before everyone else"
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 font-semibold text-base">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why Founders List on RevenueVault */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Why Founders List on RevenueVault</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Reach serious buyers.",
                "Show your business professionally.",
                "Present verified metrics.",
                "Receive qualified acquisition interest.",
                "Sell with confidence."
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 font-semibold text-base">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured SaaS Opportunities Section */}
      <section className="bg-slate-100/60 border-y border-slate-200/60 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block mb-3">
                Live Listings
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Featured SaaS Opportunities
              </h2>
            </div>
            <Link 
              href="/marketplace"
              className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1 group"
            >
              Explore Marketplace <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                    Industry: AI
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Verified
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">AI Customer Support Platform</h3>
                
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-sm">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase">MRR</p>
                    <p className="font-extrabold text-slate-900 text-base">$4,200</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase">Growth</p>
                    <p className="font-extrabold text-emerald-600 text-base">+18%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-slate-400 uppercase">Customers</p>
                    <p className="font-bold text-slate-800">310</p>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/marketplace"
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100">
                    Industry: Developer Tools
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Verified
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Developer API SaaS</h3>
                
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-sm">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase">MRR</p>
                    <p className="font-extrabold text-slate-900 text-base">$9,800</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase">Profit Margin</p>
                    <p className="font-extrabold text-purple-600 text-base">42%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-slate-400 uppercase">Industry</p>
                    <p className="font-bold text-slate-800">Developer Tools</p>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/marketplace"
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-100">
                    Industry: Marketing
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Verified
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Marketing Automation SaaS</h3>
                
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-sm">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase">MRR</p>
                    <p className="font-extrabold text-slate-900 text-base">$2,900</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase">Track Record</p>
                    <p className="font-extrabold text-rose-600 text-base">Growing Since 2023</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-slate-400 uppercase">Industry</p>
                    <p className="font-bold text-slate-800">Marketing</p>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/marketplace"
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Modern SaaS Acquisitions Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Built for Modern SaaS Acquisitions
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-medium">
            RevenueVault combines the tools buyers and founders need into one platform.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Marketplace", icon: <Sparkles className="w-4 h-4 text-blue-600" /> },
            { label: "Analytics", icon: <BarChart3 className="w-4 h-4 text-indigo-600" /> },
            { label: "Founder Discussions", icon: <MessageSquare className="w-4 h-4 text-violet-600" /> },
            { label: "Business Profiles", icon: <Users className="w-4 h-4 text-purple-600" /> },
            { label: "Verification", icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
            { label: "Smart Search", icon: <Search className="w-4 h-4 text-rose-600" /> },
            { label: "Saved Opportunities", icon: <Eye className="w-4 h-4 text-amber-600" /> },
            { label: "Secure Messaging", icon: <Lock className="w-4 h-4 text-teal-600" /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-center gap-2.5 font-extrabold text-sm text-slate-800 hover:border-indigo-200 hover:shadow-md transition-all">
              <span className="p-1.5 rounded-lg bg-slate-50">{item.icon}</span>
              <span>✓ {item.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <p className="text-base font-extrabold text-indigo-600 tracking-wide uppercase">
            Everything happens in one place.
          </p>
        </div>
      </section>

      {/* Why RevenueVault Exists Section */}
      <section className="bg-white border-y border-slate-100 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Why RevenueVault Exists
          </h2>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium max-w-3xl mx-auto">
            We started RevenueVault because buying or selling a SaaS business shouldn't require jumping across five different platforms.
          </p>

          <div className="flex flex-wrap justify-center gap-3 py-4">
            {["Research.", "Analysis.", "Communication.", "Discovery.", "Transactions."].map((word, idx) => (
              <span key={idx} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-extrabold text-sm md:text-base border border-slate-200/80">
                {word}
              </span>
            ))}
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-base md:text-lg font-bold text-slate-800">
              Everything belongs in one trusted workspace.
            </p>
            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/60">
              Our mission is to simplify SaaS acquisitions for founders in India and connect them with buyers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block">
            Got Questions?
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "Is RevenueVault only for Indian founders?",
              a: "No. RevenueVault is built for Indian founders while welcoming buyers and sellers from around the world."
            },
            {
              q: "Are listings verified?",
              a: "We encourage verification and continuously improve our review process so buyers can make informed decisions."
            },
            {
              q: "Can buyers contact founders privately?",
              a: "Yes. RevenueVault provides secure communication between buyers and founders."
            },
            {
              q: "Can I list my SaaS for free?",
              a: "Yes. Early users can list their businesses at no cost."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 p-12 md:p-20 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Research Less. Acquire Faster.
              </h2>
              <p className="text-slate-300 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                Everything you need to discover, analyze, discuss, and acquire SaaS businesses—in one platform.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:justify-end">
              <Link
                href="/marketplace"
                className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-base hover:shadow-xl hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center shadow-lg flex items-center justify-center gap-2"
              >
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/onboarding"
                className="bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500/50 text-white px-8 py-4 rounded-full font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center backdrop-blur-md"
              >
                List Your SaaS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
