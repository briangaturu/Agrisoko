import { useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { useGetListingsQuery, useUpdateListingMutation, useDeleteListingMutation } from "../features/api/listingsApi";

const Listings = () => {
  const { data, isLoading, isError } = useGetListingsQuery({});
  const listings: any[] = data?.data ?? [];
  const [updateListing] = useUpdateListingMutation();
  const [deleteListing] = useDeleteListingMutation();
  const [editId, setEditId]     = useState<string | null>(null);
  const [editData, setEditData] = useState({ pricePerUnit: 0, quantityAvailable: 0, status: "" });

  const saveEdit = async (id: string) => {
    await updateListing({ id, ...editData });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await deleteListing(id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Listings</h1>
      {isError && <p className="text-red-400 mb-4">Failed to load listings</p>}

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
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
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : listings.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No listings found</td></tr>
            ) : listings.map((l: any) => (
              <tr key={l.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                <td className="px-4 py-3 text-white font-medium">{l.crop?.name ?? l.cropId}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{l.farmer?.fullName ?? l.farmerId}</td>
                <td className="px-4 py-3">
                  {editId === l.id
                    ? <input type="number" value={editData.pricePerUnit} onChange={(e) => setEditData({ ...editData, pricePerUnit: Number(e.target.value) })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 w-24 text-sm focus:outline-none" />
                    : <span className="text-green-400 font-medium">{Number(l.pricePerUnit).toLocaleString()}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === l.id
                    ? <input type="number" value={editData.quantityAvailable} onChange={(e) => setEditData({ ...editData, quantityAvailable: Number(e.target.value) })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 w-24 text-sm focus:outline-none" />
                    : <span className="text-gray-300">{l.quantityAvailable}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === l.id
                    ? <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-xs focus:outline-none">
                        {["ACTIVE", "SOLD", "PAUSED"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    : <span className={`text-xs px-2 py-1 rounded-full border ${l.status === "ACTIVE" ? "bg-green-500/10 text-green-400 border-green-500/20" : l.status === "SOLD" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>{l.status}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === l.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(l.id)} className="text-green-400 hover:text-green-300"><Check size={15} /></button>
                      <button onClick={() => setEditId(null)} className="text-red-400 hover:text-red-300"><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditId(l.id); setEditData({ pricePerUnit: l.pricePerUnit, quantityAvailable: l.quantityAvailable, status: l.status }); }} className="text-gray-400 hover:text-white"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(l.id)} className="text-red-400 hover:text-red-300"><Trash2 size={15} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Listings;