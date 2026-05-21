"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, ListingInput } from "@/lib/validations";
import { Loader2, ArrowLeft, ArrowRight, Building2, FileText, DollarSign, Users, ExternalLink, ShieldCheck } from "lucide-react";

const steps = [
  { id: 1, name: "Basic Info", description: "Startup name and overview", icon: Building2 },
  { id: 2, name: "Business Details", description: "What makes your startup unique", icon: FileText },
  { id: 3, name: "Financials", description: "Revenue, profit, and asking price", icon: DollarSign },
  { id: 4, name: "Assets & Traction", description: "Customers, traffic, and included assets", icon: Users },
  { id: 5, name: "Review", description: "Verify and submit your listing", icon: ShieldCheck },
];

interface FormStepProps {
  step: typeof steps[number];
  currentStep: number;
}

function FormStepIndicator({ step, currentStep }: FormStepProps) {
  const isActive = currentStep === step.id;
  const isCompleted = currentStep > step.id;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isActive
            ? "bg-blue-600 text-white ring-4 ring-blue-100"
            : isCompleted
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        <step.icon className="w-5 h-5" />
      </div>
      <span
        className={`mt-2 text-xs font-medium ${
          isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
        }`}
      >
        {step.name}
      </span>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

function Input({ className = "", error, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
        error ? "border-red-300" : "border-gray-200"
      } ${className}`}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

function TextArea({ className = "", error, ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
        error ? "border-red-300" : "border-gray-200"
      } ${className}`}
      {...props}
    />
  );
}

export default function NewListingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      tagline: "",
      country: "",
      foundedYear: undefined,
      description: "",
      businessModel: "",
      usp: "",
      reasonForSelling: "",
      revenue: undefined as unknown as number,
      profit: undefined,
      price: undefined as unknown as number,
      website: "",
      customerCount: undefined,
      traffic: "",
      assetsIncluded: "",
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await trigger(fieldsToValidate as (keyof ListingInput)[]);
    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getFieldsForStep = (currentStep: number): (keyof ListingInput)[] => {
    switch (currentStep) {
      case 1:
        return ["title", "category"];
      case 2:
        return ["description"];
      case 3:
        return ["revenue", "price"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ListingInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/dashboard/seller?tab=listings");
      } else {
        alert("Failed to create listing. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLastStep = step === steps.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">List Your Startup</h1>
            <p className="mt-2 text-gray-600">
              {steps.find((s) => s.id === step)?.description}
            </p>
          </div>

          <div className="flex items-center justify-between mb-10 px-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <FormStepIndicator step={s} currentStep={step} />
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all ${
                      step > s.id ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5">
                <FormField
                  label="Startup Name"
                  required
                  error={errors.title?.message}
                >
                  <Input
                    {...register("title")}
                    placeholder="e.g. Stripe, Notion, Figma"
                    error={!!errors.title}
                  />
                </FormField>

                <FormField label="Category" required error={errors.category?.message}>
                  <Input
                    {...register("category")}
                    placeholder="e.g. SaaS, E-commerce, Marketplace"
                    error={!!errors.category}
                  />
                </FormField>

                <FormField label="Tagline" error={errors.tagline?.message}>
                  <Input
                    {...register("tagline")}
                    placeholder="One-liner that captures your value proposition"
                    error={!!errors.tagline}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Country" error={errors.country?.message}>
                    <Input
                      {...register("country")}
                      placeholder="e.g. United States"
                      error={!!errors.country}
                    />
                  </FormField>

                  <FormField label="Founded Year" error={errors.foundedYear?.message}>
                    <Input
                      {...register("foundedYear", { valueAsNumber: true })}
                      type="number"
                      placeholder="e.g. 2020"
                      min="1900"
                      max={new Date().getFullYear()}
                      error={!!errors.foundedYear}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <FormField
                  label="Description"
                  required
                  error={errors.description?.message}
                >
                  <TextArea
                    {...register("description")}
                    placeholder="Detailed description of your startup, its mission, and what it does..."
                    rows={4}
                    error={!!errors.description}
                  />
                </FormField>

                <FormField label="Business Model" error={errors.businessModel?.message}>
                  <TextArea
                    {...register("businessModel")}
                    placeholder="How does your startup make money? (e.g., Subscription, Transaction fees, Advertising)"
                    rows={2}
                    error={!!errors.businessModel}
                  />
                </FormField>

                <FormField
                  label="Unique Selling Proposition"
                  error={errors.usp?.message}
                >
                  <TextArea
                    {...register("usp")}
                    placeholder="What makes your startup unique? What competitive advantages do you have?"
                    rows={2}
                    error={!!errors.usp}
                  />
                </FormField>

                <FormField
                  label="Reason for Selling"
                  error={errors.reasonForSelling?.message}
                >
                  <TextArea
                    {...register("reasonForSelling")}
                    placeholder="Why are you selling? This helps buyers understand the opportunity."
                    rows={2}
                    error={!!errors.reasonForSelling}
                  />
                </FormField>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <FormField label="Annual Revenue" required error={errors.revenue?.message}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      {...register("revenue", { valueAsNumber: true })}
                      type="number"
                      placeholder="Enter annual revenue"
                      className="pl-8"
                      min="0"
                      error={!!errors.revenue}
                    />
                  </div>
                </FormField>

                <FormField label="Annual Profit" error={errors.profit?.message}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      {...register("profit", { valueAsNumber: true })}
                      type="number"
                      placeholder="Enter annual profit"
                      className="pl-8"
                      min="0"
                      error={!!errors.profit}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Asking Price"
                  required
                  error={errors.price?.message}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      placeholder="Enter asking price"
                      className="pl-8"
                      min="0"
                      error={!!errors.price}
                    />
                  </div>
                </FormField>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <FormField label="Website URL" error={errors.website?.message}>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("website")}
                      placeholder="https://yourstartup.com"
                      className="pl-11"
                      error={!!errors.website}
                    />
                  </div>
                </FormField>

                <FormField label="Customer Count" error={errors.customerCount?.message}>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("customerCount", { valueAsNumber: true })}
                      type="number"
                      placeholder="e.g. 1200"
                      className="pl-11"
                      min="0"
                      error={!!errors.customerCount}
                    />
                  </div>
                </FormField>

                <FormField label="Traffic / Monthly Visits" error={errors.traffic?.message}>
                  <Input
                    {...register("traffic")}
                    placeholder="e.g. 50,000 monthly visits"
                    error={!!errors.traffic}
                  />
                </FormField>

                <FormField
                  label="Assets Included"
                  error={errors.assetsIncluded?.message}
                >
                  <TextArea
                    {...register("assetsIncluded")}
                    placeholder="List key assets: domain names, social media accounts, software licenses, inventory, etc."
                    rows={3}
                    error={!!errors.assetsIncluded}
                  />
                </FormField>
              </div>
            )}

            {step === 5 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Submit?
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your listing will be reviewed by our team. We verify all financial data
                    and business details to ensure quality listings for buyers.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <strong>What happens next:</strong> Our team will review your submission
                    within 24-48 hours. You&apos;ll receive an email notification once approved.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Listing"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}