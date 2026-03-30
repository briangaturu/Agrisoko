import { useSelector } from "react-redux";
import { CreditCard } from "lucide-react";
import type { RootState } from "../../app/store";
import { useGetOrdersByBuyerQuery } from "../../features/api/ordersApi";

const statusColors: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-700",
  FAILED:  "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
};

const Payments = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const buyerId = user?.userId;

  // Fetch orders which include payments
  const { data, isLoading, isError } = useGetOrdersByBuyerQuery(
    buyerId as string,
    { skip: !buyerId }
  );

  const orders = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  // Extract all payments from orders
  const payments = orders.flatMap((order: any) =>
    (order.payments ?? []).map((payment: any) => ({
      ...payment,
      orderTotal: order.totalAmount,
      orderId: order.id,
    }))
  );

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading payments...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">Failed to load payments.</div>;

  if (payments.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm border p-16 flex flex-col items-center text-center gap-4 max-w-md w-full">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CreditCard size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Payments Yet</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            You haven't made any payments yet. Place an order from the marketplace to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Payments</h2>
        <p className="text-sm text-gray-400 mt-0.5">Your payment history</p>
      </div>

      <div className="space-y-4">
        {payments.map((payment: any) => (
          <div key={payment.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <CreditCard size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{payment.provider}</p>
                  <p className="text-xs text-gray-400">Order #{payment.orderId}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[payment.status] ?? "bg-gray-100 text-gray-600"}`}>
                {payment.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-xs text-gray-400">Transaction Ref</p>
                <p className="font-mono text-xs text-gray-600 truncate max-w-[200px]">
                  {payment.transactionRef ?? "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Amount</p>
                <p className="font-bold text-green-700">
                  KES {Number(payment.amount).toLocaleString()}
                </p>
              </div>
            </div>

            {payment.createdAt && (
              <p className="text-xs text-gray-400 mt-2">
                {new Date(payment.createdAt).toLocaleDateString("en-KE", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;