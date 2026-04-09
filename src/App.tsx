import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import CropInsights from "./pages/CropInsights";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/dashboard/userProfile";
import FarmerDashboard from "./components/FarmerDashboard";
import NotFound from "./pages/Error";
import ProtectedRoute from "./components/protectedRoute";
import { FarmerLayout } from "./dashboardDesign/farmerLayout";
import Payments from "./components/dashboard/payments";
import Orders from "./components/dashboard/orders";
import Crops from "./components/dashboard/crops";
import ListingsPage from "./components/dashboard/listingsPage";
import BuyerOrdersPage from "./components/dashboard/buyerOrders";
import NotificationsPage from "./pages/NotificationsPage";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";

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
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;