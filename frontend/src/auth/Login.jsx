
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom'; // Import useNavigate from 'react-router-dom'
import "./style.css"
import "../styles.css"

import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const res = await axios.post('http://localhost:5050/login', form);

      if (res.status === 200) {
        // Assuming the response includes a user object with a `role` field
        const { role } = res.data.user;
        
        const { user } = res.data;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('company', JSON.stringify(res.data.compony));

        // Redirect based on role using navigate
        if (role === 'user') {
          navigate('/');
        } else if (role === 'employ') {
          navigate('/employe-dashboard');
        } 
        else if (role === 'admin') {
          navigate('/admin-dashboard/adminDashboard');
        } else {
          setErrorMessage('Unknown role');
        }
      }
    } catch (error) {
      setIsLoading(false); // Stop loading

      if (error.response) {
        if (error.response.status === 404) {
          // Handle 404 error for incorrect login credentials
          setErrorMessage('Incorrect email or password');
        } else {
          setErrorMessage('An error occurred, please try again');
        }
      } else {
        setErrorMessage('Network error, please try again');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="card-header">
          <div className="header-row">
            <Link to="/" className="back-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Back to home</span>
            </Link>
            <div className="logo-container">
              <img
               src="/images/logo.png"
                alt="Inventory Management System Logo"
                width={40}
                height={40}
                className="logo-small"
              />
            </div>
            <div className="spacer"></div>
          </div>
          <h2 className="card-title">Login</h2>
          <p className="card-description">Enter your credentials to access your account</p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  onChange={handleChange}
                  value={form.email}
                  required
                />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
              <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                onChange={handleChange}
                value={form.password}
                placeholder="••••••••"
                required
              />

                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
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
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
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
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            <button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="card-footer">
          <p className="switch-prompt">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="switch-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
