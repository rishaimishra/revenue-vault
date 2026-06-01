"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, Save, Loader2, Info, Coins, 
  Sparkles, AlertCircle, ToggleLeft, ToggleRight, CheckCircle2,
  TrendingUp, CreditCard, Layers, ShieldCheck
} from "lucide-react";
import { PaymentsTable } from "./PaymentsTable";

interface PaymentsDashboardClientProps {
  initialPayments: any[];
}

export const PaymentsDashboardClient = ({ initialPayments }: PaymentsDashboardClientProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(500);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          setIsEnabled(data.listing_charge_enabled);
          setAmount(data.listing_charge_amount);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    if (amount <= 0) {
      setMessage({ type: "error", text: "Per-listing fee must be a positive number." });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_charge_enabled: isEnabled,
          listing_charge_amount: amount,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Listing charge configurations saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update settings. Please try again." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  // Stats calculation
  const totalRevenue = initialPayments
    .filter(p => p.status === "success")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const listingFeeRevenue = initialPayments
    .filter(p => p.status === "success" && p.type === "listing_fee")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-10 relative">
      {/* Decorative top ambient light */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Row 1: Split Settings and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (Monetization Config Box): 60% Width */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-[2rem] border border-slate-200/50 shadow-premium p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-indigo-600" />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100/50 shadow-sm shrink-0">
                  <Coins className="w-5.5 h-5.5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Monetization Configuration</h3>
                  <p className="text-slate-400 text-xs font-semibold">Control per-listing charges for startup sellers.</p>
                </div>
              </div>

              {/* Status Toggle Switch */}
              {!isSettingsLoading && (
                <button
                  type="button"
                  onClick={() => setIsEnabled(!isEnabled)}
                  className="focus:outline-none transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  {isEnabled ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <span>Monetized</span>
                      <ToggleRight className="w-5.5 h-5.5 stroke-[2]" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                      <span>Free Offer</span>
                      <ToggleLeft className="w-5.5 h-5.5 stroke-[2]" />
                    </div>
                  )}
                </button>
              )}
            </div>

            {isSettingsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-5">
                {message && (
                  <div className={`p-4.5 rounded-2xl border flex items-center gap-3 animate-fade-in ${
                    message.type === "success" 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                      : "bg-rose-50 border-rose-100 text-rose-800"
                  }`}>
                    {message.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold">{message.text}</span>
                  </div>
                )}

                <div className={`space-y-4 transition-all duration-300 ${isEnabled ? "opacity-100 scale-100" : "opacity-40 pointer-events-none scale-[0.98]"}`}>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Listing Fee Amount (INR)
                    </label>
                    <div className="relative max-w-[200px]">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
                        disabled={!isEnabled}
                        placeholder="e.g. 500"
                        className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-800 text-sm"
                        min="1"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2 leading-relaxed">
                      Sellers must complete this pay-per-listing fee via Razorpay test mode checkouts prior to submitting application for moderation.
                    </p>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-800">
                    <Info className="w-4.5 h-4.5 shrink-0 text-amber-600" />
                    <div className="text-[11px] font-semibold leading-relaxed">
                      <strong>Dynamic Razorpay:</strong> Currently synchronized with live SDK configurations using credential Key IDs from system environment setups.
                    </div>
                  </div>
                </div>

                {!isEnabled && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4.5 flex gap-3 text-indigo-800 animate-pulse">
                    <Sparkles className="w-4.5 h-4.5 shrink-0 text-indigo-600" />
                    <div className="text-[11px] font-semibold leading-relaxed">
                      Platform listing is currently <strong>100% Free</strong>. Startup creators bypass payment dialogs entirely and list dynamically.
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Configurations
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side (Statistics Box): 40% Width */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* gross platform revenue */}
          <div className="bg-white/70 backdrop-blur-md p-6.5 rounded-3xl border border-slate-200/50 shadow-premium hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
                <DollarSign className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> volume audited
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Revenue</p>
            <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight mt-1">
              ${totalRevenue.toLocaleString()}
            </h3>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>All dynamic listing fees collected</span>
            </div>
          </div>

          {/* specific listing fees revenue */}
          <div className="bg-white/70 backdrop-blur-md p-6.5 rounded-3xl border border-slate-200/50 shadow-premium hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100/50">
                <CreditCard className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Listing Monetization
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pay-Per-Listing Income</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              ${listingFeeRevenue.toLocaleString()}
            </h3>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Direct dynamic system payouts</span>
            </div>
          </div>

        </div>

      </div>

      {/* Row 2: Payments Ledger Table */}
      <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/50 shadow-premium">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" /> Platform Payments Ledger
            </h2>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              Audit all dynamic Razorpay transaction details, amounts, types, and payer identifications.
            </p>
          </div>
        </div>

        <PaymentsTable payments={initialPayments} />
      </div>

    </div>
  );
};
