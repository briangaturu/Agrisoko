import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useGetOrdersQuery, useUpdateOrderMutation } from "../features/api/ordersApi";

const STATUS_STYLES: Record<string, string> = {
  PENDING:      "bg-amber-500/10  text-amber-400  border-amber-500/20",
  PAID:         "bg-blue-500/10   text-blue-400   border-blue-500/20",
  RECEIVED:     "bg-cyan-500/10   text-cyan-400   border-cyan-500/20",
  SHIPPED:      "bg-purple-500/10 text-purple-400 border-purple-500/20",
  DELIVERED:    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  CONFIRMED:    "bg-green-500/10  text-green-400  border-green-500/20",
  CANCELLED:    "bg-red-500/10    text-red-400    border-red-500/20",
  DISPUTED:     "bg-orange-500/10 text-orange-400 border-orange-500/20",
  REFUNDED:     "bg-pink-500/10   text-pink-400   border-pink-500/20",
  AUTO_RELEASED:"bg-teal-500/10   text-teal-400   border-teal-500/20",
};

const Orders = () => {
  const { data, isLoading, isError } = useGetOrdersQuery({});
  const orders: any[] = data?.data ?? [];
  const [updateOrder] = useUpdateOrderMutation();
  const [filter, setFilter]     = useState("all");
  const [editId, setEditId]     = useState<string | null>(null);
  const [editData, setEditData] = useState({ status: "" });

  const filtered = filter === "all" ? orders : orders.filter((o: any) => o.status === filter);

  const saveEdit = async (id: string) => {
    await updateOrder({ id, ...editData });
    setEditId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <div className="flex gap-2 flex-wrap">
          {["all", "PENDING", "PAID", "RECEIVED", "SHIPPED", "CONFIRMED", "CANCELLED"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition capitalize ${filter === s ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"}`}>
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isError && <p className="text-red-400 mb-4">Failed to load orders</p>}

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Buyer ID</th>
              <th className="text-left px-4 py-3">Total (KES)</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No orders found</td></tr>
            ) : filtered.map((o: any) => (
              <tr key={o.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{o.id}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{o.buyerId}</td>
                <td className="px-4 py-3 text-white font-medium">{Number(o.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {editId === o.id
                    ? <select value={editData.status} onChange={(e) => setEditData({ status: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-xs focus:outline-none">
                        {["PENDING","PAID","RECEIVED","SHIPPED","CONFIRMED","CANCELLED","DISPUTED","REFUNDED","AUTO_RELEASED"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    : <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[o.status] ?? ""}`}>{o.status}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === o.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(o.id)} className="text-green-400 hover:text-green-300"><Check size={15} /></button>
                      <button onClick={() => setEditId(null)} className="text-red-400 hover:text-red-300"><X size={15} /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(o.id); setEditData({ status: o.status }); }} className="text-gray-400 hover:text-white"><Pencil size={15} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;