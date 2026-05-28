"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface AdminListingActionsProps {
  listingId: string;
  status: string;
}

export const AdminListingActions = ({ listingId, status }: AdminListingActionsProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (status: "PUBLISHED" | "REJECTED") => {
    let rejectionReason = null;
    if (status === "REJECTED") {
      rejectionReason = window.prompt("Enter rejection reason:");
      if (rejectionReason === null) return;
    }

    setIsLoading(status);
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason }),
      });

      if (!response.ok) throw new Error("Failed to update listing");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error updating listing status");
    } finally {
      setIsLoading(null);
    }
  };

  if (status === "PUBLISHED") {
    return (
      <div className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 flex items-center gap-1 select-none">
        <Check className="w-3.5 h-3.5" /> Approved
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200 flex items-center gap-1 select-none">
        <X className="w-3.5 h-3.5" /> Rejected
      </div>
    );
  }

  if (status === "SOLD") {
    return (
      <div className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 select-none">
        Sold
      </div>
    );
  }

  if (status === "DRAFT") {
    return (
      <div className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1 select-none">
        Draft
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("REJECTED")}
        disabled={isLoading !== null}
        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
      >
        {isLoading === "REJECTED" ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
        Reject
      </button>
      <button
        onClick={() => handleAction("PUBLISHED")}
        disabled={isLoading !== null}
        className="px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
      >
        {isLoading === "PUBLISHED" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
        Approve
      </button>
    </div>
  );
};
