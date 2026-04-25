// AdminOverview.tsx — platform-level statistics
import {
  Users,
  ShoppingBag,
  CreditCard,
  Wheat,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useGetAllUsersQuery } from "../../features/api/userApi";
import { useGetOrdersQuery } from "../../features/api/ordersApi";
import { useGetPaymentsQuery } from "../../features/api/paymentsApi";
import { useGetCropsQuery } from "../../features/api/cropApi";
import { useGetListingsQuery } from "../../features/api/listingsApi";

const AdminOverview = () => {
  const { data: usersRes, isLoading: loadingUsers } = useGetAllUsersQuery(undefined);
  const { data: ordersRes, isLoading: loadingOrders } = useGetOrdersQuery(undefined);
  const { data: paymentsRes, isLoading: loadingPayments } = useGetPaymentsQuery(undefined);
  const { data: cropsRes, isLoading: loadingCrops } = useGetCropsQuery(undefined);
  const { data: listingsRes, isLoading: loadingListings } = useGetListingsQuery(undefined);

  const users     = Array.isArray(usersRes?.data)    ? usersRes.data    : Array.isArray(usersRes)    ? usersRes    : [];
  const orders    = Array.isArray(ordersRes?.data)   ? ordersRes.data   : Array.isArray(ordersRes)   ? ordersRes   : [];
  const payments  = Array.isArray(paymentsRes?.data) ? paymentsRes.data : Array.isArray(paymentsRes) ? paymentsRes : [];
  const crops     = Array.isArray(cropsRes?.data)    ? cropsRes.data    : Array.isArray(cropsRes)    ? cropsRes    : [];
  const listings  = Array.isArray(listingsRes?.data) ? listingsRes.data : Array.isArray(listingsRes) ? listingsRes : [];

  const farmers   = users.filter((u: any) => u.role === "FARMER");
  const buyers    = users.filter((u: any) => u.role === "BUYER");

  const totalRevenue = payments
    .filter((p: any) => p.status === "COMPLETED" || p.status === "SUCCESS")
    .reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);

  const pendingOrders    = orders.filter((o: any) => o.status === "PENDING").length;
  const completedOrders  = orders.filter((o: any) => ["CONFIRMED", "AUTO_RELEASED"].includes(o.status)).length;
  const disputedOrders   = orders.filter((o: any) => o.status === "DISPUTED").length;

  const val = (loading: boolean, v: React.ReactNode) => (loading ? "..." : v);

  const stats = [
    {
      label: "Total Users",
      value: val(loadingUsers, users.length),
      sub: `${farmers.length} farmers · ${buyers.length} buyers`,
      icon: <Users size={22} className="text-blue-400" />,
      border: "border-blue-500/30",
      glow: "bg-blue-500/10",
      trend: "+",
    },
    {
      label: "Total Orders",
      value: val(loadingOrders, orders.length),
      sub: `${pendingOrders} pending · ${completedOrders} done`,
      icon: <ShoppingBag size={22} className="text-purple-400" />,
      border: "border-purple-500/30",
      glow: "bg-purple-500/10",
      trend: "",
    },
    {
      label: "Platform Revenue",
      value: val(loadingPayments, `KES ${totalRevenue.toLocaleString()}`),
      sub: `${payments.length} payment records`,
      icon: <CreditCard size={22} className="text-emerald-400" />,
      border: "border-emerald-500/30",
      glow: "bg-emerald-500/10",
      trend: "+",
    },
    {
      label: "Crop Listings",
      value: val(loadingListings, listings.length),
      sub: `${crops.length} crop types`,
      icon: <Wheat size={22} className="text-orange-400" />,
      border: "border-orange-500/30",
      glow: "bg-orange-500/10",
      trend: "",
    },
  ];

  // Recent orders
  const recentOrders = [...orders]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const statusStyle: Record<string, string> = {
    PENDING:      "bg-yellow-500/20 text-yellow-300",
    PAID:         "bg-blue-500/20 text-blue-300",
    RECEIVED:     "bg-indigo-500/20 text-indigo-300",
    SHIPPED:      "bg-orange-500/20 text-orange-300",
    CONFIRMED:    "bg-emerald-500/20 text-emerald-300",
    AUTO_RELEASED:"bg-emerald-500/20 text-emerald-300",
    CANCELLED:    "bg-red-500/20 text-red-300",
    DISPUTED:     "bg-red-500/20 text-red-300",
    REFUNDED:     "bg-gray-500/20 text-gray-400",
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Live metrics across the entire Agrisoko platform</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.border} bg-gray-800/60 backdrop-blur-sm p-5 flex flex-col gap-3 hover:shadow-lg hover:shadow-black/30 transition`}
          >
            <div className={`w-11 h-11 rounded-xl ${s.glow} flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-0.5">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick alerts */}
      {(disputedOrders > 0 || pendingOrders > 5) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {disputedOrders > 0 && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-300">
                <span className="font-bold">{disputedOrders}</span> disputed order{disputedOrders > 1 ? "s" : ""} need attention
              </p>
            </div>
          )}
          {pendingOrders > 5 && (
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
              <Activity size={18} className="text-yellow-400 shrink-0" />
              <p className="text-sm text-yellow-300">
                <span className="font-bold">{pendingOrders}</span> orders still pending payment
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order status breakdown + recent orders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Status breakdown */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            Order Status Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: "Pending",   count: pendingOrders,   color: "bg-yellow-500",  total: orders.length },
              { label: "Completed", count: completedOrders, color: "bg-emerald-500", total: orders.length },
              { label: "Disputed",  count: disputedOrders,  color: "bg-red-500",     total: orders.length },
            ].map(({ label, count, color, total }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{label}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`${color} h-1.5 rounded-full transition-all`}
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders table */}
        <div className="md:col-span-2 bg-gray-800/60 border border-gray-700/50 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Recent Orders
          </h3>
          {loadingOrders ? (
            <p className="text-gray-500 text-sm text-center py-8">Loading...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-700">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Buyer</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {recentOrders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-gray-700/30 transition">
                      <td className="py-2.5 font-mono text-xs text-gray-400">
                        #{o.id?.slice(0, 8)}
                      </td>
                      <td className="py-2.5 text-gray-300">{o.buyer?.fullName ?? "—"}</td>
                      <td className="py-2.5 text-emerald-400 font-semibold">
                        KES {Number(o.totalAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="py-2.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[o.status] ?? "bg-gray-700 text-gray-300"}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
