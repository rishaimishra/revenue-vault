"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CrmStageSelectorProps {
  userId: string;
  initialStage: string;
}

const CRM_STAGES = [
  { key: "PROSPECT", label: "Prospect" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "QUALIFIED", label: "Qualified" },
  { key: "NURTURING", label: "Nurturing" },
  { key: "CONVERTED", label: "Converted" },
  { key: "LOST", label: "Lost" },
];

export const CrmStageSelector = ({ userId, initialStage }: CrmStageSelectorProps) => {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(initialStage);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStageChange = async (newStage: string) => {
    try {
      setIsUpdating(true);

      const response = await fetch("/api/admin/crm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, crmStage: newStage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update CRM stage");
      }

      setCurrentStage(newStage);
      alert(`Lead pipeline updated to ${newStage}!`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update pipeline stage. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 select-none relative">
      <select
        disabled={isUpdating}
        value={currentStage}
        onChange={(e) => handleStageChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700 py-2 px-3 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
      >
        {CRM_STAGES.map((stage) => (
          <option key={stage.key} value={stage.key}>
            {stage.label}
          </option>
        ))}
      </select>

      {isUpdating && (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 absolute -right-6" />
      )}
    </div>
  );
};
