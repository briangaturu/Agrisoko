import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const baseLink =
    "block px-3 py-2 rounded-md text-sm font-medium transition";
  const activeLink = "text-green-700 bg-green-100";
  const inactiveLink =
    "text-gray-700 hover:bg-green-50 hover:text-green-700";

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-lg text-green-700">
              AgriSoko
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
className={({ isActive }: { isActive: boolean }) =>
                 `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/marketplace"
className={({ isActive }: { isActive: boolean }) =>
                 `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Marketplace
            </NavLink>

            <NavLink
              to="/insights"
className={({ isActive }: { isActive: boolean }) =>
                 `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Crop Insights
            </NavLink>

            <NavLink
              to="/about"
className={({ isActive }: { isActive: boolean }) =>
                 `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
className={({ isActive }: { isActive: boolean }) =>
                 `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Contact
            </NavLink>

            {/* Auth Buttons */}
            <div className="ml-4 flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-green-700 border border-green-600 rounded-md hover:bg-green-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setOpen(!open)}
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
            className={({ isActive }: { isActive: boolean }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/marketplace"
            onClick={() => setOpen(false)}
            className={({ isActive }: { isActive: boolean }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Marketplace
          </NavLink>

          <NavLink
            to="/insights"
            onClick={() => setOpen(false)}
            className={({ isActive }: { isActive: boolean }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Crop Insights
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className={({ isActive }: { isActive: boolean }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className={({ isActive }: { isActive: boolean }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Contact
          </NavLink>

          {/* Mobile Auth */}
          <div className="pt-3 space-y-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block w-full text-center py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="block w-full text-center py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
