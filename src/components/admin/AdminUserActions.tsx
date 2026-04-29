"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldOff, Loader2, UserCog } from "lucide-react";
import { UserRole } from "@prisma/client";

interface AdminUserActionsProps {
  userId: string;
  isVerified: boolean;
  currentRole: UserRole;
}

export const AdminUserActions = ({ userId, isVerified, currentRole }: AdminUserActionsProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleToggleVerify = async () => {
    setIsLoading("verify");
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !isVerified }),
      });

      if (!response.ok) throw new Error("Failed to update user");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error updating verification status");
    } finally {
      setIsLoading(null);
    }
  };

  const handleChangeRole = async (newRole: UserRole) => {
    if (newRole === currentRole) return;

    setIsLoading("role");
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error updating role");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleVerify}
          disabled={isLoading !== null}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 flex-1 justify-center ${
            isVerified
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isLoading === "verify" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isVerified ? (
            <Shield className="w-3 h-3" />
          ) : (
            <ShieldOff className="w-3 h-3" />
          )}
          {isVerified ? "Verified" : "Unverified"}
        </button>

        <div className="relative flex-1">
          <select
            value={currentRole}
            onChange={(e) => handleChangeRole(e.target.value as UserRole)}
            disabled={isLoading !== null}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-bold py-1.5 px-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BUYER">BUYER</option>
            <option value="SELLER">SELLER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
            {isLoading === "role" ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <UserCog className="w-2.5 h-2.5" />}
          </div>
        </div>
      </div>
    </div>
  );
};
