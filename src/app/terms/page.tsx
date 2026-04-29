export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
        <p className="text-lg">
          By using RevenueVault, you agree to the following terms and conditions.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">1. Eligibility</h2>
        <p>
          Users must be at least 18 years old and capable of entering into legally binding contracts to use this platform for buying or selling startups.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">2. Verification</h2>
        <p>
          All sellers must provide accurate financial information. RevenueVault reserves the right to request proof of revenue and profit before approving a listing.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">3. Marketplace Conduct</h2>
        <p>
          Buyers and sellers agree to act in good faith. Spamming, fraudulent behavior, or attempts to bypass the platform's access control system are strictly prohibited.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10">4. Disclaimers</h2>
        <p>
          RevenueVault is a marketplace and does not guarantee the accuracy of data provided by users. Due diligence is the sole responsibility of the buyer.
        </p>

        <p className="pt-10 text-sm text-gray-400">
          Last updated: April 2026
        </p>
      </div>
    </div>
  );
}
