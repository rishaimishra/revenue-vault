import { Shield, CheckCircle2, HelpCircle, Key, PlusCircle, ArrowUpRight, Lock, XCircle, CreditCard, Landmark, AlertTriangle, Scale, ShieldAlert, Ban, ShieldCheck, Mail } from "lucide-react";

export default function TermsPage() {
  const sections = [
    { id: "intro", title: "1. Acceptance of Terms", icon: Shield },
    { id: "eligibility", title: "2. Eligibility", icon: CheckCircle2 },
    { id: "nature", title: "3. Nature of the Platform", icon: HelpCircle },
    { id: "account", title: "4. Account Security", icon: Key },
    { id: "seller", title: "5. Seller Terms", icon: PlusCircle },
    { id: "buyer", title: "6. Buyer Terms", icon: ArrowUpRight },
    { id: "confidentiality", title: "7. Confidentiality", icon: Lock },
    { id: "conduct", title: "8. Prohibited Conduct", icon: XCircle },
    { id: "payments", title: "9. Fees & Payments", icon: CreditCard },
    { id: "ip", title: "10. Intellectual Property", icon: Landmark },
    { id: "liability", title: "11. Limitation of Liability", icon: AlertTriangle },
    { id: "indemnification", title: "12. Indemnification", icon: Scale },
    { id: "thirdparty", title: "13. Third-Party Services", icon: ShieldAlert },
    { id: "termination", title: "14. Termination", icon: Ban },
    { id: "governing", title: "15. Governing Law", icon: ShieldCheck },
    { id: "contact", title: "16. Contact Information", icon: Mail },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen relative overflow-x-hidden py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-dot-grid -z-20 mask-gradient opacity-60 pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 blur-3xl rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-3xl rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/60 text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Scale className="w-3.5 h-3.5 fill-indigo-600/10 text-indigo-600" /> LEGAL DEPT
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Terms & <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Conditions</span>
          </h1>
          <p className="text-slate-500 text-sm font-semibold max-w-xl mx-auto">
            Last updated: June 11, 2026 • Effective date: Immediate upon publication
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Quick Nav / Sidebar Table of Contents */}
          <aside className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-premium sticky top-28 hidden lg:block">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Table of Contents</h3>
            <nav className="space-y-1">
              {sections.map((sect) => {
                const Icon = sect.icon;
                return (
                  <a
                    key={sect.id}
                    href={`#${sect.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/40 text-xs font-bold transition-all group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                    <span className="truncate">{sect.title}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Detailed Content */}
          <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-premium space-y-12">
            <div id="intro" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">1. Introduction and Acceptance of Terms</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  Welcome to RevenueVault (&ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operated by RevenueVault and accessible at <a href="https://www.revenuevault.net" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.revenuevault.net</a>. RevenueVault is an online marketplace that facilitates the buying and selling of revenue-generating digital and physical businesses, including but not limited to SaaS products, SaaS businesses, e-commerce stores, content websites, Instagram pages, YouTube channels, newsletters, mobile applications, distribution networks, retail businesses, and any other ventures generating Monthly Recurring Revenue (MRR) or Annual Recurring Revenue (ARR).
                </p>
                <p>
                  By accessing or using the RevenueVault platform, creating an account, listing a business, or engaging in any transaction or communication through our platform, you (&ldquo;User&rdquo;, &ldquo;Buyer&rdquo;, &ldquo;Seller&rdquo;, or &ldquo;Member&rdquo;) agree to be legally bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you do not agree to these Terms in their entirety, you must immediately cease use of the platform.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and RevenueVault. We reserve the right to modify these Terms at any time, and continued use of the platform following any such modification constitutes your acceptance of the updated Terms.
                </p>
              </div>
            </div>

            <div id="eligibility" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">2. Eligibility</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  To use RevenueVault, you must be at least above 16 years of age and possess the legal capacity to enter into binding contracts under applicable law. By registering on the platform, you represent and warrant that all information you provide is accurate, current, and complete. You further represent that you are not prohibited from using our services under the laws of any applicable jurisdiction.
                </p>
                <p>
                  RevenueVault reserves the right to refuse registration, terminate accounts, or restrict access to any user at its sole discretion, including in cases where we believe a user has violated these Terms, provided false information, or engaged in behavior detrimental to the platform or its community.
                </p>
              </div>
            </div>

            <div id="nature" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">3. Nature of the Platform</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault operates solely as a marketplace and facilitator. We connect Sellers who wish to exit their businesses with Buyers who are interested in acquiring them. RevenueVault is not a broker, financial advisor, investment advisor, legal advisor, or party to any transaction between Buyers and Sellers. We do not take ownership of any listing, asset, or business at any point.
                </p>
                <p>
                  All listings, negotiations, due diligence, agreements, and final transactions occur directly between Buyers and Sellers. RevenueVault does not guarantee the accuracy of any listing, the completion of any deal, the quality of any business listed, or the financial performance of any asset. Users are solely responsible for conducting their own due diligence before entering into any transaction.
                </p>
              </div>
            </div>

            <div id="account" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Key className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">4. Account Registration and Security</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  To access the full features of RevenueVault, you must create an account by providing accurate and verifiable information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately at <a href="mailto:support@revenuevault.com" className="text-indigo-600 hover:underline">support@revenuevault.com</a> if you suspect any unauthorized use of your account.
                </p>
                <p>
                  RevenueVault will not be held liable for any loss or damage arising from your failure to secure your account. You may not share your account, sell access to it, or use another person&apos;s account without their explicit permission.
                </p>
              </div>
            </div>

            <div id="seller" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <PlusCircle className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">5. Listing a Business (Seller Terms)</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  Sellers may list their revenue-generating businesses on RevenueVault subject to the following conditions. All listings must represent a real, legally owned business or digital asset. Sellers warrant that they have full legal authority to list and sell the business or asset described in their listing. Sellers agree to provide accurate financial data, including MRR, ARR, revenue history, traffic data, and any other metrics requested during the listing process.
                </p>
                <p>
                  RevenueVault may, at its discretion, verify revenue claims through third-party integrations such as Stripe, PayPal, or other financial platforms before a listing goes live. Submission of a listing does not guarantee its publication. We reserve the right to reject, suspend, or remove any listing that we believe violates these Terms, is misleading, or poses a risk to Buyers.
                </p>
                <p>
                  Sellers agree not to list businesses that are involved in illegal activities, promote harmful content, violate intellectual property rights of third parties, or misrepresent their financial performance. RevenueVault operates a zero-commission model and does not charge transaction fees on completed deals, though subscription fees for premium listing features may apply as outlined in our Pricing page.
                </p>
              </div>
            </div>

            <div id="buyer" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ArrowUpRight className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">6. Purchasing a Business (Buyer Terms)</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  Buyers acknowledge that RevenueVault serves solely as a discovery and communication platform. Any business listed on the platform may be subject to independent verification, and Buyers are strongly encouraged to perform thorough due diligence before committing to any acquisition. This includes but is not limited to reviewing financial statements, traffic analytics, customer contracts, intellectual property ownership, liabilities, and legal standing.
                </p>
                <p>
                  RevenueVault does not verify every claim made by Sellers and cannot be held responsible for inaccuracies, omissions, or misrepresentations in listings. Buyers are solely responsible for their investment decisions. RevenueVault strongly recommends engaging qualified legal and financial professionals before completing any acquisition.
                </p>
              </div>
            </div>

            <div id="confidentiality" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">7. Anonymous Listings and Confidentiality</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault supports anonymous listing functionality, allowing Sellers to protect their identity during the initial phases of a sale. Buyers agree not to attempt to de-anonymize Sellers without their explicit consent. Any information shared privately between Buyers and Sellers through the platform&apos;s messaging system must be treated as strictly confidential and may not be disclosed to third parties without the explicit written consent of the disclosing party.
                </p>
                <p>
                  Breach of confidentiality obligations may result in immediate account termination and potential legal action. RevenueVault is not liable for any breach of confidentiality occurring between users, but we encourage all parties to operate with integrity and professionalism.
                </p>
              </div>
            </div>

            <div id="conduct" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <XCircle className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">8. Prohibited Conduct</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  Users of RevenueVault agree not to engage in any of the following:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Listing fictitious, fraudulent, or fabricated businesses.</li>
                  <li>Providing false financial data or inflated metrics.</li>
                  <li>Attempting to circumvent the platform by directing deals off-platform to avoid platform policies.</li>
                  <li>Engaging in harassment, threats, or abusive communication with other users.</li>
                  <li>Attempting to hack, scrape, or reverse-engineer any part of the platform.</li>
                  <li>Using the platform for money laundering, fraud, or any other illegal purpose.</li>
                  <li>Creating multiple accounts to evade restrictions or suspensions.</li>
                  <li>Spamming other users or sending unsolicited commercial communications.</li>
                </ul>
                <p>
                  Violations of this section may result in immediate account suspension, permanent ban, reporting to relevant authorities, and potential civil or criminal liability.
                </p>
              </div>
            </div>

            <div id="payments" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">9. Fees, Subscriptions, and Payments</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault offers a freemium subscription model. Certain features are available at no cost, while premium features are available through paid subscription tiers as described on our Pricing page. All subscription fees are non-refundable unless required by applicable law or explicitly stated otherwise by RevenueVault.
                </p>
                <p>
                  Payments are processed through secure third-party payment processors. RevenueVault does not store your payment card details. Subscription renewals occur automatically unless cancelled before the renewal date. You may cancel your subscription at any time, and your access to paid features will remain active until the end of the current billing period.
                </p>
                <p>
                  RevenueVault reserves the right to modify its pricing at any time. Notice of pricing changes will be provided via email or platform notification at least 30 days prior to the change taking effect.
                </p>
              </div>
            </div>

            <div id="ip" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Landmark className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">10. Intellectual Property</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  All content on the RevenueVault platform, including but not limited to the logo, brand name, interface design, written content, software, and technology, is the exclusive property of RevenueVault and is protected under applicable intellectual property laws. Users may not reproduce, distribute, modify, or create derivative works from any platform content without prior written permission.
                </p>
                <p>
                  By submitting content to the platform, including listing descriptions, images, financial summaries, and other materials, you grant RevenueVault a non-exclusive, royalty-free, worldwide license to display, reproduce, and use that content for the purpose of operating and promoting the platform. You retain ownership of your content.
                </p>
              </div>
            </div>

            <div id="liability" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">11. Limitation of Liability</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  To the maximum extent permitted by applicable law, RevenueVault, its directors, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform, including but not limited to loss of profits, loss of data, business interruption, or financial loss resulting from any transaction entered into through the platform.
                </p>
                <p>
                  RevenueVault&apos;s total aggregate liability to any user for any claims arising under these Terms shall not exceed the amount paid by that user to RevenueVault in the twelve months preceding the claim. Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability, and in such cases, RevenueVault&apos;s liability will be limited to the greatest extent permitted by law.
                </p>
              </div>
            </div>

            <div id="indemnification" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Scale className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">12. Indemnification</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  You agree to indemnify, defend, and hold harmless RevenueVault and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising from your use of the platform, your violation of these Terms, your violation of any third-party rights, or any dispute between you and another user.
                </p>
              </div>
            </div>

            <div id="thirdparty" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">13. Third-Party Services and Integrations</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault may integrate with or link to third-party services, including payment processors, revenue verification tools, and communication platforms. These third-party services operate under their own terms and privacy policies, and RevenueVault is not responsible for their practices, accuracy, or reliability. Your use of any third-party service linked through our platform is at your own risk.
                </p>
              </div>
            </div>

            <div id="termination" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Ban className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">14. Termination</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault reserves the right to suspend or terminate your account and access to the platform at any time, with or without notice, for any reason including but not limited to violation of these Terms, fraudulent activity, or behavior harmful to the platform or its users. Upon termination, your right to use the platform ceases immediately. Provisions of these Terms that by their nature should survive termination, including limitation of liability, indemnification, and intellectual property clauses, shall continue to apply.
                </p>
              </div>
            </div>

            <div id="governing" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">15. Governing Law and Dispute Resolution</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these Terms or your use of the platform shall first be attempted to be resolved through good-faith negotiation. If resolution cannot be reached, disputes shall be submitted to binding arbitration in accordance with applicable Indian arbitration laws. Both parties agree to waive the right to a jury trial or class action proceedings to the extent permitted by law.
                </p>
              </div>
            </div>

            <div id="contact" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">16. Contact Information</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  For any questions, concerns, or legal notices regarding these Terms, please contact us at <a href="mailto:support@revenuevault.com" className="text-indigo-600 hover:underline">support@revenuevault.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

