import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { clearCredentials } from "../features/auth/authSlice";

const Header = () => {
  const [open, setOpen] = useState(false); // mobile menu
  const [userMenuOpen, setUserMenuOpen] = useState(false); // desktop user dropdown

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const dashboardPath = "/dashboard";

  const handleLogout = () => {
    dispatch(clearCredentials());
    setUserMenuOpen(false);
    navigate("/");
  };

  const baseLink = "block px-3 py-2 rounded-md text-sm font-medium transition";
  const activeLink = "text-green-700 bg-green-100";
  const inactiveLink = "text-gray-700 hover:bg-green-50 hover:text-green-700";

  const displayName =
    user?.email ||
    "User";

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-lg text-green-700">AgriSoko</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Marketplace
            </NavLink>

            <NavLink
              to="/insights"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Crop Insights
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Contact
            </NavLink>

            {/* ✅ Single button when logged in (Hello User) with dropdown */}
            {isAuthenticated && (
              <div className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="px-4 py-2 rounded-md bg-green-50 text-green-800 text-sm font-semibold border border-green-200 flex items-center gap-2 hover:bg-green-100 transition"
                >
                  <span>{`Hello, ${displayName}`}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    {/* click-away overlay */}
                    <button
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setUserMenuOpen(false)}
                      aria-label="Close menu"
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                      <Link
                        to={dashboardPath}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                      >
                        User Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1 bg-white border-t">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/marketplace"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Marketplace
          </NavLink>

          <NavLink
            to="/insights"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Crop Insights
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Contact
          </NavLink>

          {/* ✅ Mobile dropdown equivalent (Hello User -> Dashboard/Logout) */}
          {isAuthenticated && (
            <div className="pt-2 space-y-2">
              <div className="px-3 py-2 rounded-md bg-green-50 text-green-800 text-sm font-semibold border border-green-200">
                {`Hello, ${displayName}`}
              </div>

              <Link
                to={dashboardPath}
                onClick={() => setOpen(false)}
                className="block w-full text-center py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-semibold"
              >
                User Dashboard
              </Link>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;