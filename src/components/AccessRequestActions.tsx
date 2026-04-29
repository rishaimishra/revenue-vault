"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface AccessRequestActionsProps {
  requestId: string;
}

export const AccessRequestActions = ({ requestId }: AccessRequestActionsProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (action: "APPROVED" | "REJECTED") => {
    setIsLoading(action);
    try {
      const response = await fetch(`/api/access-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        throw new Error("Failed to update access request");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction("REJECTED")}
        disabled={isLoading !== null}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Reject"
      >
        {isLoading === "REJECTED" ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
      </button>
      <button
        onClick={() => handleAction("APPROVED")}
        disabled={isLoading !== null}
        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
        title="Approve"
      >
        {isLoading === "APPROVED" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
      </button>
    </div>
  );
};
