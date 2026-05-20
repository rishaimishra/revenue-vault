import { AdminListingActions } from "@/components/admin/AdminListingActions";

export const PendingListings = ({ listings }: { listings: any[] }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Pending Approvals
          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
            {listings.length}
          </span>
        </h2>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-500">No listings waiting for approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{listing.title}</h3>
                  <p className="text-xs text-gray-500">by {listing.seller.name} ({listing.seller.email})</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  ${listing.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-5 italic">
                "{listing.description}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex gap-4">
                  <div className="text-[10px] uppercase font-bold text-gray-400">
                    Rev: <span className="text-gray-900">${listing.revenue.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">
                    Profit: <span className="text-gray-900">${listing.profit.toLocaleString()}</span>
                  </div>
                  <a
                    href={`/listings/${listing.id}`}
                    target="_blank"
                    className="text-[10px] uppercase font-bold text-blue-600 hover:underline"
                  >
                    View Details
                  </a>
                </div>
                <AdminListingActions listingId={listing.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
