import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Plus, Pencil, Trash2, PackageSearch } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";

import type { RootState } from "../../app/store";
import { useGetCropsQuery } from "../../features/api/cropApi";
import {
  useGetListingsQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
} from "../../features/api/listingsApi";

interface ListingFormValues {
  cropId: string;
  pricePerUnit: number;
  quantityAvailable: number;
  description: string;
  location: string;
  status: string;
}

const ListingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const farmerId = user?.userId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  const { data: cropsRes } = useGetCropsQuery(undefined);
  const allCrops = cropsRes?.data ?? cropsRes ?? [];

  const { data: listingsRes, isLoading } = useGetListingsQuery(undefined);
  console.log("raw listings:", listingsRes);
  const allListings = listingsRes?.data ?? [];
  const myListings = allListings.filter(
    (l: any) => l.farmerId === farmerId || l.farmer?.userId === farmerId
  );

  const [createListing, { isLoading: isCreating }] = useCreateListingMutation();
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();
  const [deleteListing] = useDeleteListingMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ListingFormValues>({
    defaultValues: {
      cropId: "",
      pricePerUnit: 0,
      quantityAvailable: 0,
      description: "",
      location: "",
      status: "AVAILABLE",
    },
  });

  const openAdd = () => {
    setEditingListing(null);
    reset({ cropId: "", pricePerUnit: 0, quantityAvailable: 0, description: "", location: "", status: "AVAILABLE" });
    setIsModalOpen(true);
  };

  const openEdit = (listing: any) => {
    setEditingListing(listing);
    reset({
      cropId: listing.cropId,
      pricePerUnit: Number(listing.pricePerUnit),
      quantityAvailable: listing.quantityAvailable,
      description: listing.description ?? "",
      location: listing.location ?? "",
      status: listing.status ?? "AVAILABLE",
    });
    setIsModalOpen(true);
  };

  const onSubmit: SubmitHandler<ListingFormValues> = async (data) => {
    try {
      if (editingListing) {
        await updateListing({ id: editingListing.id, ...data }).unwrap();
      } else {
        await createListing({ ...data, farmerId }).unwrap();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to save listing");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    try {
      await deleteListing(id).unwrap();
    } catch {
      alert("Failed to delete listing");
    }
  };

  const isBusy = isCreating || isUpdating;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Listings</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage the crop listings visible to buyers in the marketplace
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-semibold"
        >
          <Plus size={16} /> Add Listing
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading listings...</div>
      ) : myListings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border p-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <PackageSearch size={32} className="text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No Listings Yet</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Click "Add Listing" to post a crop for sale in the marketplace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {myListings.map((listing: any) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
              {listing.crop?.cropUrl ? (
                <img src={listing.crop.cropUrl} alt={listing.crop?.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-green-50 flex items-center justify-center">
                  <PackageSearch size={40} className="text-green-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{listing.crop?.name ?? "Unknown Crop"}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    listing.status === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-0.5">{listing.crop?.category} · {listing.crop?.unit}</p>
                <p className="text-sm text-gray-700 font-semibold">
                  KES {Number(listing.pricePerUnit).toLocaleString()} / {listing.crop?.unit}
                </p>
                <p className="text-sm text-gray-500">Qty: {listing.quantityAvailable} {listing.crop?.unit}</p>
                {listing.location && <p className="text-sm text-gray-500">📍 {listing.location}</p>}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(listing)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium text-gray-700"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm bg-red-50 hover:bg-red-100 rounded-md transition font-medium text-red-600"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-green-700">
                {editingListing ? "Edit Listing" : "Add Listing"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Crop Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Crop</label>
                <select
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                  {...register("cropId", { required: "Please select a crop" })}
                >
                  <option value="">-- Select a crop --</option>
                  {allCrops.map((crop: any) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} ({crop.category} · {crop.unit})
                    </option>
                  ))}
                </select>
                {errors.cropId && <p className="text-red-600 text-sm mt-1">{errors.cropId.message}</p>}
                {allCrops.length === 0 && (
                  <p className="text-amber-600 text-sm mt-1">
                    No crops found. Please add crops first in the Crops page.
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Price Per Unit (KES)</label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...register("pricePerUnit", { required: "Price is required", min: { value: 1, message: "Price must be greater than 0" } })}
                />
                {errors.pricePerUnit && <p className="text-red-600 text-sm mt-1">{errors.pricePerUnit.message}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity Available</label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...register("quantityAvailable", { required: "Quantity is required", min: { value: 1, message: "Quantity must be greater than 0" } })}
                />
                {errors.quantityAvailable && <p className="text-red-600 text-sm mt-1">{errors.quantityAvailable.message}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Nairobi, Nakuru"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Fresh organic tomatoes harvested this week"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                  {...register("description")}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                  {...register("status")}
                >
                  <option value="ACTIVE">Active</option>
                   <option value="SOLD">Sold</option>
                  <option value="PAUSED">Paused</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-semibold"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-semibold disabled:opacity-60"
                >
                  <SaveIcon size={16} />
                  {isBusy ? "Saving..." : editingListing ? "Update Listing" : "Add Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;