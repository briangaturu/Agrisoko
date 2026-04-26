import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetListingsQuery, useDeleteListingMutation } from "../../features/api/listingsApi";

const Listings = () => {
  const { data, isLoading, isError } = useGetListingsQuery({});
  const listings: any[] = data?.data ?? [];
  const getListingId = (l: any): string =>
    String(l?.id ?? l?._id ?? l?.listingId ?? "").trim();
  const [deleteListing] = useDeleteListingMutation();

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteListing(id).unwrap();
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Listings</h1>
      {isError && <p className="text-red-500 mb-4">Failed to load listings</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-xs uppercase">
              <th className="text-left px-4 py-3">Crop</th>
              <th className="text-left px-4 py-3">Farmer ID</th>
              <th className="text-left px-4 py-3">Price / Unit (KES)</th>
              <th className="text-left px-4 py-3">Qty Available</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : listings.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No listings found</td></tr>
            ) : listings.map((l: any, index: number) => {
              const listingId = getListingId(l);
              return (
              <tr key={listingId || `listing-row-${index}`} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-900 font-medium">{l.crop?.name ?? l.cropId}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{l.farmer?.fullName ?? l.farmerId}</td>
                <td className="px-4 py-3">
                  <span className="text-green-600 font-medium">{Number(l.pricePerUnit).toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-700">{l.quantityAvailable}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${l.status === "ACTIVE" ? "bg-green-100 text-green-700 border-green-200" : l.status === "SOLD" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>{l.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(listingId)}
                      disabled={!listingId}
                      title={!listingId ? "Missing listing ID" : "Delete listing"}
                      className="text-red-600 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Listings;