import { SquareUserRound, LogOut, Wheat, LayoutDashboard, List, MessageCircle, Bell } from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../features/auth/authSlice";

interface FarmerSideNavProps {
  onClose?: () => void;
}

export const FarmerSideNav = ({ onClose }: FarmerSideNavProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
    onClose?.();
  };

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
     ${
       location.pathname === path || location.pathname.includes(path)
         ? "bg-white text-green-700 shadow-md"
         : "text-white hover:bg-white/10 hover:pl-5"
     }`;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-green-500 via-green-600 to-green-700 shadow-xl">
      {/* Navigation */}
      <ul className="flex flex-col gap-2 flex-1 p-4 overflow-y-auto">

        {/* Statistics */}
        <li>
          <Link to="/farmer-dashboard" className={linkClass("/farmer-dashboard")} onClick={onClose}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Statistics</span>
          </Link>
        </li>

        {/* Profile */}
        <li>
          <Link to="me" className={linkClass("me")} onClick={onClose}>
            <SquareUserRound size={20} />
            <span className="font-medium">My Profile</span>
          </Link>
        </li>

        {/* Orders */}
        <li>
          <Link to="orders" className={linkClass("orders")} onClick={onClose}>
            <FaShop size={18} />
            <span className="font-medium">Orders</span>
          </Link>
        </li>

        {/* Payments */}
        <li>
          <Link to="payments" className={linkClass("payments")} onClick={onClose}>
            <FaDollarSign size={18} />
            <span className="font-medium">Payments</span>
          </Link>
        </li>

        {/* Crops */}
        <li>
          <Link to="crops" className={linkClass("crops")} onClick={onClose}>
            <Wheat size={20} />
            <span className="font-medium">Crops</span>
          </Link>
        </li>

        {/* Listings */}
        <li>
          <Link to="listings" className={linkClass("listings")} onClick={onClose}>
            <List size={20} />
            <span className="font-medium">Listings</span>
          </Link>
        </li>

        {/* Home */}
        <li>
          <Link to="/" className={linkClass("/")} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span className="font-medium">Home</span>
          </Link>
        </li>

        {/* Chat */}
        <li>
          <Link to="chat" className={linkClass("chat")} onClick={onClose}>
            <MessageCircle size={20} />
            <span className="font-medium">Chat</span>
          </Link>
        </li>

        {/* Notifications */}
        <li>
          <Link to="notifications" className={linkClass("notifications")} onClick={onClose}>
            <Bell size={20} />
            <span className="font-medium">Notifications</span>
          </Link>
        </li>
      </ul>

      {/* Logout */}
      <div className="pt-4 border-t border-white/20 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-200 hover:bg-red-500/80 hover:text-white transition-all duration-200 w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};