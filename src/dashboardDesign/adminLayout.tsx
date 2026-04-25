import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Shield, ChevronDown } from "lucide-react";
import type { RootState } from "../app/store";
import { clearCredentials } from "../features/auth/authSlice";
import { AdminTopNav } from "./adminNav";
import NotificationBell from "../components/NotificationsBell";

export const AdminLayout = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const displayName = user?.fullName || user?.email || "Admin";

  const handleLogout = () => {
    dispatch(clearCredentials());
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="flex flex-col min-h-screen">

        {/* ── Header ── */}
        <header className="bg-gray-900 border-b border-gray-700 shadow-lg sticky top-0 z-40">
          <div className="w-full px-4">
            <div className="flex justify-between h-16 items-center">
              {/* Brand */}
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-base text-white">Agrisoko</span>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">Admin</span>
                </div>
              </Link>

              {/* Right side */}
              <div className="flex items-center gap-4">
                <NotificationBell />

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-sm font-medium border border-gray-600 hover:bg-gray-700 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{displayName}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {userMenuOpen && (
                    <>
                      <button
                        className="fixed inset-0 z-30 cursor-default"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm text-white font-semibold truncate">{user?.email}</p>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Administrator</span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Nav ── */}
        <AdminTopNav onLogout={handleLogout} />

        {/* ── Main Content ── */}
        <main className="flex-1 p-4 md:p-6 w-full max-w-screen-2xl mx-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout
