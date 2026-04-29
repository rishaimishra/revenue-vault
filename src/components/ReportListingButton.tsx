"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface ReportListingButtonProps {
  listingId: string;
}

export const ReportListingButton = ({ listingId }: ReportListingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason }),
      });

      if (response.ok) {
        alert("Thank you. This listing has been reported and will be reviewed by our team.");
        setIsOpen(false);
        setReason("");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <AlertCircle className="w-3 h-3" /> Report this listing
        </button>
      ) : (
        <form onSubmit={handleReport} className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
          <label className="block text-xs font-bold text-red-800 uppercase tracking-wider">
            Reason for reporting
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Inaccurate revenue, suspicious activity..."
            className="w-full p-3 text-xs border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
