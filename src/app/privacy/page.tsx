export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
        <p className="text-lg">
          At RevenueVault, we take your privacy and anonymity extremely seriously. This policy outlines how we handle your data.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">1. Data Collection</h2>
        <p>
          We collect information necessary to facilitate startup acquisitions, including email addresses, names, and financial data related to your startups.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">2. Anonymity and Shielding</h2>
        <p>
          Your identity as a seller is shielded from public view. Only your startup's title and description are public. Sensitive financial data is blurred, and your name/email are only shared with buyers you explicitly approve.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">3. Data Security</h2>
        <p>
          We use industry-standard encryption and secure cloud providers (Neon/PostgreSQL) to ensure your data remains protected from unauthorized access.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">4. Third-Party Services</h2>
        <p>
          We use NextAuth for authentication and simulated payment providers. We do not sell your personal data to advertisers.
        </p>

        <p className="pt-10 text-sm text-gray-400">
          Last updated: April 2026
        </p>
      </div>
    </div>
  );
}
