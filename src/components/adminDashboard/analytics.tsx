import { Users, ShoppingBag, Package, Sprout, CreditCard } from "lucide-react";
import { useGetAllUsersQuery } from "../../features/api/userApi";
import { useGetOrdersQuery } from "../../features/api/ordersApi";
import { useGetListingsQuery } from "../../features/api/listingsApi";
import { useGetCropsQuery } from "../../features/api/cropApi";
import { useGetPaymentsQuery } from "../../features/api/paymentsApi";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const { data: usersData    } = useGetAllUsersQuery({});
  const { data: ordersData   } = useGetOrdersQuery({});
  const { data: listingsData } = useGetListingsQuery({});
  const { data: cropsData    } = useGetCropsQuery({});
  const { data: paymentsData } = useGetPaymentsQuery({});

  const users    : any[] = usersData?.data    ?? [];
  const orders   : any[] = ordersData?.data   ?? [];
  const listings : any[] = listingsData?.data ?? [];
  const crops    : any[] = cropsData?.data    ?? [];
  const payments : any[] = paymentsData?.data ?? [];
  const ordersMap = Object.fromEntries(orders.map((o: any) => [o.id, o]));

  const formatKes = (value: number) =>
    `KES ${Number(value || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

  // Calculate payment statistics
  const totalCommissionRevenue = payments
    .filter((p: any) => p.status === "SUCCESS")
    .reduce((sum: number, p: any) => {
      const order = ordersMap[p.orderId];
      const paidAmount = Number(p.amount ?? 0);
      const farmerAmount = Number(order?.farmerAmount ?? 0);
      const explicitCommission = Number(order?.commission ?? p?.commission ?? NaN);
      const commission = Number.isFinite(explicitCommission)
        ? explicitCommission
        : Math.max(0, paidAmount - farmerAmount);
      return sum + commission;
    }, 0);
  
  const pendingPayments = payments
    .filter((p: any) => p.status === "PENDING")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  const paymentStats = { SUCCESS: 0, PENDING: 0, FAILED: 0 };
  payments.forEach((p: any) => {
    paymentStats[p.status as keyof typeof paymentStats]++;
  });

  // Order status distribution
  const orderStatusStats: Record<string, number> = {};
  orders.forEach((o: any) => {
    orderStatusStats[o.status] = (orderStatusStats[o.status] || 0) + 1;
  });

  const orderChartData = Object.entries(orderStatusStats).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Payment provider distribution
  const paymentProviders: Record<string, number> = {};
  payments.forEach((p: any) => {
    paymentProviders[p.provider] = (paymentProviders[p.provider] || 0) + 1;
  });

  const providerChartData = Object.entries(paymentProviders).map(([provider, count]) => ({
    name: provider,
    value: count,
  }));

  const PIE_COLORS = ["#16a34a", "#f59e0b", "#ef4444", "#6366f1", "#06b6d4", "#a855f7", "#f97316", "#14b8a6"];

  const cards = [
    { label: "Total Users",    value: users.length,    icon: Users,       color: "text-green-700",   bg: "bg-green-50   border-green-200"   },
    { label: "Total Orders",   value: orders.length,   icon: ShoppingBag, color: "text-emerald-700",  bg: "bg-emerald-50  border-emerald-200"  },
    { label: "Total Listings", value: listings.length, icon: Package,     color: "text-green-600",  bg: "bg-green-50  border-green-200"  },
    { label: "Total Crops",    value: crops.length,    icon: Sprout,      color: "text-lime-700", bg: "bg-lime-50 border-lime-200" },
    { label: "Commission Revenue", value: formatKes(totalCommissionRevenue), icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-xl border p-5 ${bg}`}>
              <Icon size={20} className={`${color} mb-3`} />
              <p className="text-gray-500 text-xs mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        {orderChartData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Payment Provider Distribution */}
        {providerChartData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Methods</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={providerChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Payment Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
            <p className="text-2xl font-bold text-green-600">{paymentStats.SUCCESS}</p>
            <p className="text-xs text-gray-500 mt-2">Commission: {formatKes(totalCommissionRevenue)}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
            <p className="text-2xl font-bold text-amber-600">{paymentStats.PENDING}</p>
            <p className="text-xs text-gray-500 mt-2">Total: {formatKes(pendingPayments)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Failed Payments</p>
            <p className="text-2xl font-bold text-red-600">{paymentStats.FAILED}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;