import { useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { useGetCropsQuery, useUpdateCropMutation, useDeleteCropMutation } from "../features/api/cropApi";

const Crops = () => {
  const { data, isLoading, isError } = useGetCropsQuery({});
  const crops: any[] = data?.data ?? [];
  const [updateCrop] = useUpdateCropMutation();
  const [deleteCrop] = useDeleteCropMutation();
  const [editId, setEditId]     = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", category: "", unit: "" });

  const saveEdit = async (id: string) => {
    await updateCrop({ id, ...editData });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this crop?")) return;
    await deleteCrop(id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Crops</h1>
      {isError && <p className="text-red-400 mb-4">Failed to load crops</p>}

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Unit</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : crops.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No crops found</td></tr>
            ) : crops.map((c: any) => (
              <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                <td className="px-4 py-3">
                  {editId === c.id
                    ? <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-sm w-32 focus:outline-none" />
                    : <span className="text-white font-medium">{c.name}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === c.id
                    ? <input value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-sm w-32 focus:outline-none" />
                    : <span className="text-gray-400">{c.category}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === c.id
                    ? <input value={editData.unit} onChange={(e) => setEditData({ ...editData, unit: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-sm w-24 focus:outline-none" />
                    : <span className="text-gray-400">{c.unit}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === c.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(c.id)} className="text-green-400 hover:text-green-300"><Check size={15} /></button>
                      <button onClick={() => setEditId(null)} className="text-red-400 hover:text-red-300"><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditId(c.id); setEditData({ name: c.name, category: c.category, unit: c.unit }); }} className="text-gray-400 hover:text-white"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300"><Trash2 size={15} /></button>
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

export default Crops;