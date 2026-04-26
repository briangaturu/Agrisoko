import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useGetOrdersQuery, useUpdateOrderMutation } from "../../features/api/ordersApi";

const STATUS_STYLES: Record<string, string> = {
  PENDING:      "bg-amber-100  text-amber-700  border-amber-200",
  PAID:         "bg-blue-100   text-blue-700   border-blue-200",
  RECEIVED:     "bg-cyan-100   text-cyan-700   border-cyan-200",
  SHIPPED:      "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED:    "bg-indigo-100 text-indigo-700 border-indigo-200",
  CONFIRMED:    "bg-green-100  text-green-700  border-green-200",
  CANCELLED:    "bg-red-100    text-red-700    border-red-200",
  DISPUTED:     "bg-orange-100 text-orange-700 border-orange-200",
  REFUNDED:     "bg-pink-100   text-pink-700   border-pink-200",
  AUTO_RELEASED:"bg-teal-100   text-teal-700   border-teal-200",
};

const Orders = () => {
  const { data, isLoading, isError } = useGetOrdersQuery({});
  const orders: any[] = data?.data ?? [];
  const getOrderId = (o: any): string =>
    String(o?.id ?? o?._id ?? o?.orderId ?? "").trim();
  const [updateOrder] = useUpdateOrderMutation();
  const [filter, setFilter]     = useState("all");
  const [editId, setEditId]     = useState<string | null>(null);
  const [editData, setEditData] = useState({ status: "" });

  const filtered = filter === "all" ? orders : orders.filter((o: any) => o.status === filter);

  const saveEdit = async (id: string) => {
    if (!id) return;
    await updateOrder({ id, ...editData });
    setEditId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex gap-2 flex-wrap">
          {["all", "PENDING", "PAID", "RECEIVED", "SHIPPED", "CONFIRMED", "CANCELLED"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition capitalize ${filter === s ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200 hover:text-gray-900"}`}>
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isError && <p className="text-red-500 mb-4">Failed to load orders</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-xs uppercase">
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Buyer ID</th>
              <th className="text-left px-4 py-3">Total (KES)</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No orders found</td></tr>
            ) : filtered.map((o: any, index: number) => {
              const orderId = getOrderId(o);
              return (
              <tr key={orderId || `order-row-${index}`} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{orderId}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{o.buyerId}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{Number(o.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {editId === orderId
                    ? <select value={editData.status} onChange={(e) => setEditData({ status: e.target.value })} className="bg-gray-50 border border-green-500 text-gray-900 rounded px-2 py-1 text-xs focus:outline-none">
                        {["PENDING","PAID","RECEIVED","SHIPPED","CONFIRMED","CANCELLED","DISPUTED","REFUNDED","AUTO_RELEASED"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    : <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[o.status] ?? ""}`}>{o.status}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === orderId ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(orderId)} className="text-green-600 hover:text-green-700"><Check size={15} /></button>
                      <button onClick={() => setEditId(null)} className="text-red-600 hover:text-red-700"><X size={15} /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { if (!orderId) return; setEditId(orderId); setEditData({ status: o.status }); }}
                      disabled={!orderId}
                      title={!orderId ? "Missing order ID" : "Edit order"}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;