"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Zap, Rocket, Shield } from "lucide-react";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (tier: string, amount: number) => {
    setIsLoading(tier);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          type: "subscription",
          tier,
        }),
      });

      if (response.ok) {
        alert(`Successfully subscribed to ${tier} plan! (Simulated)`);
        router.push("/dashboard/seller");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      name: "Basic",
      price: 0,
      description: "For new startups testing the waters.",
      features: [
        "Up to 2 listings",
        "Standard visibility",
        "Public chat access",
        "Standard verification"
      ],
      buttonText: "Current Plan",
      tier: "FREE",
      highlight: false
    },
    {
      name: "Professional",
      price: 49,
      description: "Optimized for serious sellers and buyers.",
      features: [
        "Unlimited listings",
        "Featured placement",
        "Priority support",
        "Detailed analytics",
        "Verified badge priority"
      ],
      buttonText: "Upgrade to Pro",
      tier: "PRO",
      highlight: true
    },
    {
      name: "Enterprise",
      price: 199,
      description: "For institutional buyers and high-value deals.",
      features: [
        "White-glove deal management",
        "Private marketplace access",
        "Custom contracts",
        "Dedicated account manager",
        "Advanced due diligence tools"
      ],
      buttonText: "Contact Sales",
      tier: "ENTERPRISE",
      highlight: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">Invest in the right tools to close your next big startup deal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col p-8 rounded-3xl border transition-all ${
              plan.highlight
                ? "border-blue-600 shadow-xl ring-4 ring-blue-50 scale-105 z-10"
                : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3 fill-white" /> Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-500 min-h-[40px]">{plan.description}</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                <span className="ml-1 text-gray-500 font-medium">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                  <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.highlight ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => plan.price > 0 && handleSubscribe(plan.tier, plan.price)}
              disabled={isLoading !== null || plan.price === 0}
              className={`w-full py-4 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 ${
                plan.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              } ${plan.price === 0 ? "bg-gray-100 text-gray-400 cursor-default" : ""}`}
            >
              {isLoading === plan.tier && <Loader2 className="w-5 h-5 animate-spin" />}
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Rocket className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Instant Setup</h4>
          <p className="text-xs text-gray-500">Get access to premium features immediately after subscription.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Secure Payments</h4>
          <p className="text-xs text-gray-500">We use top-tier encryption and trusted providers for all transactions.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Priority Support</h4>
          <p className="text-xs text-gray-500">Pro and Enterprise members get direct access to our specialist team.</p>
        </div>
      </div>
    </div>
  );
}
