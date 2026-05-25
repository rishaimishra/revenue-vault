"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { DealStatus } from "@prisma/client";

interface DealStatusManagerProps {
  dealId: string;
  currentStatus: DealStatus;
  isSeller: boolean;
}

export const DealStatusManager = ({ dealId, currentStatus, isSeller }: DealStatusManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const statuses: { label: string; value: DealStatus; description: string }[] = [
    { label: "Interested", value: "INTERESTED", description: "Initial interest shown" },
    { label: "Accepted", value: "ACCEPTED", description: "Seller has approved communication" },
    { label: "In Progress", value: "IN_PROGRESS", description: "Due diligence and negotiation" },
    { label: "Closed/Sold", value: "CLOSED", description: "Deal finalized" },
  ];

  const handleUpdateStatus = async (newStatus: DealStatus) => {
    if (!isSeller && newStatus !== "CLOSED") return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const currentIndex = statuses.findIndex(s => s.value === currentStatus);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {statuses.map((status, index) => {
          const isCompleted = index < currentIndex || currentStatus === "CLOSED";
          const isCurrent = index === currentIndex && currentStatus !== "CLOSED";
          const isFuture = index > currentIndex && currentStatus !== "CLOSED";

          return (
            <div
              key={status.value}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                isCurrent 
                  ? "border-blue-500 bg-blue-50/70 shadow-sm ring-2 ring-blue-100/50" 
                  : isCompleted 
                    ? "border-emerald-100 bg-emerald-50/40" 
                    : "border-slate-100 bg-slate-50/30 opacity-50 hover:opacity-75"
              }`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? "border-blue-600 text-blue-600 bg-white" : "border-slate-300 text-slate-400"
                  }`}>
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold tracking-tight ${
                  isCurrent ? "text-blue-900" : isCompleted ? "text-emerald-900" : "text-slate-500"
                }`}>
                  {status.label}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{status.description}</p>
              </div>
              {isSeller && isFuture && index === currentIndex + 1 && (
                <button
                  onClick={() => handleUpdateStatus(status.value)}
                  disabled={isLoading}
                  className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/10 flex items-center gap-1 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  Advance
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!isSeller && currentStatus === "IN_PROGRESS" && (
        <div className="p-4 bg-amber-50/70 border border-amber-100/80 rounded-xl flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 animate-ping flex-shrink-0"></span>
          <p className="text-xs text-amber-800 font-semibold leading-relaxed">
            Negotiations are currently in progress. The seller will mark the deal as closed once finalized.
          </p>
        </div>
      )}
    </div>
  );
};

