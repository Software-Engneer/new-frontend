import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>User Profile</h2>
        <div className="profile-info">
          <div className="info-group">
            <label>Username:</label>
            <span>{user.username}</span>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-group">
            <label>Member since:</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 