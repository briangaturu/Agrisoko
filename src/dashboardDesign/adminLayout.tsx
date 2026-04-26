import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";
import { AdminTopNav } from "./adminNav";
import Header from "../components/Header";

export const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="flex flex-col min-h-screen">
        <Header />

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
