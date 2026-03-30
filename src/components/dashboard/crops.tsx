// CropsPage.tsx
import { useState, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Wheat, Plus, Pencil, Trash2, ImagePlus, X } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";

import {
  useGetCropsQuery,
  useCreateCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
} from "../../features/api/cropApi";

const CLOUD_NAME = "dji3abnhv";
const UPLOAD_PRESET = "agrisoko";

interface CropFormValues {
  name: string;
  category: string;
  unit: string;
}

const Crops = () => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: cropsRes, isLoading } = useGetCropsQuery(undefined);
  const allCrops = cropsRes?.data ?? cropsRes ?? [];

  const [createCrop, { isLoading: isCreating }] = useCreateCropMutation();
  const [updateCrop, { isLoading: isUpdatingCrop }] = useUpdateCropMutation();
  const [deleteCrop] = useDeleteCropMutation();

  const cropForm = useForm<CropFormValues>({
    defaultValues: { name: "", category: "", unit: "" },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const openAddCrop = () => {
    setEditingCrop(null);
    cropForm.reset({ name: "", category: "", unit: "" });
    clearImage();
    setIsCropModalOpen(true);
  };

  const openEditCrop = (crop: any) => {
    setEditingCrop(crop);
    cropForm.reset({ name: crop.name, category: crop.category, unit: crop.unit });
    setImagePreview(crop.cropUrl ?? null);
    setImageFile(null);
    setIsCropModalOpen(true);
  };

  const onCropSubmit: SubmitHandler<CropFormValues> = async (data) => {
    try {
      setIsUploading(true);
      let cropUrl = editingCrop?.cropUrl ?? "";

      // Upload new image if one was selected
      if (imageFile) {
        cropUrl = await uploadToCloudinary(imageFile);
      }

      if (editingCrop) {
        await updateCrop({ id: editingCrop.id ?? editingCrop._id, ...data, cropUrl }).unwrap();
      } else {
        await createCrop({ ...data, cropUrl }).unwrap();
      }

      setIsCropModalOpen(false);
      clearImage();
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to save crop");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!confirm("Delete this crop?")) return;
    try {
      await deleteCrop(id).unwrap();
    } catch {
      alert("Failed to delete crop");
    }
  };

  const isBusy = isUploading || isCreating || isUpdatingCrop;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Crops</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage the crops you've posted to the marketplace</p>
        </div>
        <button
          onClick={openAddCrop}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-semibold"
        >
          <Plus size={16} /> Add Crop
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading crops...</div>
      ) : allCrops.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border p-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <Wheat size={32} className="text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No Crops Yet</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Click "Add Crop" to post your first crop to the marketplace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {allCrops.map((crop: any) => (
            <div
              key={crop.id ?? crop._id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition"
            >
              {crop.cropUrl ? (
                <img src={crop.cropUrl} alt={crop.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-green-50 flex items-center justify-center">
                  <Wheat size={40} className="text-green-300" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{crop.name}</h3>
                <p className="text-sm text-gray-500">{crop.category} · {crop.unit}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEditCrop(crop)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium text-gray-700"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCrop(crop.id ?? crop._id)}
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

      {/* Crop Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-green-700">
                {editingCrop ? "Edit Crop" : "Add Crop"}
              </h2>
              <button
                onClick={() => setIsCropModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={cropForm.handleSubmit(onCropSubmit)} className="space-y-4">

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-green-500 transition flex items-center justify-center bg-gray-50"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearImage(); }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ImagePlus size={32} />
                      <p className="text-sm">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Crop Name</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...cropForm.register("name", { required: "Name is required" })}
                />
                {cropForm.formState.errors.name && (
                  <p className="text-red-600 text-sm mt-1">{cropForm.formState.errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetables, Grains"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...cropForm.register("category", { required: "Category is required" })}
                />
                {cropForm.formState.errors.category && (
                  <p className="text-red-600 text-sm mt-1">{cropForm.formState.errors.category.message}</p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. kg, bag, crate"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...cropForm.register("unit", { required: "Unit is required" })}
                />
                {cropForm.formState.errors.unit && (
                  <p className="text-red-600 text-sm mt-1">{cropForm.formState.errors.unit.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
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
                  {isUploading ? "Uploading..." : isBusy ? "Saving..." : editingCrop ? "Update Crop" : "Add Crop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crops;