import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetCropsQuery, useDeleteCropMutation } from "../../features/api/cropApi";

const Crops = () => {
  const { data, isLoading, isError } = useGetCropsQuery({});
  const crops: any[] = data?.data ?? [];
  const getCropId = (c: any): string =>
    String(c?.id ?? c?._id ?? c?.cropId ?? "").trim();
  const [deleteCrop] = useDeleteCropMutation();

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteCrop(id).unwrap();
      toast.success("Crop deleted");
    } catch {
      toast.error("Failed to delete crop");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Crops</h1>
      {isError && <p className="text-red-500 mb-4">Failed to load crops</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-xs uppercase">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Unit</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : crops.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">No crops found</td></tr>
            ) : crops.map((c: any, index: number) => {
              const cropId = getCropId(c);
              return (
              <tr key={cropId || `crop-row-${index}`} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <span className="text-gray-900 font-medium">{c.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-600">{c.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-600">{c.unit}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(cropId)}
                      disabled={!cropId}
                      title={!cropId ? "Missing crop ID" : "Delete crop"}
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

export default Crops;