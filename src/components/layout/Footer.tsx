import Link from "next/link";
import { Shield, Globe, Share2, MessageSquare, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">RevenueVault</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              The world's most secure and anonymous marketplace for buying and selling startups. Built for founders, by founders.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <MessageSquare className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Share2 className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Marketplace */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Marketplace</h4>
            <ul className="space-y-4">
              <li><Link href="/marketplace" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Browse All</Link></li>
              <li><Link href="/marketplace?category=SaaS" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">SaaS</Link></li>
              <li><Link href="/marketplace?category=Ecommerce" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">E-commerce</Link></li>
              <li><Link href="/listings/new" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">List Startup</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">How it Works</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" /> support@revenuevault.com
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">
            © 2026 RevenueVault Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full uppercase">
              <span className="w-1 h-1 bg-green-600 rounded-full animate-pulse"></span> Systems Normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
