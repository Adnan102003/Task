import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        ⚡ TaskFlow
      </Link>
      {user && (
        <div className="navbar-right">
          <span className="navbar-user">👤 {user.name}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
