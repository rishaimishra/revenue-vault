"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQ = params.get("q") || "";

    if (debouncedValue !== currentQ) {
      if (debouncedValue) {
        params.set("q", debouncedValue);
      } else {
        params.delete("q");
      }
      router.push(`/marketplace?${params.toString()}`);
    }
  }, [debouncedValue, router, searchParams]);

  // Sync input value with URL search param 'q' (e.g. when cleared or changed externally)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(q);
  }, [searchParams]);

  return (
    <div className="relative w-full max-w-2xl group">
      {/* Glow shadow backdrop wrapper */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-focus-within:opacity-100 group-hover:opacity-30 blur-xl transition duration-500 -z-10" />
      
      <div className="relative flex items-center w-full bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-1.5 shadow-premium transition-all duration-300 group-hover:border-indigo-200/80 focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/5">
        <div className="pl-4 pr-2 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-indigo-500/70 group-focus-within:text-indigo-600 transition-colors duration-300" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full bg-transparent border-0 outline-none text-slate-800 text-sm placeholder:text-slate-400/80 focus:ring-0 py-2.5 leading-relaxed"
          placeholder="Search by startup name, description, or tech stack..."
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 active:scale-95 transition-all duration-200 mr-1.5"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        )}
      </div>
    </div>
  );
};
