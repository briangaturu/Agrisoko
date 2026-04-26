import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  Wheat,
  List,
  LogOut,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminTopNavProps {
  onLogout?: () => void;
}

export const AdminTopNav = ({ onLogout }: AdminTopNavProps) => {
  const location = useLocation();

  const NAV_ITEMS = [
    { to: "/admin",          label: "Overview",  icon: LayoutDashboard },
    { to: "/admin/users",    label: "Users",     icon: Users           },
    { to: "/admin/orders",   label: "Orders",    icon: ShoppingBag     },
    { to: "/admin/payments", label: "Payments",  icon: CreditCard      },
    { to: "/admin/crops",    label: "Crops",     icon: Wheat           },
    { to: "/admin/listings", label: "Listings",  icon: List            },
    { to: "/",               label: "Site Home", icon: Home            },
  ];

  const isActive = (to: string) => {
    if (to === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* ── Desktop bar ── */}
      <div className="hidden md:block w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 shadow-sm">
        <div className="flex items-center justify-between px-6 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(to)
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-200 hover:bg-red-500/80 hover:text-white transition-all"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Mobile scrollable tabs ── */}
      <div className="md:hidden bg-white border-b shadow-sm px-3 py-2">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                isActive(to)
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
