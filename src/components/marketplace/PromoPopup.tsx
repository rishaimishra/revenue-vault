"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Clock, Copy, Check, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Offer {
  id: string;
  tagline: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  bgGradient: string;
}

const OFFERS: Offer[] = [
  {
    id: "verification",
    tagline: "EXCLUSIVELY FOR FOUNDERS",
    title: "Fast-Track Your Business Verification!",
    description: "Get your business listing verified by our audit team with a priority queue check. Attract 5x more active buyers.",
    code: "VERIFY20",
    discount: "20% OFF VERIFICATION",
    ctaText: "Claim Priority Verification",
    ctaLink: "/pricing",
    badge: "Limited Slots Left",
    bgGradient: "from-blue-600 via-blue-500 to-indigo-500" // Maps to Orange-Gold gradient
  },
  {
    id: "premium",
    tagline: "PREMIUM DEAL FLOW ACCESS",
    title: "Unlock Hidden Startup Listings Today",
    description: "Get early access to private startup deals, off-market SaaS listings, and direct seller contact before anyone else.",
    code: "DEAL30",
    discount: "30% OFF PREMIUM ACCESS",
    ctaText: "Upgrade to Premium",
    ctaLink: "/pricing",
    badge: "Flash Deal",
    bgGradient: "from-indigo-500 via-violet-500 to-purple-600" // Maps to Gold-Rose gradient
  },
  {
    id: "valuation",
    tagline: "FOR STARTUP FOUNDERS",
    title: "Get a Professional Valuation Review",
    description: "Thinking of selling your startup? Get a comprehensive, expert-backed valuation report to maximize your exit price.",
    code: "VALUATE100",
    discount: "FREE EXIT VALUATION ($499 Value)",
    ctaText: "Get Free Valuation",
    ctaLink: "/onboarding",
    badge: "Limited Offer",
    bgGradient: "from-violet-500 via-purple-500 to-blue-600" // Maps to Rose-Orange gradient
  }
];

export const PromoPopup = () => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showVisuals, setShowVisuals] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 14m 59s
  const originalOverflowRef = useRef<string>("");

  // Initialize random offer & check sessionStorage
  useEffect(() => {
    const isDismissed = sessionStorage.getItem("promo_popup_dismissed") === "true";
    if (isDismissed) return;

    // Pick random offer on the client to avoid Next.js hydration mismatches
    const randomIdx = Math.floor(Math.random() * OFFERS.length);
    setSelectedOffer(OFFERS[randomIdx]);

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

  // Countdown timer effect
  useEffect(() => {
    if (!showVisuals || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [showVisuals, timeLeft]);

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

  const handleCopy = async () => {
    if (!selectedOffer) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(selectedOffer.code);
      } else {
        // Fallback for non-supported browsers or non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = selectedOffer.code;
        textarea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fail-safe feedback fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isMounted || !selectedOffer) return null;

  // Format time (MM:SS)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

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
          <div className={`p-6 text-white bg-gradient-to-r ${selectedOffer.bgGradient} relative overflow-hidden`}>
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none"></div>
            
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-white animate-pulse" /> {selectedOffer.badge}
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
                {selectedOffer.tagline}
              </p>
              <h3 className="text-2xl font-black tracking-tight leading-tight">
                {selectedOffer.discount}
              </h3>
            </div>
          </div>

          {/* Modal body */}
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                {selectedOffer.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {selectedOffer.description}
              </p>
            </div>

            {/* Promo code box */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Copy Promo Code</p>
                <p className="text-base font-black text-slate-800 tracking-wider font-mono mt-0.5">{selectedOffer.code}</p>
              </div>
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                  isCopied 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
                id="promo-popup-copy-btn"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-bounce" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center justify-center gap-2 py-1 text-center bg-rose-50/50 rounded-2xl border border-rose-100/30">
              <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="text-xs text-rose-600 font-bold tracking-wide">
                Offer expires in: <span className="font-extrabold font-mono text-sm" id="promo-popup-timer">{formattedTime}</span>
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={selectedOffer.ctaLink}
                onClick={handleClose}
                className={`w-full bg-gradient-to-r ${selectedOffer.bgGradient} text-white py-4 rounded-2xl font-black text-sm hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer border border-white/10`}
                id="promo-popup-cta-btn"
              >
                {selectedOffer.ctaText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
