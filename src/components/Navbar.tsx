import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const baseLink =
    "block px-3 py-2 rounded-md text-sm font-medium transition-all duration-300";
  const activeLink = "text-white bg-white/30 shadow-inner backdrop-blur";
  const inactiveLink =
    "text-white/90 hover:text-white hover:bg-white/20 hover:scale-105";

  return (
    <nav className="navbar-gradient sticky top-0 z-50 border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">🌱</span>
            <span className="font-bold text-lg text-white drop-shadow-lg">
              AgriSoko
            </span>
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

            <NavLink
              to="/farmer-dashboard"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Farmer Dashboard
            </NavLink>
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
        <div className="md:hidden px-4 pb-4 space-y-1 bg-white/90 backdrop-blur border-t border-white/40 animate-fade-in">
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

          <NavLink
            to="/farmer-dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Farmer Dashboard
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;