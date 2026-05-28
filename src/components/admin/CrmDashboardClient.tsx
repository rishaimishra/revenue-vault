"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, Filter, Sparkles, User, FileText, MessageSquare, 
  ChevronRight, ArrowRight, ShieldCheck, HelpCircle, AlertCircle,
  GripVertical
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
  { key: "PROSPECT", label: "Prospect", color: "from-blue-500 to-indigo-500", bgLight: "bg-blue-50/30" },
  { key: "CONTACTED", label: "Contacted", color: "from-indigo-500 to-purple-500", bgLight: "bg-indigo-50/30" },
  { key: "QUALIFIED", label: "Qualified", color: "from-purple-500 to-pink-500", bgLight: "bg-purple-50/30" },
  { key: "NURTURING", label: "Nurturing", color: "from-amber-500 to-orange-500", bgLight: "bg-amber-50/30" },
  { key: "CONVERTED", label: "Converted", color: "from-emerald-500 to-teal-500", bgLight: "bg-emerald-50/30" },
  { key: "LOST", label: "Lost", color: "from-slate-500 to-slate-600", bgLight: "bg-slate-50/30" },
];

export const CrmDashboardClient = ({ initialUsers }: CrmDashboardClientProps) => {
  const [contacts, setContacts] = useState<Contact[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Drag and Drop States
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const handleStageChange = async (userId: string, newStage: string) => {
    const contact = contacts.find((c) => c.id === userId);
    if (!contact) return;
    
    const oldStage = contact.crmStage;
    if (oldStage.toUpperCase() === newStage.toUpperCase()) return;

    // Optimistic Update: instantly update the UI stage state
    setContacts((prev) =>
      prev.map((c) => (c.id === userId ? { ...c, crmStage: newStage.toUpperCase() } : c))
    );
    setUpdatingId(userId);
    setErrorAlert(null);

    try {
      const response = await fetch("/api/admin/crm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, crmStage: newStage.toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update CRM stage");
      }
    } catch (error) {
      console.error(error);
      // Rollback to original stage if the API call fails
      setContacts((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, crmStage: oldStage } : c))
      );
      setErrorAlert(`Could not move ${contact.name} to "${newStage.toLowerCase()}". Please verify your connection.`);
    } finally {
      setUpdatingId(null);
    }
  };

  // HTML5 Drag & Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, userId: string) => {
    setDraggingId(userId);
    e.dataTransfer.setData("text/plain", userId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageKey: string) => {
    e.preventDefault(); // Necessary to allow dropping
    setDragOverStage(stageKey);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const userId = e.dataTransfer.getData("text/plain") || draggingId;
    if (!userId) return;

    await handleStageChange(userId, targetStage);
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
      
      {/* Sleek Error Toast Banner */}
      {errorAlert && (
        <div className="bg-red-50 border border-red-200/50 p-4 rounded-2xl flex items-center justify-between text-xs text-red-700 animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
          <div className="flex items-center gap-3 pl-1">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <span className="font-semibold">{errorAlert}</span>
          </div>
          <button
            onClick={() => setErrorAlert(null)}
            className="text-red-400 hover:text-red-600 font-bold transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-100/50"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/50 p-5 rounded-[2rem] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="w-full md:w-96 flex items-center bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 focus-within:bg-white">
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
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {role === "ALL" ? "All Roles" : role}
            </button>
          ))}
        </div>

      </div>

      {/* CRM Pipeline Kanban Board - Custom Scrollbar & Horizontal Layout */}
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 items-start scroll-smooth custom-scrollbar snap-x">
        {CRM_STAGES.map((stage) => {
          const stageContacts = filteredContacts.filter(
            (c) => c.crmStage.toUpperCase() === stage.key
          );

          const isOverThisStage = dragOverStage === stage.key;

          return (
            <div
              key={stage.key}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.key)}
              className={`rounded-[2.25rem] border p-5 space-y-4 w-[calc(100%-1.5rem)] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 min-h-[550px] flex flex-col transition-all duration-300 relative snap-start snap-always ${
                isOverThisStage
                  ? "bg-indigo-50/60 border-indigo-400 ring-4 ring-indigo-500/5 shadow-lg shadow-indigo-100/50 scale-[1.01]"
                  : `${stage.bgLight} border-slate-200/60 hover:border-slate-300/80`
              }`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 select-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${stage.color}`} />
                  <h3 className="text-xs font-black text-slate-800 tracking-tight">
                    {stage.label}
                  </h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md shadow-2xs">
                  {stageContacts.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[520px] pr-1.5 custom-scrollbar">
                {stageContacts.length === 0 ? (
                  <div className={`h-36 border border-dashed rounded-2xl flex items-center justify-center text-center p-4 transition-all duration-300 ${
                    isOverThisStage ? "border-indigo-300 bg-indigo-50/30 scale-95" : "border-slate-200 bg-white/40"
                  }`}>
                    <p className={`text-[10px] font-semibold italic ${isOverThisStage ? "text-indigo-500" : "text-slate-400"}`}>
                      {isOverThisStage ? "Drop contact here!" : "No contacts in stage"}
                    </p>
                  </div>
                ) : (
                  stageContacts.map((contact) => {
                    const isCurrentlyDragging = draggingId === contact.id;

                    return (
                      <div
                        key={contact.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, contact.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white border p-4.5 rounded-2xl transition-all duration-250 space-y-3 relative group select-none cursor-grab active:cursor-grabbing ${
                          isCurrentlyDragging
                            ? "opacity-30 border-dashed border-indigo-300 bg-indigo-50/20 shadow-none scale-95"
                            : "border-slate-200/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300/80"
                        }`}
                      >
                        {/* Name & Role */}
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-slate-300 group-hover:text-slate-400 transition-colors shrink-0">
                                <GripVertical className="w-3.5 h-3.5" />
                              </span>
                              <Link 
                                href={`/admin/crm/${contact.id}`}
                                className="font-extrabold text-xs text-slate-800 hover:text-indigo-600 truncate leading-snug transition-colors"
                              >
                                {contact.name}
                              </Link>
                            </div>
                            {contact.isVerified && (
                              <span title="Verified Account">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 truncate font-semibold ml-5">
                            {contact.email}
                          </p>
                        </div>

                        {/* Role Pill & Stats */}
                        <div className="flex justify-between items-center text-[10px] pl-5">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${
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
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 select-none pl-5">
                          <select
                            disabled={updatingId === contact.id}
                            value={contact.crmStage}
                            onChange={(e) => handleStageChange(contact.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-md text-[9px] font-bold text-slate-600 py-1 px-1.5 focus:outline-none focus:border-indigo-500 w-full cursor-pointer disabled:opacity-50 transition-colors"
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
                            className="p-1 text-slate-400 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-md shrink-0 active:scale-95 transition-all hover:bg-slate-100"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Updating Overlay Spinner */}
                        {updatingId === contact.id && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-3xs flex items-center justify-center rounded-2xl z-10">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
