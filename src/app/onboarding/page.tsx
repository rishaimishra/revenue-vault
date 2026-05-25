"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, Store, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [role, setRole] = useState<"BUYER" | "SELLER" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // @ts-ignore
      const role = session.user.role;
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "SELLER") {
        router.push("/dashboard/seller");
      } else if (role === "BUYER") {
        router.push("/marketplace");
      }
    }
  }, [session, status, router]);

  const handleComplete = async () => {
    if (!role) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        // Update client-side session token to include the new role
        await update({ role });
        
        router.push(role === "SELLER" ? "/dashboard/seller" : "/marketplace");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome to RevenueVault</h1>
          <p className="mt-3 text-lg text-gray-600 font-medium">How do you want to use the platform?</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-10">
          <button
            onClick={() => setRole("SELLER")}
            className={`relative p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 group ${
              role === "SELLER"
                ? "border-blue-600 bg-blue-50 ring-4 ring-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className={`p-3 rounded-xl ${role === "SELLER" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"}`}>
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className={`font-bold text-lg ${role === "SELLER" ? "text-blue-900" : "text-gray-900"}`}>I'm a Seller</p>
              <p className="text-sm text-gray-500 mt-1">List your startup, manage deals, and find the right buyer.</p>
            </div>
            {role === "SELLER" && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </button>

          <button
            onClick={() => setRole("BUYER")}
            className={`relative p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 group ${
              role === "BUYER"
                ? "border-blue-600 bg-blue-50 ring-4 ring-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className={`p-3 rounded-xl ${role === "BUYER" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"}`}>
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className={`font-bold text-lg ${role === "BUYER" ? "text-blue-900" : "text-gray-900"}`}>I'm a Buyer</p>
              <p className="text-sm text-gray-500 mt-1">Browse verified startups, request access, and close deals.</p>
            </div>
            {role === "BUYER" && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        </div>

        <button
          onClick={handleComplete}
          disabled={!role || isLoading}
          className="w-full mt-8 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Get Started"}
          {!isLoading && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
