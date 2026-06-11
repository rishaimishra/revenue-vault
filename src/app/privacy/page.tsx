import { Shield, Lock, Eye, Share2, Cookie, ShieldAlert, UserCheck, Globe, ExternalLink, Mail, Clock } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    { id: "intro", title: "1. Introduction", icon: Shield },
    { id: "collect", title: "2. Information We Collect", icon: Eye },
    { id: "use", title: "3. How We Use Your Information", icon: Lock },
    { id: "anon", title: "4. Anonymous Listing Feature", icon: UserCheck },
    { id: "share", title: "5. Sharing of Information", icon: Share2 },
    { id: "cookies", title: "6. Cookies and Tracking Technologies", icon: Cookie },
    { id: "retention", title: "7. Data Retention", icon: Clock },
    { id: "security", title: "8. Data Security", icon: ShieldAlert },
    { id: "rights", title: "9. Your Rights", icon: UserCheck },
    { id: "children", title: "10. Children's Privacy", icon: ShieldAlert },
    { id: "international", title: "11. International Users & NRIs", icon: Globe },
    { id: "links", title: "12. Third-Party Links", icon: ExternalLink },
    { id: "changes", title: "13. Changes to This Policy", icon: Clock },
    { id: "contact", title: "14. Contact Us", icon: Mail },
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/60 text-blue-600 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Shield className="w-3.5 h-3.5 fill-blue-600/10 text-blue-600" /> LEGAL DEPT
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Privacy <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Policy</span>
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/40 text-xs font-bold transition-all group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0" />
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
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">1. Introduction</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, share, and protect the personal information you provide when using our platform at <a href="https://www.revenuevault.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.revenuevault.net</a>. This policy applies to all users of the platform, including Sellers, Buyers, and visitors.
                </p>
                <p>
                  By using RevenueVault, you consent to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our platform.
                </p>
              </div>
            </div>

            <div id="collect" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Eye className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">2. Information We Collect</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  We collect information in several ways. When you register an account, we collect your name, email address, country of residence, and any other details you voluntarily provide during onboarding. When you create a listing, we collect business details including revenue figures, traffic data, business descriptions, asking price, and any financial documentation you choose to upload. When you connect third-party accounts such as Stripe for revenue verification, we receive limited financial data in accordance with the permissions you grant.
                </p>
                <p>
                  We also collect usage data automatically when you visit our platform, including your IP address, browser type, device information, pages viewed, time spent on the platform, and referring URLs. This data is collected through cookies and similar tracking technologies. Additionally, any communications between users conducted through our in-platform messaging system may be stored for security, dispute resolution, and platform integrity purposes.
                </p>
              </div>
            </div>

            <div id="use" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">3. How We Use Your Information</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  We use the information we collect to create and manage your account, display your listings to potential Buyers, verify revenue and financial claims where applicable, facilitate communication between Buyers and Sellers, process payments and manage subscriptions, send you platform notifications, updates, and relevant communications, improve and personalise your experience on the platform, detect and prevent fraud, abuse, and violations of our Terms and Conditions, and comply with applicable legal obligations.
                </p>
                <p>
                  We do not use your personal information to make automated decisions that significantly affect you without human oversight, and we will never sell your personal data to third-party advertisers.
                </p>
              </div>
            </div>

            <div id="anon" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">4. Anonymous Listing Feature</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault offers an anonymous listing feature that allows Sellers to conceal their identity from Buyers during the listing phase. While your public listing may not reveal your name or identifying details, please note that RevenueVault retains your account information internally for verification, compliance, and security purposes. Anonymity on the platform is limited to your public-facing listing and does not extend to our internal records.
                </p>
              </div>
            </div>

            <div id="share" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Share2 className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">5. Sharing of Information</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  We do not sell your personal data. We may share your information in the following limited circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>With other users, where you have explicitly opted to share contact details or business information as part of a deal or negotiation.</li>
                  <li>With third-party service providers who assist us in operating the platform, such as hosting providers, payment processors, email delivery services, and analytics tools, all of whom are bound by confidentiality obligations.</li>
                  <li>With legal or regulatory authorities when required to do so by law, court order, or regulatory requirement.</li>
                  <li>In the event of a merger, acquisition, or sale of RevenueVault assets, in which case user data may be transferred as part of that transaction, with prior notice provided to users where legally required.</li>
                </ul>
              </div>
            </div>

            <div id="cookies" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Cookie className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">6. Cookies and Tracking Technologies</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault uses cookies and similar technologies to enhance your experience on the platform. Cookies help us remember your login session, understand how you use the platform, and deliver a more personalised experience. You may control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of the platform.
                </p>
                <p>
                  We may also use analytics tools such as Google Analytics or similar services to understand aggregate usage patterns. These tools collect anonymised data and are governed by their own privacy policies.
                </p>
              </div>
            </div>

            <div id="retention" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">7. Data Retention</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  We retain your personal data for as long as your account is active or as necessary to provide you with our services. If you close your account, we may retain certain information for a period required by applicable law, for fraud prevention, dispute resolution, or to enforce our Terms and Conditions. Business listing data that has been publicly visible may be retained in aggregated or anonymised form for analytical purposes.
                </p>
              </div>
            </div>

            <div id="security" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">8. Data Security</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  We take the security of your personal information seriously. RevenueVault implements industry-standard technical and organisational measures to protect your data from unauthorised access, disclosure, alteration, or destruction. These measures include encrypted data transmission using HTTPS, access controls limiting who within our organisation can access user data, and secure third-party payment processing that does not store card details on our servers.
                </p>
                <p>
                  However, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security, and you use the platform at your own risk. You are responsible for keeping your account credentials confidential.
                </p>
              </div>
            </div>

            <div id="rights" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">9. Your Rights</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  Depending on your jurisdiction, you may have the following rights regarding your personal data: the right to access the personal information we hold about you; the right to request correction of inaccurate or incomplete information; the right to request deletion of your personal data, subject to legal retention obligations; the right to withdraw consent where processing is based on consent; and the right to lodge a complaint with a data protection authority in your jurisdiction.
                </p>
                <p>
                  To exercise any of these rights, please contact us at <a href="mailto:support@revenuevault.com" className="text-blue-600 hover:underline">support@revenuevault.com</a>. We will respond to your request within a reasonable timeframe and in accordance with applicable law.
                </p>
              </div>
            </div>

            <div id="children" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">10. Children&apos;s Privacy</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has registered on our platform, we will take steps to delete that account and any associated data promptly.
                </p>
              </div>
            </div>

            <div id="international" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">11. International Users and NRI Audience</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  RevenueVault serves users globally, including Non-Resident Indians (NRIs) and international Buyers and Sellers. If you are accessing our platform from outside India, please be aware that your information may be transferred to and processed in India, where our servers and operations are primarily based. By using our platform, you consent to this transfer. We take reasonable steps to ensure your data is handled in accordance with this Privacy Policy regardless of where it is processed.
                </p>
              </div>
            </div>

            <div id="links" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <ExternalLink className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">12. Third-Party Links</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  Our platform may contain links to third-party websites, tools, or services. This Privacy Policy applies only to RevenueVault. We are not responsible for the privacy practices of third-party sites and encourage you to review their policies before sharing any personal information with them.
                </p>
              </div>
            </div>

            <div id="changes" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">13. Changes to This Privacy Policy</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal obligations. When we make material changes, we will notify you via email or a prominent notice on the platform. The updated policy will be effective from the date of publication. Continued use of the platform following such changes constitutes your acceptance of the revised policy.
                </p>
              </div>
            </div>

            <div id="contact" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">14. Contact Us</h2>
              </div>
              <div className="text-slate-600 leading-relaxed font-medium text-sm space-y-4">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please reach out to us at <a href="mailto:support@revenuevault.com" className="text-blue-600 hover:underline">support@revenuevault.com</a>. We are committed to addressing your concerns promptly and transparently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

