import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { TopNav } from "../dashboardDesign/sideNav";
import { clearCredentials } from "../features/auth/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Site-wide Header */}
      <Header />

      {/* Nav — sticky below header */}
      <div className="sticky top-0 z-10">
        <TopNav onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <main className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              {isAuthenticated
                ? `Logged in as ${user?.email ?? "User"}`
                : "Not logged in"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <Outlet />

        {!window.location.pathname.startsWith("/dashboard/") && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
            <h2 className="text-lg font-bold text-gray-900">Welcome 🌱</h2>
            <p className="text-gray-600 mt-2 text-sm">
              Use the menu above to view your profile, orders, and payments.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;