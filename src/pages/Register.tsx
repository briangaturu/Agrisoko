import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import { useRegisterUserMutation } from "../features/api/userApi"; // adjust path if different

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // Backend expects role: "FARMER" | "BUYER"
  const [role, setRole] = useState<"FARMER" | "BUYER">("BUYER");

  // ✅ Required by your backend/validator: fullName, email, phone, password, role
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password) {
      alert("fullName, email, phone and password are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        fullName,
        email,
        phone,
        password,
        role,
      }).unwrap();

      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        "Registration failed";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-green-600 text-white p-12">
          <h1 className="text-4xl font-bold mb-4">Join the Marketplace 🌱</h1>
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

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Register as
                </label>
                <div className="flex gap-4">
                  {[
                    { label: "Buyer", value: "BUYER" as const },
                    { label: "Farmer", value: "FARMER" as const },
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex-1 py-2 rounded-md border font-medium ${
                        role === r.value
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {r.label}
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="Enter full name"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="e.g. 0727348863"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="tel"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm password"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="new-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >
                {isLoading ? "Creating..." : `Register as ${role}`}
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