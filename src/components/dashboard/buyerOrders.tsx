import { useState } from "react";
import { useSelector } from "react-redux";
import { ShoppingBag, CreditCard } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { RootState } from "../../app/store";
import { useGetOrdersByBuyerQuery } from "../../features/api/ordersApi";
import {
  useCreateStripeIntentMutation,
  useCreatePaymentMutation,
  useInitiateMpesaPaymentMutation,
} from "../../features/api/paymentsApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);
const KES_TO_USD = 130;

const statusColors: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  PAID:      "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

// ── Stripe Checkout Form ─────────────────────────────────────
interface CheckoutFormProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}

const CheckoutForm = ({ orderId, amount, onSuccess, onBack }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [createStripeIntent] = useCreateStripeIntentMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const amountInUSD = (amount / KES_TO_USD).toFixed(2);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const intentRes = await createStripeIntent({ amount, orderId }).unwrap();
      const { clientSecret } = intentRes;
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
      if (error) { setErrorMsg(error.message ?? "Payment failed"); setIsProcessing(false); return; }
      if (paymentIntent?.status === "succeeded") {
        await createPayment({
          orderId,
          provider: "STRIPE",
          amount: amount.toString(),
          transactionRef: paymentIntent.id,
          status: "SUCCESS",
        }).unwrap();
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || err?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 rounded-lg p-3 text-center">
        <p className="text-xs text-gray-500">Total Amount</p>
        <p className="text-2xl font-bold text-green-700">KES {Number(amount).toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">≈ USD {amountInUSD}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="border rounded-md px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
          <CardElement options={{ style: { base: { fontSize: "15px", color: "#1f2937", "::placeholder": { color: "#9ca3af" } }, invalid: { color: "#ef4444" } } }} />
        </div>
      </div>
      {errorMsg && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">{errorMsg}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">← Back</button>
        <button type="button" onClick={handlePay} disabled={!stripe || isProcessing}
          className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
          <CreditCard size={15} />
          {isProcessing ? "Processing..." : `Pay USD ${amountInUSD}`}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400">Secured by <span className="font-semibold text-gray-500">Stripe</span></p>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────
type PayStep = "options" | "stripe" | "mpesa-phone" | "mpesa-pending";

const BuyerOrdersPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const buyerId = user?.userId;

  const { data, isLoading, isError, refetch } = useGetOrdersByBuyerQuery(
    buyerId as string,
    { skip: !buyerId }
  );

  const orders = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  const [payingOrder, setPayingOrder] = useState<{ id: string; amount: number } | null>(null);
  const [payStep, setPayStep] = useState<PayStep>("options");
  const [mpesaPhone, setMpesaPhone] = useState("");

  const [initiateMpesaPayment, { isLoading: isMpesaLoading }] = useInitiateMpesaPaymentMutation();

  const handleClosePayment = () => {
    setPayingOrder(null);
    setPayStep("options");
    setMpesaPhone("");
  };

  const handleMpesaPay = async () => {
    if (!mpesaPhone) { alert("Please enter your M-Pesa phone number."); return; }
    if (!payingOrder) return;
    try {
      await initiateMpesaPayment({
        phone: mpesaPhone,
        amount: payingOrder.amount,
        orderId: payingOrder.id,
      }).unwrap();
      setPayStep("mpesa-pending");
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to initiate M-Pesa payment");
    }
  };

  const handlePaymentSuccess = () => {
    handleClosePayment();
    refetch();
    alert("Payment successful! Your order has been confirmed.");
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading orders...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">Failed to load orders.</div>;

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-16 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <ShoppingBag size={32} className="text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-700">No Orders Yet</h3>
        <p className="text-gray-400 text-sm max-w-xs">You haven't placed any orders yet. Visit the marketplace to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <p className="text-sm text-gray-400 mt-0.5">Track and pay for your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">

            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="font-mono text-sm font-semibold text-gray-700">#{order.id}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.listing?.crop?.cropUrl ? (
                    <img src={item.listing.crop.cropUrl} alt={item.listing.crop.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-green-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.listing?.crop?.name ?? "Unknown Crop"}</p>
                    <p className="text-xs text-gray-500">Farmer: {item.listing?.farmer?.fullName ?? "—"}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} {item.listing?.crop?.unit ?? "kg"} · KES {Number(item.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                </p>
                <p className="font-bold text-green-700 mt-0.5">Total: KES {Number(order.totalAmount).toLocaleString()}</p>
              </div>
              {/* ✅ Pay Now button — only for PENDING orders */}
              {order.status === "PENDING" && (
                <button
                  onClick={() => { setPayingOrder({ id: order.id, amount: Number(order.totalAmount) }); setPayStep("options"); }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Payment Modal ── */}
      {payingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {payStep === "options" && "Choose Payment"}
                {payStep === "stripe" && "Pay with Card"}
                {payStep === "mpesa-phone" && "Pay with M-Pesa"}
                {payStep === "mpesa-pending" && "Check your phone"}
              </h2>
              <button onClick={handleClosePayment} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>

            {/* Order summary */}
            {payStep !== "mpesa-pending" && (
              <div className="bg-green-50 rounded-lg p-3 text-center mb-4">
                <p className="text-xs text-gray-500">Order Total</p>
                <p className="text-2xl font-bold text-green-700">KES {payingOrder.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">≈ USD {(payingOrder.amount / KES_TO_USD).toFixed(2)}</p>
              </div>
            )}

            {/* ── Options ── */}
            {payStep === "options" && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setPayStep("stripe")}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  <CreditCard size={18} /> Pay with Card (Stripe)
                </button>
                <button
                  onClick={() => setPayStep("mpesa-phone")}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  🇰🇪 Pay with M-Pesa
                </button>
                <button onClick={handleClosePayment} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition">
                  Cancel
                </button>
              </div>
            )}

            {/* ── Stripe ── */}
            {payStep === "stripe" && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  orderId={payingOrder.id}
                  amount={payingOrder.amount}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setPayStep("options")}
                />
              </Elements>
            )}

            {/* ── M-Pesa phone ── */}
            {payStep === "mpesa-phone" && (
              <>
                <p className="text-sm text-gray-600 font-medium mb-3">Enter your M-Pesa phone number:</p>
                <input
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={() => setPayStep("options")} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                    ← Back
                  </button>
                  <button
                    onClick={handleMpesaPay}
                    disabled={isMpesaLoading || !mpesaPhone}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60"
                  >
                    {isMpesaLoading ? "Sending..." : "Send STK Push"}
                  </button>
                </div>
              </>
            )}

            {/* ── M-Pesa pending ── */}
            {payStep === "mpesa-pending" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Check your phone!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  An M-Pesa prompt has been sent to <span className="font-semibold">{mpesaPhone}</span>. Enter your PIN to complete payment.
                </p>
                <div className="flex flex-col gap-2">
                  <button onClick={handleClosePayment} className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                    Done
                  </button>
                  <button onClick={() => setPayStep("mpesa-phone")} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition">
                    Resend STK Push
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrdersPage;