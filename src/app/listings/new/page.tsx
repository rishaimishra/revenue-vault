"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, ListingInput } from "@/lib/validations";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Business Details" },
  { id: 3, name: "Financials" },
  { id: 4, name: "Assets & Traction" },
  { id: 5, name: "Verification" },
];

export default function NewListingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ListingInput) => {
    setIsLoading(true);
    const res = await fetch("/api/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/dashboard/seller");
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">List Your Startup</h1>
        <div className="flex gap-2 mt-4">
          {steps.map((s) => (
            <div key={s.id} className={`flex-1 h-2 rounded ${step >= s.id ? "bg-blue-600" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <input {...register("title")} placeholder="Startup Name" className="w-full border p-2 rounded" />
            <input {...register("category")} placeholder="Category" className="w-full border p-2 rounded" />
            <input {...register("tagline")} placeholder="Tagline" className="w-full border p-2 rounded" />
            <input {...register("country")} placeholder="Country" className="w-full border p-2 rounded" />
            <input {...register("foundedYear")} type="number" placeholder="Founded Year" className="w-full border p-2 rounded" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <textarea {...register("description")} placeholder="Description" className="w-full border p-2 rounded" />
            <input {...register("businessModel")} placeholder="Business Model" className="w-full border p-2 rounded" />
            <textarea {...register("usp")} placeholder="USP" className="w-full border p-2 rounded" />
            <textarea {...register("reasonForSelling")} placeholder="Reason for Selling" className="w-full border p-2 rounded" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <input {...register("revenue")} type="number" placeholder="Annual Revenue ($)" className="w-full border p-2 rounded" />
            <input {...register("profit")} type="number" placeholder="Annual Profit ($)" className="w-full border p-2 rounded" />
            <input {...register("price")} type="number" placeholder="Asking Price ($)" className="w-full border p-2 rounded" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <input {...register("website")} placeholder="Website URL" className="w-full border p-2 rounded" />
            <input {...register("customerCount")} type="number" placeholder="Customer Count" className="w-full border p-2 rounded" />
            <input {...register("traffic")} placeholder="Traffic / Monthly Visits" className="w-full border p-2 rounded" />
            <textarea {...register("assetsIncluded")} placeholder="Assets Included" className="w-full border p-2 rounded" />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p>Ready to submit your startup for review?</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button type="button" disabled={step === 1} onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>
          {step < 5 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
          ) : (
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded">
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Submit"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
