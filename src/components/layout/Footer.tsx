import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="hover:opacity-90 transition-opacity inline-block">
              <img src="/logo_reve.png" alt="RevenueVault" className="h-28 md:h-32 w-auto object-contain -ml-8 -my-6" />
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
              The world&apos;s most secure and anonymous marketplace for buying and selling startups. Built for founders, by founders.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  ), 
                  href: "https://twitter.com" 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ), 
                  href: "https://linkedin.com" 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ), 
                  href: "https://instagram.com" 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  ), 
                  href: "mailto:support@revenuevault.com" 
                }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/20 active:scale-95 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer for wider layouts */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Marketplace Column */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Marketplace</h4>
            <ul className="space-y-4 font-semibold text-[14px]">
              <li><Link href="/marketplace" className="text-slate-500 hover:text-indigo-600 transition-colors">Browse All</Link></li>
              <li><Link href="/marketplace?category=SaaS" className="text-slate-500 hover:text-indigo-600 transition-colors">SaaS</Link></li>
              <li><Link href="/marketplace?category=Ecommerce" className="text-slate-500 hover:text-indigo-600 transition-colors">E-commerce</Link></li>
              <li><Link href="/marketplace?category=AI" className="text-slate-500 hover:text-indigo-600 transition-colors">AI</Link></li>
              <li><Link href="/onboarding" className="text-slate-500 hover:text-indigo-600 transition-colors">List Startup</Link></li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 font-semibold text-[14px]">
              <li><Link href="/pricing" className="text-slate-500 hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-indigo-600 transition-colors">How It Works</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 font-semibold text-[14px]">
              <li><Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Contact Us</Link></li>
              <li className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:support@revenuevault.com" className="truncate">support@revenuevault.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
          <p>© 2026 RevenueVault. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <svg className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>for Founders</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
