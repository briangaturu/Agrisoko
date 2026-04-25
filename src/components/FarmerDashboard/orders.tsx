import { useState } from "react";
import { useSelector } from "react-redux";
import { ShoppingBag, Truck, CheckCircle, Clock, PackageCheck } from "lucide-react";
import type { RootState } from "../../app/store";
import {
  useGetOrdersQuery,
  useConfirmOrderReceivedMutation,
  useUpdateOrderMutation,
} from "../../features/api/ordersApi";

const statusColors: Record<string, string> = {
  PENDING:       "bg-yellow-100 text-yellow-700",
  PAID:          "bg-blue-100 text-blue-700",
  RECEIVED:      "bg-indigo-100 text-indigo-700",
  SHIPPED:       "bg-orange-100 text-orange-700",
  DELIVERED:     "bg-orange-100 text-orange-700",
  CONFIRMED:     "bg-green-100 text-green-700",
  CANCELLED:     "bg-red-100 text-red-700",
  DISPUTED:      "bg-red-100 text-red-700",
  REFUNDED:      "bg-gray-100 text-gray-600",
  AUTO_RELEASED: "bg-purple-100 text-purple-700",
};

const statusLabels: Record<string, string> = {
  PENDING:       "Pending Payment",
  PAID:          "Paid",
  RECEIVED:      "Received",
  SHIPPED:       "Shipped",
  DELIVERED:     "Delivered · Awaiting Confirmation",
  CONFIRMED:     "Completed · Payment Released",
  CANCELLED:     "Cancelled",
  DISPUTED:      "Disputed",
  REFUNDED:      "Refunded",
  AUTO_RELEASED: "Auto Released",
};

const FarmerOrders = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const farmerId = user?.userId;

  const { data, isLoading, isError, refetch } = useGetOrdersQuery(undefined);
  const [confirmOrderReceived, { isLoading: isConfirming }] = useConfirmOrderReceivedMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [actionOrderId, setActionOrderId] = useState<string | null>(null);

  const allOrders = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const farmerOrders = allOrders.filter((order: any) =>
    order.items?.some((item: any) => item.listing?.farmer?.userId === farmerId)
  );

  // Farmer marks order as RECEIVED (acknowledged)
  const handleMarkReceived = async (orderId: string) => {
    const ok = window.confirm("Mark this order as received? The buyer will be notified.");
    if (!ok) return;
    setActionOrderId(orderId);
    try {
      await updateOrder({ id: orderId, status: "RECEIVED" }).unwrap();
      refetch();
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to update order");
    } finally {
      setActionOrderId(null);
    }
  };

  // Farmer marks order as SHIPPED
  const handleMarkShipped = async (orderId: string) => {
    const ok = window.confirm("Mark this order as shipped? The buyer will be notified to confirm delivery.");
    if (!ok) return;
    setActionOrderId(orderId);
    try {
      await updateOrder({ id: orderId, status: "SHIPPED" }).unwrap();
      refetch();
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to update order");
    } finally {
      setActionOrderId(null);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading orders...</div>;
  if (isError)   return <div className="text-center py-20 text-red-500">Failed to load orders.</div>;

  if (farmerOrders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm border p-16 flex flex-col items-center text-center gap-4 max-w-md w-full">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Orders Yet</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            You haven't received any orders yet. Once buyers purchase your listings, they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage and fulfil your orders</p>
      </div>

      <div className="space-y-4">
        {farmerOrders.map((order: any) => {
          const isPaid = ["PAID", "DELIVERED", "RECEIVED", "SHIPPED", "CONFIRMED", "AUTO_RELEASED"].includes(order.status) || order.paymentStatus === "PAID";

          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">

              {/* Header */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-700">#{order.id.slice(0, 8)}...</p>
                </div>

                {/* Status badge + Paid indicator */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  {isPaid && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle size={11} /> Paid
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.listing?.crop?.cropUrl ? (
                      <img
                        src={item.listing.crop.cropUrl}
                        alt={item.listing.crop.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                        <ShoppingBag size={20} className="text-green-300" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{item.listing?.crop?.name ?? "Unknown Crop"}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} {item.listing?.crop?.unit ?? "kg"} · KES {Number(item.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Buyer: {order.buyer?.fullName ?? "—"} · {order.buyer?.phone ?? ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Escrow notice */}
              {(order.status === "PAID" || order.status === "RECEIVED" || order.status === "DELIVERED") && (
                <div className="mb-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Clock size={14} className="text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-700">
                    🔒 Payment is held in escrow and will be released once the buyer confirms delivery.
                  </p>
                </div>
              )}

              {/* Auto-release notice */}
              {order.status === "SHIPPED" && order.autoReleaseAt && (
                <div className="mb-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Clock size={14} className="text-orange-500 shrink-0" />
                  <p className="text-xs text-orange-700">
                    Payment auto-releases on{" "}
                    <span className="font-semibold">
                      {new Date(order.autoReleaseAt).toLocaleDateString("en-KE", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>{" "}
                    if buyer doesn't confirm.
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t flex-wrap gap-3">
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-KE", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                  <p className="font-bold text-green-700 mt-0.5">
                    Total: KES {Number(order.totalAmount).toLocaleString()}
                  </p>
                  {order.farmerAmount && (
                    <p className="text-xs text-gray-400">
                      You receive: KES {Number(order.farmerAmount).toLocaleString()} after commission
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {/* Step 1 — Mark as Received (shown for PAID or DELIVERED orders) */}
                  {(order.status === "PAID" || order.status === "DELIVERED") && (
                    <button
                      onClick={() => handleMarkReceived(order.id)}
                      disabled={isUpdating && actionOrderId === order.id}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                      <PackageCheck size={15} />
                      {isUpdating && actionOrderId === order.id ? "Updating..." : "Mark as Received"}
                    </button>
                  )}

                  {/* Step 2 — Mark as Shipped (shown after RECEIVED) */}
                  {order.status === "RECEIVED" && (
                    <button
                      onClick={() => handleMarkShipped(order.id)}
                      disabled={isUpdating && actionOrderId === order.id}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-60"
                    >
                      <Truck size={15} />
                      {isUpdating && actionOrderId === order.id ? "Updating..." : "Mark as Shipped"}
                    </button>
                  )}

                  {/* Awaiting buyer confirmation */}
                  {order.status === "SHIPPED" && (
                    <span className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
                      <Truck size={14} /> Awaiting buyer confirmation
                    </span>
                  )}

                  {/* Payment released */}
                  {(order.status === "CONFIRMED" || order.status === "AUTO_RELEASED") && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <CheckCircle size={14} /> Payment Released
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FarmerOrders;