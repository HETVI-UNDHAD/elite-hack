import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">EventNexus</Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/about" className="hover:text-primary-200 font-semibold">About Us</Link>
                {user.role !== 'admin' && (
                  <>
                    <Link to="/dashboard" className="hover:text-primary-200 font-semibold">Dashboard</Link>
                    <Link to="/my-registrations" className="hover:text-primary-200 font-semibold">My Registrations</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="hover:text-primary-200 font-semibold">Manage Events</Link>
                    <Link to="/admin/profile" className="hover:text-primary-200 font-semibold">Update Profile</Link>
                  </>
                )}
                <div className="flex items-center gap-4">
                  <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about" className="hover:text-primary-200">About Us</Link>
                <Link to="/login" className="hover:text-primary-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
