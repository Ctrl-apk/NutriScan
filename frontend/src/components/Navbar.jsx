import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, LogOut, History, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-white bg-green-700' : 'text-green-100 hover:text-white hover:bg-green-700';
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-90 transition">
            <Camera className="w-8 h-8" />
            <span className="text-2xl font-bold">NutriScan</span>
          </Link>
          
          {/* Navigation Links */}
          {user && (
            <div className="flex items-center space-x-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition ${isActive('/dashboard')}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              
              <Link
                to="/history"
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition ${isActive('/history')}`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 text-green-100">
                <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline">{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg text-green-100 hover:text-white hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;