import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { SideNav } from "../dashboardDesign/sideNav"; // adjust path if different
import { clearCredentials } from "../features/auth/authSlice"; // adjust path if different

const Dashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 min-h-[calc(100vh-64px)]">
          <SideNav />
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {/* Top bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                {isAuthenticated
                  ? `Logged in as ${user?.email ?? "User"}`
                  : "Not logged in"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Content area */}
          <div className="mt-6">
            {/* Nested routes will render here:
                /dashboard/me
                /dashboard/orders
                /dashboard/payments
            */}
            <Outlet />

            {/* If you are not using nested routes yet, you can show a default block: */}
            {!window.location.pathname.startsWith("/dashboard/") && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900">Welcome 🌱</h2>
                <p className="text-gray-600 mt-2">
                  Use the side menu to view your profile, orders, and payments.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;