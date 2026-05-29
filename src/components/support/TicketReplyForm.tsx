"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export default function TicketReplyForm({ ticketId, isClosed }: { ticketId: string, isClosed: boolean }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isClosed) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/user/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setContent("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isClosed) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
        This ticket is closed. You can no longer reply to it.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your reply here..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y min-h-[100px]"
          required
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? "Sending..." : <><Send className="w-4 h-4" /> Send Reply</>}
        </button>
      </div>
    </form>
  );
}
