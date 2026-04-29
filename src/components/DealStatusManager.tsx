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
    if (!isSeller && newStatus !== "CLOSED") return; // Only seller can move it forward mostly

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
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isCurrent ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" :
                isCompleted ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50 opacity-60"
              }`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-400"
                  }`}>
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${isCurrent ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-500"}`}>
                  {status.label}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">{status.description}</p>
              </div>
              {isSeller && isFuture && index === currentIndex + 1 && (
                <button
                  onClick={() => handleUpdateStatus(status.value)}
                  disabled={isLoading}
                  className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:bg-blue-400"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                  Move to {status.label}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!isSeller && currentStatus === "IN_PROGRESS" && (
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
          <p className="text-xs text-orange-800 font-medium">
            Negotiations are in progress. The seller will mark the deal as closed once finalized.
          </p>
        </div>
      )}
    </div>
  );
};
