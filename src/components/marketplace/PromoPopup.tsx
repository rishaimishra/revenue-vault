"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SpotlightItem {
  id: string;
  tagline: string;
  title: string;
  description: string;
  highlight: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  bgGradient: string;
  features: string[];
}

const SPOTLIGHTS: SpotlightItem[] = [
  {
    id: "sell-startup",
    tagline: "SELL YOUR STARTUP",
    title: "List Your Business Securely",
    highlight: "100% Free Standard Listings",
    description: "Reach thousands of vetted investors without exposing your brand's identity. Control who views your financial details and metrics.",
    ctaText: "List a Startup Now",
    ctaLink: "/listings/new",
    badge: "For Founders",
    bgGradient: "from-blue-600 via-indigo-600 to-violet-600",
    features: [
      "Zero upfront listing or setup fees",
      "Masked domain, brand name, and URL",
      "Secure, encrypted buyer-seller messaging"
    ]
  },
  {
    id: "verification",
    tagline: "BUILD TRUST INSTANTLY",
    title: "Fast-Track Your Verification",
    highlight: "Get the Verified Badge",
    description: "Get your business financials checked by our audit team. Verified startups build immediate trust and attract up to 5x more active buyers.",
    ctaText: "Complete Onboarding",
    ctaLink: "/onboarding",
    badge: "Priority Check",
    bgGradient: "from-teal-600 via-emerald-500 to-teal-500",
    features: [
      "Financial metrics audit & validation",
      "Verified trust badge on your listing",
      "Priority listing review in less than 24 hours"
    ]
  },
  {
    id: "buy-startup",
    tagline: "TRANSPARENT DEAL FLOW",
    title: "Discover Pre-Vetted SaaS Assets",
    highlight: "Verified Financial Data",
    description: "Analyze verified revenue, profit margins, and valuation multiples. Request access securely to start a direct negotiation with the founder.",
    ctaText: "Explore Marketplace",
    ctaLink: "/marketplace",
    badge: "For Buyers",
    bgGradient: "from-violet-600 via-purple-500 to-pink-600",
    features: [
      "Access detailed profit & loss statements",
      "Direct communication with vetted founders",
      "Anonymous deal flow and transaction tracking"
    ]
  }
];

export const PromoPopup = () => {
  const [selectedSpotlight, setSelectedSpotlight] = useState<SpotlightItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showVisuals, setShowVisuals] = useState(false);
  const originalOverflowRef = useRef<string>("");

  // Initialize random spotlight item & check sessionStorage
  useEffect(() => {
    const isDismissed = sessionStorage.getItem("promo_popup_dismissed") === "true";
    if (isDismissed) return;

    // Pick random spotlight on the client to avoid Next.js hydration mismatches
    const randomIdx = Math.floor(Math.random() * SPOTLIGHTS.length);
    setSelectedSpotlight(SPOTLIGHTS[randomIdx]);

    setIsMounted(true);

    // Fade in overlay and scale up card on the next render frame
    const timer = setTimeout(() => {
      setShowVisuals(true);
      
      // Lock scroll and save original scroll style
      if (typeof window !== "undefined" && document.body) {
        originalOverflowRef.current = window.getComputedStyle(document.body).overflow || "";
        document.body.style.overflow = "hidden";
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined" && document.body) {
        document.body.style.overflow = originalOverflowRef.current || "unset";
      }
    };
  }, []);

  // Clean up body overflow when modal closes
  const handleClose = () => {
    setShowVisuals(false);
    
    // Wait for transition to complete before unmounting from DOM
    setTimeout(() => {
      setIsMounted(false);
      if (typeof window !== "undefined" && document.body) {
        document.body.style.overflow = originalOverflowRef.current || "unset";
      }
      sessionStorage.setItem("promo_popup_dismissed", "true");
    }, 300);
  };

  if (!isMounted || !selectedSpotlight) return null;

  return (
    <>
      {/* Backdrop overlay (z-[99]) - Separated sibling to prevent child blur bug */}
      <div 
        className={`fixed inset-0 z-[99] bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 ${
          showVisuals ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        id="promo-popup-overlay"
      />
      
      {/* Modal dialog wrapper (z-[100]) */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
          showVisuals ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onClick={handleClose}
      >
        <div 
          className={`relative w-full max-w-lg overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-premium transform transition-all duration-300 ${
            showVisuals ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
          id="promo-popup-card"
        >
          {/* Banner with gradient background */}
          <div className={`p-6 text-white bg-gradient-to-r ${selectedSpotlight.bgGradient} relative overflow-hidden`}>
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none"></div>
            
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-white animate-pulse" /> {selectedSpotlight.badge}
              </span>
              <button 
                onClick={handleClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                aria-label="Close offer modal"
                id="promo-popup-close-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-100/90 leading-none">
                {selectedSpotlight.tagline}
              </p>
              <h3 className="text-2xl font-black tracking-tight leading-tight">
                {selectedSpotlight.highlight}
              </h3>
            </div>
          </div>

          {/* Modal body */}
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                {selectedSpotlight.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {selectedSpotlight.description}
              </p>
            </div>

            {/* Spotlight Features List */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {selectedSpotlight.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50 mt-0.5 animate-pulse">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={selectedSpotlight.ctaLink}
                onClick={handleClose}
                className={`w-full bg-gradient-to-r ${selectedSpotlight.bgGradient} text-white py-4 rounded-2xl font-black text-sm hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer border border-white/10`}
                id="promo-popup-cta-btn"
              >
                {selectedSpotlight.ctaText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button
                onClick={handleClose}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-2 cursor-pointer hover:underline"
                id="promo-popup-dismiss-btn"
              >
                No thanks, I want to explore standard listings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
