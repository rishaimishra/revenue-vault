"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw, ArrowUpDown, DollarSign, TrendingUp, BarChart2, ShieldCheck, Check } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
}

export const FilterSidebar = ({ categories }: FilterSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state initialized from URL params
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRevenue, setMinRevenue] = useState(searchParams.get("minRevenue") || "");
  const [maxRevenue, setMaxRevenue] = useState(searchParams.get("maxRevenue") || "");
  const [minProfit, setMinProfit] = useState(searchParams.get("minProfit") || "");
  const [maxProfit, setMaxProfit] = useState(searchParams.get("maxProfit") || "");
  
  const selectedCategory = searchParams.get("category") || "";
  const selectedSort = searchParams.get("sortBy") || "newest";
  const verifiedOnly = searchParams.get("verified") === "true";

  // Mobile sidebar visibility
  const [isOpen, setIsOpen] = useState(false);

  // Sync state with URL params changes (e.g., when clicking reset or categories pill outside)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMinRevenue(searchParams.get("minRevenue") || "");
    setMaxRevenue(searchParams.get("maxRevenue") || "");
    setMinProfit(searchParams.get("minProfit") || "");
    setMaxProfit(searchParams.get("maxProfit") || "");
  }, [searchParams]);

  // Handle immediate URL update for specific quick actions (sorting, verified, category)
  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/marketplace?${params.toString()}`);
  };

  // Apply range filters
  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    const ranges = { minPrice, maxPrice, minRevenue, maxRevenue, minProfit, maxProfit };
    Object.entries(ranges).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    router.push(`/marketplace?${params.toString()}`);
    setIsOpen(false); // Close mobile drawer if open
  };

  // Reset all filters (except search term 'q')
  const handleResetAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) {
      params.set("q", q);
    }
    
    // Clear states locally
    setMinPrice("");
    setMaxPrice("");
    setMinRevenue("");
    setMaxRevenue("");
    setMinProfit("");
    setMaxProfit("");

    router.push(`/marketplace?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="w-full lg:w-80 shrink-0">
      {/* Mobile Sticky Filter & Sort bar */}
      <div className="flex lg:hidden items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl text-xs font-extrabold hover:bg-indigo-100/80 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Categories
        </button>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSort}
            onChange={(e) => updateUrlParam("sortBy", e.target.value)}
            className="bg-transparent border-0 outline-none text-slate-700 text-xs font-bold pr-8 py-1.5 focus:ring-0 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="revenue_desc">Revenue: High to Low</option>
            <option value="profit_desc">Profit: High to Low</option>
          </select>
        </div>
      </div>

      {/* Sidebar Content Panel - Desktop and Mobile Drawer wrapper */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:relative lg:bg-transparent lg:backdrop-blur-none lg:z-0 lg:block ${
          isOpen ? "block animate-fade-in" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed bottom-0 right-0 top-0 w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto lg:relative lg:shadow-premium lg:w-full lg:max-w-none lg:rounded-[2rem] lg:border lg:border-slate-100 lg:p-6 lg:flex transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-slate-800 text-base font-extrabold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              Advanced Filters
            </h3>
            <button
              onClick={handleResetAll}
              className="text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 text-xs font-bold transition-colors duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-6 flex-1">
            {/* Category Select vertical layout */}
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-3">
                Industry / Category
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => updateUrlParam("category", null)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-extrabold transition-all duration-200 ${
                    !selectedCategory
                      ? "bg-indigo-50/70 text-indigo-600 border border-indigo-100/50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                  }`}
                >
                  <span>All Categories</span>
                  {!selectedCategory && <Check className="w-3.5 h-3.5" />}
                </button>
                {categories.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateUrlParam("category", cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-extrabold transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-50/70 text-indigo-600 border border-indigo-100/50"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                      }`}
                    >
                      <span>{cat}</span>
                      {isActive && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Sorting Dropdown inside sidebar */}
            <div className="hidden lg:block border-t border-slate-100 pt-5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-3">
                Sort Results By
              </span>
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => updateUrlParam("sortBy", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all duration-200 cursor-pointer appearance-none"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="revenue_desc">Revenue: High to Low</option>
                  <option value="profit_desc">Profit: High to Low</option>
                </select>
                <div className="absolute right-3.5 top-3 pointer-events-none text-slate-400">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Asking Price Filter Range */}
            <div className="border-t border-slate-100 pt-5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                Asking Price ($)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-6 pr-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-6 pr-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* TTM Annual Revenue Filter Range */}
            <div className="border-t border-slate-100 pt-5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                TTM Revenue ($)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={minRevenue}
                    onChange={(e) => setMinRevenue(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-6 pr-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={maxRevenue}
                    onChange={(e) => setMaxRevenue(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-6 pr-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Net Profit Filter Range */}
            <div className="border-t border-slate-100 pt-5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Net Profit ($)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={minProfit}
                    onChange={(e) => setMinProfit(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-6 pr-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={maxProfit}
                    onChange={(e) => setMaxProfit(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-6 pr-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Seller Verification Toggle */}
            <div className="border-t border-slate-100 pt-5 pb-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Verified Sellers Only
                </span>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => updateUrlParam("verified", e.target.checked ? "true" : null)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600" />
                </div>
              </label>
            </div>

            {/* Apply filters Button */}
            <div className="border-t border-slate-100 pt-5">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-2xl text-xs font-black hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300"
              >
                Apply Range Filters
              </button>
            </div>
          </form>

          {/* Close drawer button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full border border-slate-200 text-slate-500 py-3 rounded-2xl text-xs font-bold lg:hidden hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
