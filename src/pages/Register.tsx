import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";

const Register = () => {
  const [role, setRole] = useState<"farmer" | "buyer">("buyer");

  return (
    <>
      <Header /> {/* Navbar added */}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-green-600 text-white p-12">
          <h1 className="text-4xl font-bold mb-4">
            Join the Marketplace 🌱
          </h1>
          <p className="text-green-100 text-lg max-w-md">
            Create an account to trade directly, communicate in real time,
            and access crop availability insights.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Create an Account
            </h2>

            <form className="mt-8 space-y-4">

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Register as
                </label>
                <div className="flex gap-4">
                  {["buyer", "farmer"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r as "buyer" | "farmer")}
                      className={`flex-1 py-2 rounded-md border font-medium ${
                        role === r
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="name"
                />
              </div>

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

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kiambu, Kenya"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="address-level2"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create password"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="new-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
              >
                Register as {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
