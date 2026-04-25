// src/components/Marketplace/CropCard.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { RootState } from "../../app/store";
import { useCreateOrderMutation } from "../../features/api/ordersApi";
import {
  useCreateStripeIntentMutation,
  useCreatePaymentMutation,
  useInitiateMpesaPaymentMutation,
} from "../../features/api/paymentsApi";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);

const KES_TO_USD = 130;

interface CropCardProps {
  listingId: string | number;
  farmerId?: string;
  name: string;
  image: string;
  price?: number;
  quantity?: number;
  farmer?: string;
  phone?: string;
  location?: string;
  description?: string;
  unit?: string;
}

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

    // ✅ Stripe-only minimum restriction
    if (amount < 100) {
      setErrorMsg("Minimum amount for card payments is KES 100.");
      return;
    }

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

      if (error) {
        setErrorMsg(error.message ?? "Payment failed");
        setIsProcessing(false);
        return;
      }

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

      {/* Stripe minimum warning */}
      {amount < 100 && (
        <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-md">
          ⚠️ Card payments require a minimum of KES 100. Please use M-Pesa instead.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="border rounded-md px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
          <CardElement
            options={{
              style: {
                base: { fontSize: "15px", color: "#1f2937", "::placeholder": { color: "#9ca3af" } },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">{errorMsg}</p>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          ← Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={!stripe || isProcessing || amount < 100}
          className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <CreditCard size={15} />
          {isProcessing ? "Processing..." : `Pay USD ${amountInUSD}`}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Secured by <span className="font-semibold text-gray-500">Stripe</span>
      </p>
    </div>
  );
};

type ModalStep = "order" | "payment-options" | "stripe";
type MpesaStep = "options" | "phone" | "pending";

const CropCard = ({ listingId, farmerId, name, image, price, quantity, farmer, phone, location, description, unit }: CropCardProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("order");
  const [mpesaStep, setMpesaStep] = useState<MpesaStep>("options");
  const [orderQty, setOrderQty] = useState(1);
  const [placedOrder, setPlacedOrder] = useState<{ id: string; amount: number; farmerPhone: string } | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState("");

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [initiateMpesaPayment, { isLoading: isMpesaLoading }] = useInitiateMpesaPaymentMutation();

  const handleOrderClick = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (user?.role === "FARMER") {
      alert("Farmers cannot place orders. Please log in as a buyer.");
      return;
    }
    setModalStep("order");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPlacedOrder(null);
    setOrderQty(1);
    setModalStep("order");
    setMpesaStep("options");
    setMpesaPhone("");
  };

  const handlePlaceOrder = async () => {
    if (!user?.userId) return;

    const totalAmount = (price ?? 0) * orderQty;

    try {
      const res = await createOrder({
        buyerId: user.userId,
        totalAmount: totalAmount.toFixed(2),
        items: [{ listingId, quantity: orderQty, price: totalAmount.toFixed(2) }],
      }).unwrap();

      const orderId = res?.data?.id ?? res?.id;

      setPlacedOrder({
        id: orderId,
        amount: totalAmount,
        farmerPhone: phone ?? "", // ✅ farmer phone for B2C escrow
      });
      setModalStep("payment-options");
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to place order");
    }
  };

  const handleMpesaPay = async () => {
    if (!mpesaPhone) { alert("Please enter your M-Pesa phone number."); return; }
    if (!placedOrder) return;
    try {
      await initiateMpesaPayment({
        phone: mpesaPhone,
        amount: placedOrder.amount,
        orderId: placedOrder.id,
        farmerPhone: placedOrder.farmerPhone, // ✅ pass farmer phone for escrow
      }).unwrap();
      setMpesaStep("pending");
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to initiate M-Pesa payment");
    }
  };

  const handlePaymentSuccess = () => {
    handleCloseModal();
    alert("Payment successful! Your order has been confirmed.");
  };

  const totalAmount = (price ?? 0) * orderQty;

  return (
    <>
      <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">

        {/* Image */}
        <div className="relative h-48">
          <img
            src={image || "https://placehold.co/300x200?text=No+Image"}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x200?text=No+Image"; }}
          />
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Available
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900">{name}</h3>
            <span className="text-lg font-bold text-green-600">KES {Number(price).toLocaleString()}</span>
          </div>
          {description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</p>}
          {location && (
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <MapPin size={13} className="text-green-500" />{location}
            </p>
          )}
          {farmer && <p className="text-sm text-gray-600 mb-1">Farmer: <span className="font-medium">{farmer}</span></p>}
          {phone && <p className="text-sm text-gray-600 mb-3">Phone: <span className="font-medium">{phone}</span></p>}
          <p className="text-sm text-gray-500 mb-4">Available: {quantity} {unit ?? "kg"}</p>

          <div className="mt-auto flex flex-col gap-2">
            {farmer && (
              <button
                onClick={() => navigate(`/dashboard/chat/${farmerId}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                🗨️ Contact Farmer
              </button>
            )}
            <button
              onClick={handleOrderClick}
              className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition text-sm"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {modalStep === "order" && "Place Order"}
                {modalStep === "payment-options" && mpesaStep === "options" && "Choose Payment"}
                {modalStep === "payment-options" && mpesaStep === "phone" && "Pay with M-Pesa"}
                {modalStep === "payment-options" && mpesaStep === "pending" && "Check Your Phone"}
                {modalStep === "stripe" && "Pay with Card"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>

            {/* ── STEP 1: Order ── */}
            {modalStep === "order" && (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1 font-medium">{name}</p>
                  <p className="text-sm text-gray-500">KES {Number(price).toLocaleString()} / {unit ?? "kg"}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({unit ?? "kg"})</label>
                  <input
                    type="number"
                    min={1}
                    max={quantity}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Max available: {quantity} {unit ?? "kg"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Price per unit</span><span>KES {Number(price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Quantity</span><span>{orderQty} {unit ?? "kg"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 mt-2 pt-2 border-t">
                    <span>Total</span><span>KES {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={handleCloseModal} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || orderQty < 1}
                    className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition disabled:opacity-60"
                  >
                    {isLoading ? "Placing..." : "Confirm Order"}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 2: Payment options ── */}
            {modalStep === "payment-options" && placedOrder && (
              <>
                <div className="bg-green-50 rounded-lg p-4 mb-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Order placed successfully! ✅</p>
                  <p className="text-2xl font-bold text-green-700">KES {placedOrder.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">≈ USD {(placedOrder.amount / KES_TO_USD).toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">Order #{placedOrder.id}</p>
                </div>

                {/* Escrow notice */}
                <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-blue-700">
                    🔒 <span className="font-semibold">Secure Escrow:</span> Payment is held safely until you confirm receipt of your order.
                  </p>
                </div>

                {mpesaStep === "options" && (
                  <>
                    <p className="text-sm text-gray-600 font-medium mb-3 text-center">Choose a payment method:</p>
                    <div className="flex flex-col gap-3">
                      {/* Stripe — show warning if below minimum */}
                      <button
                        onClick={() => setModalStep("stripe")}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        <CreditCard size={18} /> Pay with Card (Stripe)
                        {placedOrder.amount < 100 && (
                          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">Min KES 100</span>
                        )}
                      </button>

                      {/* M-Pesa — no minimum restriction */}
                      <button
                        onClick={() => setMpesaStep("phone")}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                      >
                        🇰🇪 Pay with M-Pesa
                      </button>

                      <button onClick={handleCloseModal} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition">
                        Pay Later
                      </button>
                    </div>
                  </>
                )}

                {mpesaStep === "phone" && (
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
                      <button onClick={() => setMpesaStep("options")} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
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

                {mpesaStep === "pending" && (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📱</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Check your phone!</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      An M-Pesa prompt has been sent to <span className="font-semibold">{mpesaPhone}</span>. Enter your PIN to complete payment.
                    </p>
                    <p className="text-xs text-blue-600 mb-4">
                      🔒 Payment held securely until you confirm receipt.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button onClick={handleCloseModal} className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                        Done
                      </button>
                      <button onClick={() => setMpesaStep("phone")} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition">
                        Resend STK Push
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── STEP 3: Stripe form ── */}
            {modalStep === "stripe" && placedOrder && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  orderId={placedOrder.id}
                  amount={placedOrder.amount}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setModalStep("payment-options")}
                />
              </Elements>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CropCard;