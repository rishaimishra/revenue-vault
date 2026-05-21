"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, ListingInput } from "@/lib/validations";
import { Loader2, ArrowLeft } from "lucide-react";

const steps = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Business Details" },
  { id: 3, name: "Financials" },
  { id: 4, name: "Assets & Traction" },
];

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          reset({
            ...data,
            foundedYear: data.foundedYear || undefined,
            profit: data.profit || undefined,
          });
        }
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchListing();
  }, [id, reset]);

  const onSubmit = async (data: ListingInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/listings/${id}`);
      } else {
        alert("Failed to update listing");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
            <p className="mt-2 text-gray-600">{steps.find((s) => s.id === step)?.name}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name *</label>
                  <input {...register("title")} className="w-full px-4 py-2.5 border rounded-xl" />
                  {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input {...register("category")} className="w-full px-4 py-2.5 border rounded-xl" />
                  {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input {...register("tagline")} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input {...register("country")} className="w-full px-4 py-2.5 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                    <input {...register("foundedYear", { valueAsNumber: true })} type="number" className="w-full px-4 py-2.5 border rounded-xl" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea {...register("description")} rows={4} className="w-full px-4 py-2.5 border rounded-xl" />
                  {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
                  <textarea {...register("businessModel")} rows={2} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">USP</label>
                  <textarea {...register("usp")} rows={2} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Selling</label>
                  <textarea {...register("reasonForSelling")} rows={2} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue ($) *</label>
                  <input {...register("revenue", { valueAsNumber: true })} type="number" placeholder="Enter annual revenue" className="w-full px-4 py-2.5 border rounded-xl" />
                  {errors.revenue && <p className="text-sm text-red-600">{errors.revenue.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Profit ($)</label>
                  <input {...register("profit", { valueAsNumber: true })} type="number" placeholder="Enter annual profit (optional)" className="w-full px-4 py-2.5 border rounded-xl" />
                  {errors.profit && <p className="text-sm text-red-600">{errors.profit.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asking Price ($) *</label>
                  <input {...register("price", { valueAsNumber: true })} type="number" placeholder="Enter asking price" className="w-full px-4 py-2.5 border rounded-xl" />
                  {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input {...register("website")} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Count</label>
                  <input {...register("customerCount", { valueAsNumber: true })} type="number" className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Traffic</label>
                  <input {...register("traffic")} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assets Included</label>
                  <textarea {...register("assetsIncluded")} rows={3} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-50"
              >
                Back
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}