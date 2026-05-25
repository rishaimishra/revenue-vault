"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, FileText, AlertCircle, DollarSign, 
  MessageSquare, LogOut, ArrowLeft, Sparkles, Settings
} from "lucide-react";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const coreItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Listings", href: "/admin/listings", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  const supportItems = [
    { name: "Reports", href: "/admin/reports", icon: AlertCircle, badge: "alert" },
    { name: "Payments", href: "/admin/payments", icon: DollarSign },
    { name: "Support", href: "/admin/support", icon: MessageSquare },
  ];

  return (
    <aside className="w-68 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-30 shadow-xs shrink-0 select-none">
      
      {/* Top Header Logo section with logo_reve.png */}
      <div className="px-6 py-2 border-b border-slate-200/80 flex items-center h-16 shrink-0 overflow-hidden">
        <Link href="/admin" className="hover:opacity-90 transition-opacity flex items-center -ml-3 shrink-0">
          <img 
            src="/logo_reve.png" 
            alt="RevenueVault" 
            className="h-20 w-auto object-contain shrink-0" 
          />
        </Link>
      </div>

      {/* Main navigation menu scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 custom-scrollbar">
        
        {/* Core Management Section */}
        <div className="space-y-2">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-3">Core Systems</p>
          <nav className="space-y-1">
            {coreItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100/60 border border-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                    }`} />
                    <span>{item.name}</span>
                  </div>
                  {/* Visual Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Security & Finance Section */}
        <div className="space-y-2">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-3">Integrity & Operations</p>
          <nav className="space-y-1">
            {supportItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100/60 border border-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                    }`} />
                    <span>{item.name}</span>
                  </div>
                  
                  {/* Optional red glow alert dot for Reports */}
                  {item.badge === "alert" && !isActive && (
                    <span className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 animate-pulse mr-1" />
                  )}

                  {/* Visual Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section: Shortcuts & Exit */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-3">Shortcuts</p>
          <Link
            href="/marketplace"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all border border-transparent"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            Return to Marketplace
          </Link>
        </div>

      </div>

      {/* Bottom Profile Section with User Avatar & Actions */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar block with initial */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-slate-800 leading-none truncate w-24">
                {session?.user?.name || "Administrator"}
              </span>
              <span className="text-[9px] text-slate-400 font-bold tracking-wide mt-1 uppercase">
                Staff Admin
              </span>
            </div>
          </div>

          {/* Quick Sign Out Action */}
          <button
            onClick={() => signOut()}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 border border-transparent"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
