import { Link } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3 className="footer-title">StyleHub</h3>
            <p>
              Your one-stop destination for trendy and fashionable clothing. We offer the latest styles at affordable
              prices.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <span className="social-icon">📘</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                <span className="social-icon">📌</span>
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/categories">Categories</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section categories">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li>
                <Link href="/categories/men">Men</Link>
              </li>
              <li>
                <Link href="/categories/women">Women</Link>
              </li>
              <li>
                <Link href="/categories/kids">Kids</Link>
              </li>
              <li>
                <Link href="/categories/accessories">Accessories</Link>
              </li>
              <li>
                <Link href="/categories/shoes">Shoes</Link>
              </li>
              <li>
                <Link href="/categories/sale">Sale</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-info">
              <li>
                <span className="contact-icon">📍</span>
                <span>123 Fashion Street, Style City</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>+1 234 567 8900</span>
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                <span>info@stylehub.com</span>
              </li>
              <li>
                <span className="contact-icon">🕒</span>
                <span>Mon-Fri: 9am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="payment-methods">
            <span className="payment-icon">💳</span>
            <span className="payment-icon">💵</span>
            <span className="payment-icon">🏦</span>
            <span className="payment-icon">💰</span>
          </div>
          <p className="copyright">&copy; {currentYear} StyleHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
