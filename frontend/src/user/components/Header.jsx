import "./Header.css"


import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Header = ({ toggleSidebar }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
  };
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="search-container">
          <input type="text" placeholder="Search destinations, hotels, flights..." />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="header-right">
        <div className="notification-bell">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </div>

        <div className="language-selector">
          <span>EN</span>
          <span className="dropdown-arrow">▼</span>
        </div>

        <div className="user-profile">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Profile" />
          <div className="user-info">
            <p className="user-name">John Doe</p>
            <p className="user-status">Gold Member</p>
          </div>
        </div>


        <div className="logout-container">
          <button onClick={logout} className="logout-btn" title="Logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>

      </div>
    </header>
  )
}

export default Header
