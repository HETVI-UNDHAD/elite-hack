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
    <nav className="bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">EventNexus</Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <>
                    <Link to="/dashboard" className="hover:text-primary-200 font-semibold">Dashboard</Link>
                    <Link to="/my-registrations" className="hover:text-primary-200 font-semibold">My Registrations</Link>
                  </>
                )}
                {user.role !== 'admin' && (
                  <Link to="/events" className="hover:text-primary-200 font-semibold">Browse Events</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-primary-200 font-semibold">Manage Events</Link>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-sm">{user.name}</span>
                  <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">Login</Link>
                <Link to="/register" className="btn-secondary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
