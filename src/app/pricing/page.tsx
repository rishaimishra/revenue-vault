"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Zap, Shield, Sparkles, Building2, Globe, HeartHandshake } from "lucide-react";

export default function PricingPage() {
  const [pricingInfo, setPricingInfo] = useState<{ enabled: boolean; amount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPricing() {
      try {
        const response = await fetch("/api/pricing/info");
        if (response.ok) {
          const data = await response.json();
          setPricingInfo(data);
        }
      } catch (error) {
        console.error("Failed to load pricing info:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPricing();
  }, []);

  const handleCreateListing = () => {
    router.push("/listings/new");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50/30">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const isFree = pricingInfo ? !pricingInfo.enabled : true;
  const listingFee = pricingInfo ? pricingInfo.amount : 0;

  return (
    <div className="relative min-h-screen bg-slate-50/30 py-20 px-4 overflow-hidden select-none">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest leading-none bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100/50">
          Monetization Transparency
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Simple, Pay-Per-Listing Pricing
        </h1>
        <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          No monthly subscription traps. No recurring fees. Pay a small one-time fee only when you list a startup for sale.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Value Proposition Card */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-800">Why sell on RevenueVault?</h2>
            <p className="text-xs text-slate-500">We connect you with thousands of verified high-intent startup buyers worldwide.</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-xs">Robust NDA & Encryption</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">All startup data and buyer negotiations are completely anonymous and encrypted.</p>
              </div>
            </div>

            <div className="flex gap-3 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-xs">Global Network</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Instantly reach institutional buyers, private equity shops, and angel investors.</p>
              </div>
            </div>

            <div className="flex gap-3 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-xs">Detailed Business Auditing</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Our admin specialists verify financials and claims to increase buyer confidence.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Dynamic Price Box */}
        <div className="md:col-span-5 bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-indigo-100/50 shadow-xl shadow-indigo-100/20 relative overflow-hidden flex flex-col items-center text-center">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          
          {isFree ? (
            <div className="absolute -right-16 top-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black py-1 px-16 rotate-45 uppercase tracking-widest shadow-md">
              Special Offer
            </div>
          ) : (
            <div className="absolute -right-16 top-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-black py-1 px-16 rotate-45 uppercase tracking-widest shadow-md">
              Standard
            </div>
          )}

          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 border border-indigo-100">
            <Zap className="w-5 h-5 stroke-[2.2]" />
          </div>

          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            One-Time Fee
          </span>

          <div className="mt-2 flex items-baseline justify-center">
            {isFree ? (
              <div className="space-y-1">
                <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                  FREE
                </span>
                <p className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/30">
                  ₹0 Per Listing
                </p>
              </div>
            ) : (
              <div>
                <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  ₹{listingFee}
                </span>
                <span className="text-slate-400 text-xs font-semibold ml-1">/listing</span>
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-semibold mt-3 max-w-[200px] leading-relaxed">
            {isFree 
              ? "List your startup for sale absolutely free of charge! Offer valid for a limited period." 
              : "Pay securely with Razorpay checkout only when submitting your startup listing."}
          </p>

          <hr className="w-full my-6 border-slate-100" />

          {/* Feature List inside Card */}
          <ul className="w-full space-y-3.5 text-left mb-8 shrink-0">
            <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
              <span>Unlimited active offers & bids</span>
            </li>
            <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
              <span>Full metrics dashboard</span>
            </li>
            <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
              <span>Verified startup badge priority</span>
            </li>
            <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
              <span>Premium customer chat room</span>
            </li>
          </ul>

          <button
            onClick={handleCreateListing}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs transition-all shadow-md hover:shadow-lg active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white fill-white" />
            {isFree ? "List Your Startup Free" : "List Your Startup Now"}
          </button>
        </div>
      </div>

      {/* Trust & Guarantee Section */}
      <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200/50 pt-10 select-none">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3.5 border border-blue-100/50">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-xs mb-1">Instant Activation</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">Your listing goes live instantly in front of active buyers after admin verification.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3.5 border border-emerald-100/50">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-xs mb-1">Secure Escrows</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">Complete peace of mind. We use industry-standard security and trusted escrows for deal closure.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3.5 border border-rose-100/50">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-xs mb-1">Satisfaction First</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">If your startup doesn&apos;t meet guidelines and is rejected, we immediately issue a 100% refund.</p>
        </div>
      </div>
    </div>
  );
}
