import { Link } from "react-router-dom";
import Header from "../components/Header";

const Login = () => {
  return (
    <>
      <Header /> {/* Navbar added */}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-green-600 text-white p-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome Back 🌱
          </h1>
          <p className="text-green-100 text-lg max-w-md">
            Login to access the marketplace, chat with farmers or buyers,
            and view real-time crop availability insights.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Login to Your Account
            </h2>

            <form className="mt-8 space-y-5">
              {/* Email / Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="current-password"
                />
              </div>

              {/* Remember me / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-green-600" />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-green-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
