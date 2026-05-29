"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function NewTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      subject: formData.get("subject"),
      priority: formData.get("priority"),
      initialMessage: formData.get("initialMessage"),
    };

    try {
      const res = await fetch("/api/user/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to create ticket");
      }

      const newTicket = await res.json();
      router.push(`/dashboard/support/${newTicket.id}`);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/dashboard/support" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Support
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-8 border-b border-gray-200 bg-gray-50">
          <h1 className="text-2xl font-extrabold text-gray-900">Create Support Ticket</h1>
          <p className="text-gray-600 mt-1">Please provide details about your issue and we&apos;ll get back to you soon.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder="Brief summary of your issue"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-bold text-gray-700 mb-1">
              Priority Level
            </label>
            <select
              id="priority"
              name="priority"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              defaultValue="MEDIUM"
            >
              <option value="LOW">Low - General inquiry or minor issue</option>
              <option value="MEDIUM">Medium - Normal issue, work can continue</option>
              <option value="HIGH">High - Critical issue, unable to proceed</option>
            </select>
          </div>

          <div>
            <label htmlFor="initialMessage" className="block text-sm font-bold text-gray-700 mb-1">
              Message Details
            </label>
            <textarea
              id="initialMessage"
              name="initialMessage"
              required
              rows={6}
              placeholder="Please describe your issue in detail..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
