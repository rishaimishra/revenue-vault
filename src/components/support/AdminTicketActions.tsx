"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminTicketActions({ ticketId, currentStatus }: { ticketId: string, currentStatus: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4 md:mt-0">
      {currentStatus !== "RESOLVED" && (
        <button
          onClick={() => handleStatusChange("RESOLVED")}
          disabled={isUpdating}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" /> Mark Resolved
        </button>
      )}
      {currentStatus !== "CLOSED" && (
        <button
          onClick={() => handleStatusChange("CLOSED")}
          disabled={isUpdating}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" /> Close Ticket
        </button>
      )}
      {(currentStatus === "RESOLVED" || currentStatus === "CLOSED") && (
        <button
          onClick={() => handleStatusChange("OPEN")}
          disabled={isUpdating}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          Reopen Ticket
        </button>
      )}
    </div>
  );
}
