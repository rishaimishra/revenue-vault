"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const UserFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Search users..."
        className="px-4 py-2 border rounded-lg"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && updateFilters("q", q)}
      />
      <select className="px-4 py-2 border rounded-lg" onChange={(e) => updateFilters("role", e.target.value)}>
        <option value="">All Roles</option>
        <option value="ADMIN">Admin</option>
        <option value="BUYER">Buyer</option>
        <option value="SELLER">Seller</option>
      </select>
      <select className="px-4 py-2 border rounded-lg" onChange={(e) => updateFilters("sort", e.target.value)}>
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
};
