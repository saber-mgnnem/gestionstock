import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./style.css"
import "../styles.css"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');
    
    // Frontend validation
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setErrorMessage('All fields except company are required');
      return;
    }
  
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
  
    setIsLoading(true);
    try {
      // Prepare data for backend (remove confirmPassword)
      const { confirmPassword, ...registrationData } = form;
      await axios.post('http://localhost:5050/register', registrationData);
      
      alert('Registration successful');
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Registration failed'
      );
    } finally {
      setIsLoading(false);
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
                src="images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="logo-small"
              />
            </div>
            <div className="spacer"></div>
          </div>
          <h2 className="card-title">Create an Account</h2>
          <p className="card-description">Enter your information to create an account</p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  className="form-input"
                  placeholder="John"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  className="form-input"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">Company Name (Optional)</label>
              <input
                id="company"
                name="company"
                className="form-input"
                placeholder="Acme Inc."
                value={form.company}
                onChange={handleChange}
              />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button 
              type="submit" 
              className={`btn btn-primary ${isLoading ? "loading" : ""}`} 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>

        <div className="card-footer">
          <p className="switch-prompt">
            Already have an account?{" "}
            <Link to="/login" className="switch-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

