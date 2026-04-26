import { useGetPaymentsQuery } from "../../features/api/paymentsApi";

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-700 border-green-200",
  FAILED:  "bg-red-100   text-red-700   border-red-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
};

const Payments = () => {
  const { data, isLoading, isError } = useGetPaymentsQuery({});
  const payments: any[] = data?.data ?? [];
  const getPaymentId = (p: any): string =>
    String(p?.id ?? p?._id ?? p?.paymentId ?? "").trim();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Payments</h1>
      {isError && <p className="text-red-500 mb-4">Failed to load payments</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-xs uppercase">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Amount (KES)</th>
              <th className="text-left px-4 py-3">Provider</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No payments found</td></tr>
            ) : payments.map((p: any, index: number) => {
              const paymentId = getPaymentId(p);
              return (
              <tr key={paymentId || `payment-row-${index}`} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{paymentId}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.orderId}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{Number(p.amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{p.provider}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[p.status] ?? ""}`}>{p.status}</span>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;