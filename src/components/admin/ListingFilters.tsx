"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const ListingFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/admin/listings?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Search listings..."
        className="px-4 py-2 border rounded-lg"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && updateFilters("q", q)}
      />
      <select className="px-4 py-2 border rounded-lg" onChange={(e) => updateFilters("status", e.target.value)}>
        <option value="PENDING_APPROVAL">Pending</option>
        <option value="PUBLISHED">Published</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>
  );
};
