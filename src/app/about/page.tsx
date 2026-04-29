import { Shield, Zap, Lock, BarChart3, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const steps = [
    {
      title: "List Your Startup",
      description: "Founders create a detailed listing including key financial metrics like Revenue and Profit. We keep your identity anonymous until you're ready.",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Verification Process",
      description: "Our admin team reviews every listing. We verify financial data to ensure trust and transparency for all buyers on the platform.",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Request Access",
      description: "Interested buyers must 'Request Access'. Sellers review buyer profiles and proof of funds before granting access to sensitive details.",
      icon: <Lock className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Secure Communication",
      description: "Once approved, a direct secure chat opens. Discuss due diligence, share documents, and negotiate terms in a private environment.",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            How RevenueVault Works
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We've built a streamlined, privacy-first marketplace for the next generation of founders and investors. Here's how we facilitate secure startup acquisitions.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                Why choose an anonymous marketplace?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Protect your employees</h4>
                    <p className="text-gray-600 text-sm">Announcing a sale prematurely can cause internal panic. Keep your team focused while you find the right exit.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Shield from competitors</h4>
                    <p className="text-gray-600 text-sm">Don't let competitors know you're looking for an exit until the deal is close to closing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Attract high-intent buyers</h4>
                    <p className="text-gray-600 text-sm">The access request barrier ensures that only serious, qualified investors get to see your sensitive data.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 italic">"RevenueVault allowed me to sell my SaaS without a single person in my niche knowing until it was already done. The peace of mind was worth every penny."</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold">JD</div>
                  <div>
                    <p className="font-bold">John Doe</p>
                    <p className="text-blue-200 text-xs uppercase tracking-widest font-bold">Sold SaaS for $1.2M</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Ready to explore the marketplace?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/marketplace"
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              Start Browsing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/onboarding"
              className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Join RevenueVault
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
