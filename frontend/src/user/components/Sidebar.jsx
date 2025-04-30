import { useEffect, useRef } from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      // Ensure the element is available before manipulating it
      if (isOpen) {
        sidebarRef.current.style.transform = "translateX(0)";
      } else {
        sidebarRef.current.style.transform = "translateX(-100%)";
      }
    }
  }, [isOpen]); // Only run when isOpen changes

  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${isOpen ? "open" : "closed"}`}
    >
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">✈️</span>
          <h2>TravelEase</h2>
        </div>
      </div>

      <div className="menu-container">
        <ul className="menu-items">
          <li className="menu-item active">
            <span className="menu-icon">🏠</span>
            <span className="menu-text">Dashboard</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon">🧳</span>
            <span className="menu-text">My Trips</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon">🔍</span>
            <span className="menu-text">Explore</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon">📅</span>
            <span className="menu-text">Bookings</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon">💰</span>
            <span className="menu-text">Deals</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon">❤️</span>
            <span className="menu-text">Wishlist</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon">📝</span>
            <span className="menu-text">Travel Journal</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="settings-item">
          <span className="menu-icon">⚙️</span>
          <span className="menu-text">Settings</span>
        </div>
        <div className="help-item">
          <span className="menu-icon">❓</span>
          <span className="menu-text">Help Center</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

