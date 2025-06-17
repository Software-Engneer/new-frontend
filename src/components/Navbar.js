import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileColor } from '../utils/profileColors';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const profileColor = getProfileColor(user?.username);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Product Management</h1>
      </div>
      
      <div className="navbar-profile">
        <div className="profile-dropdown">
          <button className="profile-button">
            <div 
              className="profile-icon"
              style={{ backgroundColor: profileColor }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="username">{user?.username || 'User'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <div 
                className="profile-icon large"
                style={{ backgroundColor: profileColor }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-info">
                <span className="username">{user?.username || 'User'}</span>
                <span className="email">{user?.email}</span>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={() => navigate('/profile')}>
              Profile Settings
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 