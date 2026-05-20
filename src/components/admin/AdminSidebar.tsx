import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, AlertCircle, DollarSign, MessageSquare } from "lucide-react";

export const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Listings", href: "/admin/listings", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: AlertCircle },
    { name: "Payments", href: "/admin/payments", icon: DollarSign },
    { name: "Support", href: "/admin/support", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Admin Menu</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
