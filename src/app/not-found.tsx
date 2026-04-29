import Link from "next/link";
import { Shield, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center">
            <Shield className="w-10 h-10 text-blue-600 opacity-20 absolute animate-ping" />
            <Shield className="w-10 h-10 text-blue-600 relative" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-gray-900">Listing or page not found</h2>
          <p className="text-gray-500">
            The deal you're looking for might have been sold, removed, or the URL is incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            <Home className="w-4 h-4" /> Back Home
          </Link>
          <Link
            href="/marketplace"
            className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
