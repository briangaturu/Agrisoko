
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import CropInsights from "./pages/CropInsights";
import Contact from "./pages/Contact";

const App =() => {
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path:"/insights",
    element:<CropInsights/>
  },
  {
    path:"/contact",
    element:<Contact/>
  }
]);
return <RouterProvider router ={router} />
};

export default App
