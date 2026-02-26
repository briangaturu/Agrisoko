import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice"; // ✅ adjust path if yours differs
import { useLoginUserMutation } from "../features/api/userApi"; // ✅ adjust path if yours differs

type LoginUser = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginUser>();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const onSubmit = async (data: LoginUser) => {
    const loadingId = toast.loading("Logging in...");

    try {
      const res = await loginUser(data).unwrap();

      // Your backend returns: { token, userId, email }
      dispatch(
        setCredentials({
          token: res.token,
          userId: res.userId,
          email: res.email,
          fullName: res.fullName, // optional, only if your backend sends it
        })
      );

      toast.success("Login successful", { id: loadingId });

      // ✅ Redirect to your dashboard (change if your route is different)
      navigate("/dashboard/me");
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Failed to login";
      toast.error(msg, { id: loadingId });
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Header />

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-green-600 text-white p-12">
          <h1 className="text-4xl font-bold mb-4">Welcome Back 🌱</h1>
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

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  autoComplete="email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">Email is required</p>
                )}
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
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    Password is required
                  </p>
                )}
              </div>

              {/* Forgot */}
              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-green-600 hover:underline"
                >
                  Forgot password?
                </Link>

                <Link to="/" className="text-green-600 hover:underline">
                  Home
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >
                {isLoading ? "Logging in..." : "Login"}
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