import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCredentials } from '../features/auth/authSlice';
import Card from './card';
import { FarmerTopNav } from './farmerNav';
import Header from '../components/Header';

export const FarmerLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100'>
      <div className='flex flex-col min-h-screen'>

        <Header />

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