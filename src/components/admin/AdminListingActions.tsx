"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface AdminListingActionsProps {
  listingId: string;
}

export const AdminListingActions = ({ listingId }: AdminListingActionsProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (status: "PUBLISHED" | "REJECTED") => {
    setIsLoading(status);
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
