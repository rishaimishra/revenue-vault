"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface RequestAccessButtonProps {
  listingId: string;
}

export const RequestAccessButton = ({ listingId }: RequestAccessButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/listings/${listingId}/access`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to request access");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRequest}
      disabled={isLoading}
      className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      Request Access
    </button>
  );
};
