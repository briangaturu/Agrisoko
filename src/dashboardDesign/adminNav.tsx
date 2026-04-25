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
      <div className="hidden md:block w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(to)
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Mobile scrollable tabs ── */}
      <div className="md:hidden bg-gray-900 border-b border-gray-700 px-3 py-2">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                isActive(to)
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
