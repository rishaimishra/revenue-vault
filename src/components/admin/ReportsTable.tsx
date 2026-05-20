import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const ReportsTable = ({ reports }: { reports: any[] }) => {
  return (
    <section>
      {reports.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-gray-500">No pending reports.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm border-l-4 border-l-red-500">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 text-sm">Listing: {report.listing.title}</h4>
                <span className="text-[10px] text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="bg-red-50 p-3 rounded-lg mb-4">
                <p className="text-xs text-red-800 font-medium leading-relaxed italic">
                  "{report.reason}"
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Reported By</span>
                  <span className="text-xs text-gray-700">{report.user.name || "Anonymous"}</span>
                </div>
                <Link
                  href={`/listings/${report.listingId}`}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Investigate
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
