// FarmerDashboard.tsx
import { useSelector } from "react-redux";
import { ShoppingBag, CreditCard, Wheat, TrendingUp, Package, Truck, CheckCircle, Clock } from "lucide-react";
import type { RootState } from "../app/store";
import { useGetCropsQuery } from "../features/api/cropApi";
import { useGetOrdersQuery } from "../features/api/ordersApi";
import { useGetPaymentsQuery } from "../features/api/paymentsApi";

const FarmerDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const farmerId = user?.userId;

  const { data: cropsRes, isLoading: isLoadingCrops } = useGetCropsQuery(undefined);
  const { data: ordersRes, isLoading: isLoadingOrders } = useGetOrdersQuery(undefined);
  const { data: paymentsRes, isLoading: isLoadingPayments } = useGetPaymentsQuery(undefined);

  // ── Crops ──────────────────────────────────────────────────
  const allCrops = cropsRes?.data ?? cropsRes ?? [];
  const totalCrops = allCrops.length;

  // ── Orders (filtered to this farmer) ──────────────────────
  const allOrders = Array.isArray(ordersRes?.data) ? ordersRes.data : Array.isArray(ordersRes) ? ordersRes : [];
  const farmerOrders = allOrders.filter((order: any) =>
    order.items?.some((item: any) => item.listing?.farmer?.userId === farmerId)
  );

  const totalOrders = farmerOrders.length;
  const pendingOrders = farmerOrders.filter((o: any) => o.status === "PENDING").length;
  const receivedOrders = farmerOrders.filter((o: any) => o.status === "RECEIVED").length;
  const shippedOrders = farmerOrders.filter((o: any) => o.status === "SHIPPED").length;
  const completedOrders = farmerOrders.filter((o: any) => ["CONFIRMED", "AUTO_RELEASED"].includes(o.status)).length;

  // ── Payments (for this farmer's orders) ───────────────────
  const farmerOrderIds = new Set(farmerOrders.map((o: any) => o.id));
  const allPayments = Array.isArray(paymentsRes?.data) ? paymentsRes.data : Array.isArray(paymentsRes) ? paymentsRes : [];
  const farmerPayments = allPayments.filter((p: any) => farmerOrderIds.has(p.orderId));

  const totalEarned = farmerOrders
    .filter((o: any) => ["CONFIRMED", "AUTO_RELEASED"].includes(o.status))
    .reduce((sum: number, o: any) => sum + Number(o.farmerAmount ?? o.totalAmount ?? 0), 0);

  const totalRevenue = farmerOrders
    .filter((o: any) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .reduce((sum: number, o: any) => sum + Number(o.totalAmount ?? 0), 0);

  // ── Most ordered crops ─────────────────────────────────────
  const cropCount: Record<string, { name: string; count: number; url?: string }> = {};
  farmerOrders.forEach((order: any) => {
    order.items?.forEach((item: any) => {
      const cropName = item.listing?.crop?.name;
      if (!cropName) return;
      if (!cropCount[cropName]) {
        cropCount[cropName] = { name: cropName, count: 0, url: item.listing?.crop?.cropUrl };
      }
      cropCount[cropName].count += Number(item.quantity ?? 1);
    });
  });
  const topCrops = Object.values(cropCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ── Recent orders ──────────────────────────────────────────
  const recentOrders = [...farmerOrders]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-blue-100 text-blue-700",
    RECEIVED: "bg-indigo-100 text-indigo-700",
    SHIPPED: "bg-orange-100 text-orange-700",
    CONFIRMED: "bg-green-100 text-green-700",
    AUTO_RELEASED: "bg-purple-100 text-purple-700",
    CANCELLED: "bg-red-100 text-red-700",
    DISPUTED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-600",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    RECEIVED: "Received",
    SHIPPED: "Shipped",
    CONFIRMED: "Completed",
    AUTO_RELEASED: "Completed",
    CANCELLED: "Cancelled",
    DISPUTED: "Disputed",
    REFUNDED: "Refunded",
  };

  const loading = (flag: boolean) => flag ? "..." : undefined;

  const stats = [
    {
      label: "Total Orders",
      value: loading(isLoadingOrders) ?? totalOrders,
      icon: <ShoppingBag size={24} className="text-blue-500" />,
      bg: "bg-blue-50",
      badge: totalOrders > 0 ? `${pendingOrders} pending` : "No orders yet",
      badgeColor: pendingOrders > 0 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500",
    },
    {
      label: "Total Revenue",
      value: loading(isLoadingOrders) ?? `KES ${totalRevenue.toLocaleString()}`,
      icon: <CreditCard size={24} className="text-purple-500" />,
      bg: "bg-purple-50",
      badge: `KES ${totalEarned.toLocaleString()} earned`,
      badgeColor: "bg-purple-100 text-purple-600",
    },
    {
      label: "Crops Listed",
      value: loading(isLoadingCrops) ?? totalCrops,
      icon: <Wheat size={24} className="text-green-500" />,
      bg: "bg-green-50",
      badge: "Live",
      badgeColor: "bg-green-100 text-green-700",
    },
    {
      label: "Completed Orders",
      value: loading(isLoadingOrders) ?? completedOrders,
      icon: <CheckCircle size={24} className="text-orange-500" />,
      bg: "bg-orange-50",
      badge: `${shippedOrders} in transit`,
      badgeColor: shippedOrders > 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500",
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.fullName ?? user?.email} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's an overview of your farm activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-3 hover:shadow-md transition">
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

      {/* Order Status Breakdown + Top Crops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={18} className="text-blue-500" /> Order Status Breakdown
          </h3>
          {isLoadingOrders ? (
            <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
          ) : totalOrders === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <ShoppingBag size={28} className="text-gray-300" />
              <p className="text-gray-400 text-sm">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Pending Payment", count: pendingOrders, color: "bg-yellow-400", icon: <Clock size={14} className="text-yellow-600" /> },
                { label: "Received", count: receivedOrders, color: "bg-indigo-400", icon: <Package size={14} className="text-indigo-600" /> },
                { label: "Shipped", count: shippedOrders, color: "bg-orange-400", icon: <Truck size={14} className="text-orange-600" /> },
                { label: "Completed", count: completedOrders, color: "bg-green-400", icon: <CheckCircle size={14} className="text-green-600" /> },
              ].map(({ label, count, color, icon }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">{icon}{label}</span>
                    <span className="text-sm font-semibold text-gray-700">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`${color} h-1.5 rounded-full transition-all`}
                      style={{ width: totalOrders > 0 ? `${(count / totalOrders) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Ordered Crops */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" /> Most Ordered Crops
          </h3>
          {isLoadingOrders ? (
            <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
          ) : topCrops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <Wheat size={28} className="text-gray-300" />
              <p className="text-gray-400 text-sm">No order data yet. Crop rankings will appear once orders come in.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCrops.map((crop, i) => (
                <div key={crop.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  {crop.url ? (
                    <img src={crop.url} alt={crop.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Wheat size={14} className="text-green-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-sm font-medium text-gray-700">{crop.name}</span>
                      <span className="text-xs text-gray-400">{crop.count} kg</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-orange-400 h-1.5 rounded-full"
                        style={{ width: `${(crop.count / topCrops[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBag size={18} className="text-blue-500" /> Recent Orders
        </h3>
        {isLoadingOrders ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <ShoppingBag size={28} className="text-gray-300" />
            <p className="text-gray-400 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b">
                  <th className="pb-2 font-medium">Order ID</th>
                  <th className="pb-2 font-medium">Buyer</th>
                  <th className="pb-2 font-medium">Crop</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}...</td>
                    <td className="py-3 text-gray-700">{order.buyer?.fullName ?? "—"}</td>
                    <td className="py-3 text-gray-600">
                      {order.items?.map((i: any) => i.listing?.crop?.name).filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="py-3 font-semibold text-green-700">
                      KES {Number(order.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;