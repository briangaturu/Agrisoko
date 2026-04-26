import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import CropInsights from "./pages/CropInsights";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";

import FarmerDashboard from "./components/FarmerDashboard";
import NotFound from "./pages/Error";
import ProtectedRoute from "./components/protectedRoute";
import { FarmerLayout } from "./dashboardDesign/farmerLayout";

import NotificationsPage from "./pages/NotificationsPage";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";
import UserProfile from "./components/UserDashboard/userProfile";
import BuyerOrdersPage from "./components/UserDashboard/buyerOrders";
import Payments from "./components/UserDashboard/payments";
import Crops from "./components/FarmerDashboard/crops";
import ListingsPage from "./components/FarmerDashboard/listingsPage";
import Orders from "./components/FarmerDashboard/orders";

// Admin
import AdminLayout from "./dashboardDesign/adminLayout";
import Analytics from "./components/adminDashboard/analytics";
import AdminUsers from "./components/adminDashboard/users";
import AdminOrders from "./components/adminDashboard/orders";
import AdminCrops from "./components/adminDashboard/crops";
import AdminListings from "./components/adminDashboard/listings";
import AdminPayments from "./components/adminDashboard/payments";
import Wallet from "./components/adminDashboard/wallet";


const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/marketplace", element: <Marketplace /> },
    { path: "/insights", element: <CropInsights /> },
    { path: "/contact", element: <Contact /> },

    {
      path: "dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { path: "me", element: <UserProfile /> },
        { path: "orders", element: <BuyerOrdersPage /> },
        { path: "payments", element: <Payments /> },
        { path: "chat", element: <ChatList /> },
        { path: "chat/:userId", element: <Chat /> },
        { path: "notifications", element: <NotificationsPage /> },
      ],
    },

    {
      path: "/farmer-dashboard",
      element: (
        <ProtectedRoute>
          <FarmerLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <FarmerDashboard /> },
        { path: "me", element: <UserProfile /> },
        { path: "crops", element: <Crops /> },
        { path: "listings", element: <ListingsPage /> },
        { path: "orders", element: <Orders /> },
        { path: "payments", element: <Payments /> },
        { path: "chat", element: <ChatList /> },
        { path: "chat/:userId", element: <Chat /> },
        { path: "notifications", element: <NotificationsPage /> },
      ],
    },

    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Navigate to="/admin/analytics" replace /> },
        { path: "analytics", element: <Analytics /> },
        { path: "users", element: <AdminUsers /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "crops", element: <AdminCrops /> },
        { path: "listings", element: <AdminListings /> },
        { path: "payments", element: <AdminPayments /> },
        { path: "wallet", element: <Wallet /> },

      ],
    },

    { path: "*", element: <NotFound /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;