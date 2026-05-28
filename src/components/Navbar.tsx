"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Menu, X, LayoutDashboard, Store, ShieldCheck, Lock } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
            <img src="/logo_reve.png" alt="RevenueVault" className="h-28 md:h-32 w-auto object-contain -my-8" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/marketplace"
              className={`text-[15px] font-semibold transition-colors duration-200 ${
                isActive("/marketplace") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Marketplace
            </Link>

            <Link
              href="/pricing"
              className={`text-[15px] font-semibold transition-colors duration-200 ${
                isActive("/pricing") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className={`text-[15px] font-semibold transition-colors duration-200 ${
                isActive("/about") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              How It Works
            </Link>

            <Link
              href="/blog"
              className={`text-[15px] font-semibold transition-colors duration-200 ${
                isActive("/blog") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Blogs
            </Link>

            {session ? (
              <>
                {/* Role-based Dashboard Links */}
                {(session.user as any).role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`text-[15px] font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive("/admin") ? "text-purple-600" : "text-purple-600/70 hover:text-purple-700"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </Link>
                )}
                {(session.user as any).role === 'SELLER' && (
                  <Link
                    href="/dashboard/seller"
                    className={`text-[15px] font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive("/dashboard/seller") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    <Store className="w-4 h-4" /> Dashboard
                  </Link>
                )}
                {(session.user as any).role === 'BUYER' && (
                  <Link
                    href="/dashboard/buyer"
                    className={`text-[15px] font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive("/dashboard/buyer") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  className={`text-[15px] font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive("/profile") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  <User className="w-4 h-4" /> Profile
                </Link>

                <button
                  onClick={() => signOut()}
                  className="text-[15px] font-semibold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/api/auth/signin" className="text-[15px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/onboarding"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-[15px] font-bold hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-200/60 active:scale-[0.98] transition-all duration-200"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-slate-500 hover:text-slate-900 transition-colors">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link href="/marketplace" onClick={toggleMenu} className="block text-lg font-semibold text-slate-800">Marketplace</Link>
          <Link href="/pricing" onClick={toggleMenu} className="block text-lg font-semibold text-slate-800">Pricing</Link>
          <Link href="/about" onClick={toggleMenu} className="block text-lg font-semibold text-slate-800">How It Works</Link>
          <Link
            href="/blog"
            onClick={toggleMenu}
            className={`block text-lg font-semibold transition-colors duration-200 ${
              isActive("/blog") ? "text-indigo-600" : "text-slate-800 hover:text-indigo-600"
            }`}
          >
            Blogs
          </Link>
          
          {session ? (
            <>
              {(session.user as any).role === 'ADMIN' && (
                <Link href="/admin" onClick={toggleMenu} className="block text-lg font-semibold text-purple-600">Admin Panel</Link>
              )}
              {(session.user as any).role === 'SELLER' && (
                <Link href="/dashboard/seller" onClick={toggleMenu} className="block text-lg font-semibold text-slate-800">Dashboard</Link>
              )}
              {(session.user as any).role === 'BUYER' && (
                <Link href="/dashboard/buyer" onClick={toggleMenu} className="block text-lg font-semibold text-slate-800">Dashboard</Link>
              )}
              <Link href="/profile" onClick={toggleMenu} className="block text-lg font-semibold text-slate-800">Profile</Link>
              <button
                onClick={() => signOut()}
                className="block text-lg font-semibold text-rose-500 w-full text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Link href="/api/auth/signin" onClick={toggleMenu} className="block text-lg font-semibold text-slate-800">Log In</Link>
              <Link
                href="/onboarding"
                onClick={toggleMenu}
                className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 rounded-full text-lg font-bold"
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
