"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, Filter, Sparkles, User, FileText, MessageSquare, 
  ChevronRight, ArrowRight, ShieldCheck, HelpCircle, AlertCircle 
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  crmStage: string;
  listingsCount: number;
  dealsCount: number;
  paymentsCount: number;
  isSubscribed: boolean;
  subscriptionTier: string;
  isVerified: boolean;
  createdAt: string;
}

interface CrmDashboardClientProps {
  initialUsers: Contact[];
}

const CRM_STAGES = [
  { key: "PROSPECT", label: "Prospect", color: "from-blue-500 to-indigo-500", bgLight: "bg-blue-50/50" },
  { key: "CONTACTED", label: "Contacted", color: "from-indigo-500 to-purple-500", bgLight: "bg-indigo-50/50" },
  { key: "QUALIFIED", label: "Qualified", color: "from-purple-500 to-pink-500", bgLight: "bg-purple-50/50" },
  { key: "NURTURING", label: "Nurturing", color: "from-amber-500 to-orange-500", bgLight: "bg-amber-50/50" },
  { key: "CONVERTED", label: "Converted", color: "from-emerald-500 to-teal-500", bgLight: "bg-emerald-50/50" },
  { key: "LOST", label: "Lost", color: "from-slate-500 to-slate-600", bgLight: "bg-slate-50/50" },
];

export const CrmDashboardClient = ({ initialUsers }: CrmDashboardClientProps) => {
  const [contacts, setContacts] = useState<Contact[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStageChange = async (userId: string, newStage: string) => {
    try {
      setUpdatingId(userId);

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

      // Update state locally for instant UI update
      setContacts((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, crmStage: newStage } : c))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update lead stage. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter contacts based on search query and role filter
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || c.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 select-none">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/50 p-5 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="w-full md:w-96 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none px-3 text-xs text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Role Toggle Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["ALL", "BUYER", "SELLER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                roleFilter === role
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {role === "ALL" ? "All Roles" : role}
            </button>
          ))}
        </div>

      </div>

      {/* CRM Pipeline Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start overflow-x-auto pb-4">
        {CRM_STAGES.map((stage) => {
          const stageContacts = filteredContacts.filter(
            (c) => c.crmStage.toUpperCase() === stage.key
          );

          return (
            <div
              key={stage.key}
              className={`rounded-[2rem] border border-slate-200/60 p-4 space-y-4 shrink-0 min-h-[450px] flex flex-col ${stage.bgLight}`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 select-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${stage.color}`} />
                  <h3 className="text-xs font-black text-slate-800 tracking-tight">
                    {stage.label}
                  </h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  {stageContacts.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[500px] pr-0.5 custom-scrollbar">
                {stageContacts.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-center p-4">
                    <p className="text-[10px] text-slate-400 font-semibold italic">
                      No contacts in stage
                    </p>
                  </div>
                ) : (
                  stageContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all space-y-3 relative group"
                    >
                      {/* Name & Role */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link 
                            href={`/admin/crm/${contact.id}`}
                            className="font-black text-xs text-slate-800 hover:text-indigo-600 line-clamp-1 leading-snug"
                          >
                            {contact.name}
                          </Link>
                          {contact.isVerified && (
                            <span title="Verified Account">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 truncate font-semibold">
                          {contact.email}
                        </p>
                      </div>

                      {/* Role Pill & Stats */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase ${
                          contact.role === "SELLER" 
                            ? "bg-amber-50 border-amber-100 text-amber-600" 
                            : contact.role === "ADMIN"
                            ? "bg-purple-50 border-purple-100 text-purple-600"
                            : "bg-blue-50 border-blue-100 text-blue-600"
                        }`}>
                          {contact.role}
                        </span>

                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px]">
                          {contact.listingsCount > 0 && (
                            <span className="flex items-center gap-0.5" title="Listings">
                              <FileText className="w-3 h-3 text-slate-300" />
                              {contact.listingsCount}
                            </span>
                          )}
                          {contact.dealsCount > 0 && (
                            <span className="flex items-center gap-0.5" title="Negotiating Deals">
                              <MessageSquare className="w-3 h-3 text-slate-300" />
                              {contact.dealsCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dropdown Action Selector */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 select-none">
                        <select
                          disabled={updatingId === contact.id}
                          value={contact.crmStage}
                          onChange={(e) => handleStageChange(contact.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-md text-[9px] font-bold text-slate-600 py-1 px-1.5 focus:outline-none focus:border-indigo-500 w-full cursor-pointer disabled:opacity-50"
                        >
                          {CRM_STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              Move to {s.label}
                            </option>
                          ))}
                        </select>

                        <Link
                          href={`/admin/crm/${contact.id}`}
                          title="Lead command profile"
                          className="p-1 text-slate-400 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-md shrink-0 active:scale-95 duration-200"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Updating Overlay Spinner */}
                      {updatingId === contact.id && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
