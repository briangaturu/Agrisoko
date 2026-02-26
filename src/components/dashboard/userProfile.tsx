import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";


import type { RootState}  from "../../app/store";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../features/api/userApi";

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // ✅ Your authSlice stores: user = { userId, email }
  const userId = user?.userId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalToggle = () => setIsModalOpen((v) => !v);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  // ✅ Fetch user details from backend: GET /api/users/:id
  const {
    data: userRes,
    isLoading: isLoadingUser,
    refetch,
  } = useGetUserByIdQuery(userId as string, { skip: !userId });

  // depending on your backend response shape:
  // { message, data: user }
  const userData = userRes?.data;

  const profilePicture = useMemo(() => {
    const name = userData?.fullName || user?.email || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=16a34a&color=fff&size=128`;
  }, [userData?.fullName, user?.email]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.fullName ?? "",
        email: userData.email ?? "",
        phone: userData.phone ?? "",
      });
    }
  }, [userData, reset]);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!userId) return;

    try {
      await updateUser({
        id: userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      }).unwrap();

      await refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto rounded-xl shadow-sm bg-white p-6">
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-5 mb-5">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-green-600"
            />

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLoadingUser ? "Loading..." : userData?.fullName ?? "User"}
              </h2>
              <p className="text-gray-600">{userData?.email ?? user?.email}</p>
              {userData?.phone && <p className="text-gray-600">{userData.phone}</p>}
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center gap-2"
            onClick={handleModalToggle}
            disabled={isLoadingUser}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl p-5 border">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Personal Information
            </h3>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Full Name:</span>{" "}
              {userData?.fullName ?? "-"}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {userData?.email ?? "-"}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Phone:</span>{" "}
              {userData?.phone ?? "-"}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Role:</span>{" "}
              {userData?.role ?? "-"}
            </p>
          </div>

          <div className="rounded-xl p-5 border">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Security
            </h3>
            <p className="mb-3 text-gray-700">
              <span className="font-semibold">Password:</span> ********
            </p>
            <p className="text-sm text-gray-500">
              Password change is handled via “Forgot password” / reset flow.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-2xl font-bold text-green-600">
                Edit Profile
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...register("fullName", { required: "Full name is required" })}
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-100"
                  disabled
                  {...register("email", { required: "Email is required" })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-60"
                >
                  <SaveIcon size={18} />
                  {isUpdating ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;