import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import { clearCredentials } from '../features/auth/authSlice';
import Card from './card';
import { FarmerTopNav } from './farmerNav';
import NotificationBell from '../components/NotificationsBell';

export const FarmerLayout = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const displayName = user?.fullName || user?.email || "User";

  const handleLogout = () => {
    dispatch(clearCredentials());
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100'>
      <div className='flex flex-col min-h-screen'>

        {/* ── Header (unchanged) ── */}
        <header className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40'>
          <div className='w-full px-4'>
            <div className='flex justify-between h-16 items-center'>
              <Link to="/" className="flex items-center gap-2">
                <span className="font-bold text-lg text-green-700">🌾 Agrisoko</span>
              </Link>

              <div className='flex items-center gap-4'>
                <NotificationBell />
                <div className='relative'>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className='px-4 py-2 rounded-md bg-green-50 text-green-800 text-sm font-semibold border border-green-200 flex items-center gap-2 hover:bg-green-100 transition'
                  >
                    <span>Hello, {displayName}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <>
                      <button className='fixed inset-0 z-30 cursor-default' onClick={() => setUserMenuOpen(false)} />
                      <div className='absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg z-50 overflow-hidden'>
                        <button
                          onClick={handleLogout}
                          className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Nav bar below header ── */}
        <FarmerTopNav onLogout={handleLogout} />

        {/* ── Main Content ── */}
        <main className='flex-1 p-4 md:p-6 w-full'>
          <Card>
            <Outlet />
          </Card>
        </main>

      </div>
    </div>
  );
};