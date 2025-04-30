import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const pathname = location.pathname
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  const handleRedirectToLogin = () => {
    navigate("/login")
    closeMenu()
  }

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <h1>StyleHub</h1>
          </Link>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                to="/"
                className={pathname === "/" ? "active" : ""}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/shop"
                className={pathname.startsWith("/shop") ? "active" : ""}
                onClick={closeMenu}
              >
                Shop
              </Link>
            </li>
           
            <li className="nav-item">
              <Link
                to="/about"
                className={pathname === "/about" ? "active" : ""}
                onClick={closeMenu}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={pathname === "/contact" ? "active" : ""}
                onClick={closeMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
         
          <div className="header-icon cart-icon">
            {user ? (
              <Link to="/cart">
                <span className="icon">🛒</span>
                {cartItems.length > 0 && (
                  <span className="badge-count">{cartItems.length}</span>
                )}
              </Link>
            ) : (
              <button   className="btn border-0 bg-transparent"
               onClick={handleRedirectToLogin}>
                <span className="icon">🛒</span>
              </button>
            )}
          </div>

          <div className="header-icon user-icon">
            {user ? (
              <div className="user-dropdown">
                <button className="user-dropdown-btn">
                  <span className="icon">👤</span>
                </button>
                <div className="user-dropdown-content">
                  <Link to="/ordres" onClick={closeMenu}>
                    Orders
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin/dashboard" onClick={closeMenu}>
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <span className="icon">👤</span>
              </Link>
            )}
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
