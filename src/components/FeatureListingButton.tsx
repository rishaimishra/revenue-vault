"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Loader2 } from "lucide-react";

interface FeatureListingButtonProps {
  listingId: string;
  isFeatured: boolean;
}

export const FeatureListingButton = ({ listingId, isFeatured }: FeatureListingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFeature = async () => {
    if (isFeatured) return;

    if (!confirm("Feature this listing for $29.00? (Simulated Payment)")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/listings/${listingId}/feature`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Payment successful! Your listing is now featured.");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Error processing payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFeature}
      disabled={isLoading || isFeatured}
      className={`text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1 transition-all ${
        isFeatured
          ? "bg-yellow-100 text-yellow-700 cursor-default"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Zap className={`w-3 h-3 ${isFeatured ? "fill-yellow-700" : ""}`} />
      )}
      {isFeatured ? "Featured" : "Feature Listing ($29)"}
    </button>
  );
};
