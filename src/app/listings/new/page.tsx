"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, ListingInput } from "@/lib/validations";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function NewListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      revenue: 0,
      profit: 0,
      price: 0,
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/listings/new");
    } else if (status === "authenticated") {
      const user = session?.user as any;
      if (user.role !== "SELLER" && user.role !== "ADMIN") {
        setError("Only sellers can create listings. Please update your role in your profile.");
      }
    }
  }, [status, session, router]);

  const onSubmit = async (data: any) => {
    if ((session?.user as any).role !== "SELLER" && (session?.user as any).role !== "ADMIN") {
      setError("Only sellers can create listings.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({ message: "Failed to parse response" }));

      if (!response.ok) {
        throw new Error(result.message || "Failed to create listing");
      }

      setIsSuccess(true);
      reset();

      // Delay redirection to show success message
      setTimeout(() => {
        router.push("/dashboard/seller");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isNotSeller = status === "authenticated" &&
    (session?.user as any).role !== "SELLER" &&
    (session?.user as any).role !== "ADMIN";

  if (isNotSeller) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="bg-orange-50 border border-orange-200 p-8 rounded-2xl inline-block">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sellers Only</h1>
          <p className="text-gray-600 mb-6">
            You are currently registered as a Buyer. To list your startup, please switch your role to Seller in your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/profile")}
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Profile
            </button>
            <button
              onClick={() => router.push("/marketplace")}
              className="bg-gray-100 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = ["SaaS", "E-commerce", "Marketplace", "Agency", "Mobile App", "Content Site", "Other"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List Your Startup</h1>
        <p className="text-gray-600 mt-2">
          Provide key financial data and details. All listings are reviewed before going public.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-md text-sm font-medium flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-base">Listing submitted successfully!</span>
            </div>
            <p className="text-green-600 ml-7">
              Your startup is now pending approval. Redirecting to your dashboard...
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="title">
            Startup Name / Title
          </label>
          <input
            {...register("title")}
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. AI-powered Analytics SaaS"
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="category">
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="revenue">
              Annual Revenue ($)
            </label>
            <input
              {...register("revenue")}
              type="number"
              id="revenue"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0"
            />
            {errors.revenue && <p className="text-xs text-red-500">{errors.revenue.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="profit">
              Annual Profit ($)
            </label>
            <input
              {...register("profit")}
              type="number"
              id="profit"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0"
            />
            {errors.profit && <p className="text-xs text-red-500">{errors.profit.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="price">
              Asking Price ($)
            </label>
            <input
              {...register("price")}
              type="number"
              id="price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0"
            />
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Describe your startup, tech stack, customer base, and growth potential..."
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          Submit Listing for Approval
        </button>
      </form>
    </div>
  );
}
