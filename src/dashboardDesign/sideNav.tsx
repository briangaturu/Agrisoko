import { SquareUserRound, LogOut } from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const SideNav = () => {
  return (
    <ul className="menu bg-green-600 text-white shadow-lg min-w-full gap-2 min-h-full p-3">

      {/* Profile */}
      <li>
        <Link
          to="me"
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-green-700 transition"
        >
          <SquareUserRound className="text-white" />
          My Profile
        </Link>
      </li>

      {/* Orders */}
      <li>
        <Link
          to="orders"
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-green-700 transition"
        >
          <FaShop className="text-white" />
          Orders
        </Link>
      </li>

      {/* Payments */}
      <li>
        <Link
          to="payments"
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-green-700 transition"
        >
          <FaDollarSign className="text-white" />
          Payments
        </Link>
      </li>

      {/* Home */}
      <li>
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-green-700 transition"
        >
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
            className="text-white"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          Home
        </Link>
      </li>

      {/* Logout */}
      <li className="mt-auto">
        <Link
          to="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-red-200 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut />
          Logout
        </Link>
      </li>

    </ul>
  );
};