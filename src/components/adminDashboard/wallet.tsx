import { useGetPaymentsQuery } from "../../features/api/paymentsApi";
import { useGetOrdersQuery } from "../../features/api/ordersApi";

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-700 border-green-200",
  FAILED:  "bg-red-100   text-red-700   border-red-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
};

const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING:      "bg-gray-100   text-gray-700   border-gray-200",
  PAID:         "bg-blue-100   text-blue-700   border-blue-200",
  RECEIVED:     "bg-cyan-100   text-cyan-700   border-cyan-200",
  SHIPPED:      "bg-purple-100 text-purple-700 border-purple-200",
  CONFIRMED:    "bg-green-100  text-green-700  border-green-200",
  CANCELLED:    "bg-red-100    text-red-700    border-red-200",
  DISPUTED:     "bg-orange-100 text-orange-700 border-orange-200",
  REFUNDED:     "bg-pink-100   text-pink-700   border-pink-200",
  AUTO_RELEASED:"bg-teal-100   text-teal-700   border-teal-200",
};

const Wallet = () => {
  const { data: paymentsData, isLoading: paymentsLoading, isError: paymentsError } = useGetPaymentsQuery({});
  const { data: ordersData,   isLoading: ordersLoading,   isError: ordersError   } = useGetOrdersQuery({});

  const payments: any[] = paymentsData?.data ?? [];
  const orders: any[]   = ordersData?.data   ?? [];

  const ordersMap = Object.fromEntries(orders.map((o: any) => [o.id, o]));

  const totalIn      = payments.filter((p: any) => p.status === "SUCCESS").reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const totalPending = payments.filter((p: any) => p.status === "PENDING").reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const inEscrow     = orders.filter((o: any) => ["PAID", "RECEIVED", "SHIPPED"].includes(o.status)).reduce((sum: number, o: any) => sum + Number(o.farmerAmount ?? 0), 0);
  const released     = orders.filter((o: any) => ["CONFIRMED", "AUTO_RELEASED"].includes(o.status)).reduce((sum: number, o: any) => sum + Number(o.farmerAmount ?? 0), 0);

  const isLoading = paymentsLoading || ordersLoading;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Wallet & Escrow</h1>

      {(paymentsError || ordersError) && (
        <p className="text-red-500 mb-4">Failed to load wallet data</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-green-50 border-green-200 p-5">
          <p className="text-gray-600 text-xs mb-1">Total Received (KES)</p>
          <p className="text-2xl font-bold text-green-600">{totalIn.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-5">
          <p className="text-gray-600 text-xs mb-1">Pending (KES)</p>
          <p className="text-2xl font-bold text-amber-600">{totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-blue-50 border-blue-200 p-5">
          <p className="text-gray-600 text-xs mb-1">In Escrow (KES)</p>
          <p className="text-2xl font-bold text-blue-600">{inEscrow.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-teal-50 border-teal-200 p-5">
          <p className="text-gray-600 text-xs mb-1">Released to Farmers (KES)</p>
          <p className="text-2xl font-bold text-teal-600">{released.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">All Transactions</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-xs uppercase">
              <th className="text-left px-4 py-3">Payment ID</th>
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Amount (KES)</th>
              <th className="text-left px-4 py-3">Provider</th>
              <th className="text-left px-4 py-3">Payment Status</th>
              <th className="text-left px-4 py-3">Order Status</th>
              <th className="text-left px-4 py-3">Farmer Amount (KES)</th>
              <th className="text-left px-4 py-3">Escrow</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-400">No transactions found</td></tr>
            ) : payments.map((p: any) => {
              const order = ordersMap[p.orderId];
              const escrowStatus =
                !order ? "—"
                : ["CONFIRMED", "AUTO_RELEASED"].includes(order.status) ? "Released"
                : ["PAID", "RECEIVED", "SHIPPED"].includes(order.status) ? "Held"
                : ["CANCELLED", "REFUNDED"].includes(order.status) ? "Refunded"
                : "—";

              const escrowColor =
                escrowStatus === "Released" ? "text-green-600"
                : escrowStatus === "Held"     ? "text-blue-600"
                : escrowStatus === "Refunded" ? "text-pink-600"
                : "text-gray-500";

              return (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.orderId}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{p.provider}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[p.status] ?? ""}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {order
                      ? <span className={`text-xs px-2 py-1 rounded-full border ${ORDER_STATUS_STYLES[order.status] ?? ""}`}>{order.status}</span>
                      : <span className="text-gray-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {order?.farmerAmount ? Number(order.farmerAmount).toLocaleString() : "—"}
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium ${escrowColor}`}>{escrowStatus}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;