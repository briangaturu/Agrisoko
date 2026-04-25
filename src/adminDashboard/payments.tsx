import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useGetPaymentsQuery, useUpdatePaymentMutation } from "../features/api/paymentsApi";

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "bg-green-500/10 text-green-400 border-green-500/20",
  FAILED:  "bg-red-500/10   text-red-400   border-red-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const Payments = () => {
  const { data, isLoading, isError } = useGetPaymentsQuery({});
  const payments: any[] = data?.data ?? [];
  const [updatePayment] = useUpdatePaymentMutation();
  const [editId, setEditId]     = useState<string | null>(null);
  const [editData, setEditData] = useState({ status: "" });

  const saveEdit = async (id: string) => {
    await updatePayment({ id, ...editData });
    setEditId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Payments</h1>
      {isError && <p className="text-red-400 mb-4">Failed to load payments</p>}

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Amount (KES)</th>
              <th className="text-left px-4 py-3">Provider</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No payments found</td></tr>
            ) : payments.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.id}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.orderId}</td>
                <td className="px-4 py-3 text-white font-medium">{Number(p.amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-400">{p.provider}</td>
                <td className="px-4 py-3">
                  {editId === p.id
                    ? <select value={editData.status} onChange={(e) => setEditData({ status: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-xs focus:outline-none">
                        {["PENDING", "SUCCESS", "FAILED"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    : <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[p.status] ?? ""}`}>{p.status}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === p.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(p.id)} className="text-green-400 hover:text-green-300"><Check size={15} /></button>
                      <button onClick={() => setEditId(null)} className="text-red-400 hover:text-red-300"><X size={15} /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(p.id); setEditData({ status: p.status }); }} className="text-gray-400 hover:text-white"><Pencil size={15} /></button>
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

export default Payments;