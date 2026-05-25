"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";
import { 
  Bell, Search, Globe, ChevronRight, HardDrive, 
  Terminal, ShieldCheck, Cpu, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dynamic breadcrumb text based on path
  const getSectionTitle = () => {
    if (pathname === "/admin") return "Analytics Desk";
    if (pathname.startsWith("/admin/listings")) return "Listings Application";
    if (pathname.startsWith("/admin/users")) return "User Directory";
    if (pathname.startsWith("/admin/reports")) return "Complaints & Reports";
    if (pathname.startsWith("/admin/payments")) return "Payments Ledger";
    if (pathname.startsWith("/admin/support")) return "Support Desk";
    return "Operations Control";
  };

  const getBreadcrumbName = () => {
    if (pathname === "/admin") return "Overview";
    if (pathname.startsWith("/admin/listings")) return "Listings";
    if (pathname.startsWith("/admin/users")) return "Users";
    if (pathname.startsWith("/admin/reports")) return "Reports";
    if (pathname.startsWith("/admin/payments")) return "Payments";
    if (pathname.startsWith("/admin/support")) return "Support";
    return "System";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      
      {/* Premium dark-themed Sidebar */}
      <AdminSidebar />
      
      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Dedicated Admin Workspace Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 select-none z-10 shadow-xs">
          
          {/* Left section: breadcrumbs */}
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="text-slate-400">Console</span>
            <ChevronRight className="w-3 h-3 text-slate-300 stroke-[2.5]" />
            <Link href="/admin" className="text-slate-500 hover:text-indigo-600 transition-colors">
              System
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300 stroke-[2.5]" />
            <span className="text-indigo-600 font-extrabold uppercase bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50">
              {getBreadcrumbName()}
            </span>
          </div>

          {/* Right Section: System Diagnostics & Actions */}
          <div className="flex items-center gap-6">
            
            {/* System Node Indicator */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 border border-emerald-100/50 rounded-xl text-emerald-700">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider">Node: Operational</span>
            </div>

            {/* Action Buttons: Public Site link */}
            <div className="flex items-center gap-3">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
              >
                Public Site <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </header>

        {/* Scrollable Sub-Page Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar bg-slate-50/30">
          
          {/* Section banner */}
          <div className="mb-6 pb-4 border-b border-slate-200/50">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-indigo-500 stroke-[2.2]" /> {getSectionTitle()}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Active Dashboard Tab: console.revenuevault.com{pathname}
            </p>
          </div>

          {children}
        </main>

      </div>
    </div>
  );
}
