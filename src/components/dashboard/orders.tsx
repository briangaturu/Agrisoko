// OrdersPage.tsx
import { ShoppingBag } from "lucide-react";

const Orders = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-sm border p-16 flex flex-col items-center text-center gap-4 max-w-md w-full">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <ShoppingBag size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Orders Coming Soon</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Farmer order tracking is currently under development. You'll be able to
          view and manage all your orders here once it's ready.
        </p>
        <span className="mt-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
          In Development
        </span>
      </div>
    </div>
  );
};

export default Orders;