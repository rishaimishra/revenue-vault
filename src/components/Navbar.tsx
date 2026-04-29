"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Shield, User, LogOut, Menu, X, LayoutDashboard, Store, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">RevenueVault</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/marketplace"
              className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                isActive("/marketplace") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Search className="w-4 h-4" /> Marketplace
            </Link>

            <Link
              href="/pricing"
              className={`text-sm font-bold transition-colors ${
                isActive("/pricing") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className={`text-sm font-bold transition-colors ${
                isActive("/about") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              How it Works
            </Link>

            {session ? (
              <>
                {/* Role-based Dashboard Links */}
                {(session.user as any).role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                      isActive("/admin") ? "text-purple-600" : "text-purple-600/70 hover:text-purple-700"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </Link>
                )}
                {(session.user as any).role === 'SELLER' ? (
                  <Link
                    href="/dashboard/seller"
                    className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                      isActive("/dashboard/seller") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Store className="w-4 h-4" /> Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/buyer"
                    className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                      isActive("/dashboard/buyer") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                    isActive("/profile") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <User className="w-4 h-4" /> Profile
                </Link>

                <button
                  onClick={() => signOut()}
                  className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/api/auth/signin" className="text-sm font-bold text-gray-700 hover:text-blue-600">Log In</Link>
                <Link
                  href="/onboarding"
                  className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-900 transition-colors">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link href="/marketplace" onClick={toggleMenu} className="block text-lg font-bold text-gray-900">Marketplace</Link>
          <Link href="/pricing" onClick={toggleMenu} className="block text-lg font-bold text-gray-900">Pricing</Link>
          <Link href="/about" onClick={toggleMenu} className="block text-lg font-bold text-gray-900">How it Works</Link>
          {session ? (
            <>
              {(session.user as any).role === 'ADMIN' && (
                <Link href="/admin" onClick={toggleMenu} className="block text-lg font-bold text-purple-600">Admin Panel</Link>
              )}
              <Link href={(session.user as any).role === 'SELLER' ? "/dashboard/seller" : "/dashboard/buyer"} onClick={toggleMenu} className="block text-lg font-bold text-gray-900">Dashboard</Link>
              <Link href="/profile" onClick={toggleMenu} className="block text-lg font-bold text-gray-900">Profile</Link>
              <button
                onClick={() => signOut()}
                className="block text-lg font-bold text-red-500 w-full text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <Link href="/api/auth/signin" onClick={toggleMenu} className="block text-lg font-bold text-gray-900">Log In</Link>
              <Link
                href="/onboarding"
                onClick={toggleMenu}
                className="block bg-blue-600 text-white text-center py-3 rounded-xl text-lg font-bold"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
