// FarmerDashboard.tsx
import { useSelector } from "react-redux";
import { ShoppingBag, CreditCard, Wheat, TrendingUp } from "lucide-react";
import type { RootState } from "../app/store";
import { useGetCropsQuery } from "../features/api/cropApi";

const FarmerDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: cropsRes, isLoading: isLoadingCrops } = useGetCropsQuery(undefined);
  const allCrops = cropsRes?.data ?? cropsRes ?? [];
  const totalCrops = allCrops.length;

  const stats = [
    {
      label: "Total Orders",
      value: "Coming Soon",
      icon: <ShoppingBag size={24} className="text-blue-500" />,
      bg: "bg-blue-50",
      badge: "In Development",
      badgeColor: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Payments",
      value: "Coming Soon",
      icon: <CreditCard size={24} className="text-purple-500" />,
      bg: "bg-purple-50",
      badge: "In Development",
      badgeColor: "bg-purple-100 text-purple-600",
    },
    {
      label: "Crops Listed",
      value: isLoadingCrops ? "..." : totalCrops,
      icon: <Wheat size={24} className="text-green-500" />,
      bg: "bg-green-50",
      badge: "Live",
      badgeColor: "bg-green-100 text-green-700",
    },
    {
      label: "Most Ordered Crop",
      value: "Coming Soon",
      icon: <TrendingUp size={24} className="text-orange-500" />,
      bg: "bg-orange-50",
      badge: "In Development",
      badgeColor: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.fullName ?? user?.email} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here's an overview of your farm activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-3 hover:shadow-md transition"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${stat.badgeColor}`}>
              {stat.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Most Ordered Crop Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" /> Most Ordered Crops
          </h3>
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm">Order analytics will appear here once the orders API is ready.</p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
              In Development
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-purple-500" /> Payment Summary
          </h3>
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <CreditCard size={24} className="text-purple-300" />
            </div>
            <p className="text-gray-400 text-sm">Payment summaries will appear here once the payments API is ready.</p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
              In Development
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;