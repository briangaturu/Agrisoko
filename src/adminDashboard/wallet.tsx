import { useGetPaymentsQuery } from "../features/api/paymentsApi";
import { useGetOrdersQuery } from "../features/api/ordersApi";

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "bg-green-500/10 text-green-400 border-green-500/20",
  FAILED:  "bg-red-500/10   text-red-400   border-red-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING:      "bg-gray-500/10   text-gray-400   border-gray-500/20",
  PAID:         "bg-blue-500/10   text-blue-400   border-blue-500/20",
  RECEIVED:     "bg-cyan-500/10   text-cyan-400   border-cyan-500/20",
  SHIPPED:      "bg-purple-500/10 text-purple-400 border-purple-500/20",
  CONFIRMED:    "bg-green-500/10  text-green-400  border-green-500/20",
  CANCELLED:    "bg-red-500/10    text-red-400    border-red-500/20",
  DISPUTED:     "bg-orange-500/10 text-orange-400 border-orange-500/20",
  REFUNDED:     "bg-pink-500/10   text-pink-400   border-pink-500/20",
  AUTO_RELEASED:"bg-teal-500/10   text-teal-400   border-teal-500/20",
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
      <h1 className="text-2xl font-bold text-white mb-6">Wallet & Escrow</h1>

      {(paymentsError || ordersError) && (
        <p className="text-red-400 mb-4">Failed to load wallet data</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-green-500/10 border-green-500/20 p-5">
          <p className="text-gray-400 text-xs mb-1">Total Received (KES)</p>
          <p className="text-2xl font-bold text-green-400">{totalIn.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-amber-500/10 border-amber-500/20 p-5">
          <p className="text-gray-400 text-xs mb-1">Pending (KES)</p>
          <p className="text-2xl font-bold text-amber-400">{totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-blue-500/10 border-blue-500/20 p-5">
          <p className="text-gray-400 text-xs mb-1">In Escrow (KES)</p>
          <p className="text-2xl font-bold text-blue-400">{inEscrow.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-teal-500/10 border-teal-500/20 p-5">
          <p className="text-gray-400 text-xs mb-1">Released to Farmers (KES)</p>
          <p className="text-2xl font-bold text-teal-400">{released.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-white mb-3">All Transactions</h2>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
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
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">No transactions found</td></tr>
            ) : payments.map((p: any) => {
              const order = ordersMap[p.orderId];
              const escrowStatus =
                !order ? "—"
                : ["CONFIRMED", "AUTO_RELEASED"].includes(order.status) ? "Released"
                : ["PAID", "RECEIVED", "SHIPPED"].includes(order.status) ? "Held"
                : ["CANCELLED", "REFUNDED"].includes(order.status) ? "Refunded"
                : "—";

              const escrowColor =
                escrowStatus === "Released" ? "text-green-400"
                : escrowStatus === "Held"     ? "text-blue-400"
                : escrowStatus === "Refunded" ? "text-pink-400"
                : "text-gray-500";

              return (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.orderId}</td>
                  <td className="px-4 py-3 text-white font-medium">{Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400">{p.provider}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[p.status] ?? ""}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {order
                      ? <span className={`text-xs px-2 py-1 rounded-full border ${ORDER_STATUS_STYLES[order.status] ?? ""}`}>{order.status}</span>
                      : <span className="text-gray-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {order?.farmerAmount ? Number(order.farmerAmount).toLocaleString() : "—"}
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium ${escrowColor}`}>{escrowStatus}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
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