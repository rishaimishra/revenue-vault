"use client";

import { useState, useEffect } from "react";
import { 
  Settings, DollarSign, Save, Loader2, Info, 
  Coins, Sparkles, AlertCircle, ToggleLeft, ToggleRight, CheckCircle2
} from "lucide-react";

export default function AdminSettingsPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(500);
  const [isPageLoading, setIsPageLoading] = useState(true);
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
        setIsPageLoading(false);
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
        setMessage({ type: "success", text: "System settings updated successfully!" });
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

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="relative space-y-8 max-w-4xl">
      {/* Decorative top ambient light */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      {/* Banner / Header */}
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200/50 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50 shadow-sm">
            <Settings className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Platform Configurations</h1>
            <p className="text-slate-400 text-xs font-semibold">Configure payment options, listing fees, and global platform defaults.</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-rose-50 border-rose-100 text-rose-800"
        }`}>
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-bold">{message.text}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Listing Charges Box */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/50 shadow-premium p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/50">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Startup Listing Monetization</h3>
                <p className="text-slate-400 text-xs font-medium">Control dynamic per-listing fees for startup founders.</p>
              </div>
            </div>
            
            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
            >
              {isEnabled ? (
                <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <span>Charge Enabled</span>
                  <ToggleRight className="w-6 h-6 stroke-[2]" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                  <span>Free Listings (Offer)</span>
                  <ToggleLeft className="w-6 h-6 stroke-[2]" />
                </div>
              )}
            </button>
          </div>

          {/* Pricing input section */}
          <div className={`space-y-4 transition-all duration-300 ${isEnabled ? "opacity-100 scale-100" : "opacity-40 pointer-events-none scale-[0.98]"}`}>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                Per-Listing Charge (INR)
              </label>
              <div className="relative max-w-xs">
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
              <p className="text-[10px] text-slate-400 font-medium mt-2 leading-relaxed max-w-md">
                The fee configured above is dynamic. When active, startup listing creators must pay this amount via Razorpay before their application is sent for approval.
              </p>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4.5 flex gap-3 text-amber-800">
              <Info className="w-5 h-5 shrink-0 text-amber-600" />
              <div className="text-xs font-medium leading-relaxed">
                <strong>Razorpay Note:</strong> If enabled, this fee will be collected securely during listing creation using test-mode credentials (`rzp_test_SvBByShi1DfYvo`).
              </div>
            </div>
          </div>

          {!isEnabled && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4.5 flex gap-3 text-indigo-800 animate-pulse">
              <Sparkles className="w-5 h-5 shrink-0 text-indigo-600" />
              <div className="text-xs font-semibold leading-relaxed">
                All startup listings are currently configured to be <strong>100% Free</strong>. Users will not see the checkout modal and can submit their listings instantly!
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs transition-all shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving settings...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configurations
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
