"use client"

import { useState } from "react"
import "./contact.css"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message should be at least 20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false)
        setSubmitSuccess(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      }, 1500)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Get in touch with our team.</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Our Location</h3>
              <p>123 Fashion Street</p>
              <p>Style City, SC 12345</p>
              <p>United States</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone Number</h3>
              <p>Customer Service: +1 234 567 8900</p>
              <p>Support: +1 234 567 8901</p>
              <p>Mon-Fri: 9am - 6pm EST</p>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Email Address</h3>
              <p>General Inquiries: info@stylehub.com</p>
              <p>Customer Support: support@stylehub.com</p>
              <p>Careers: careers@stylehub.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🌐</div>
              <h3>Social Media</h3>
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
          </div>

          <div className="contact-form-container">
            <h2 className="form-title">Send Us a Message</h2>
            
            {submitSuccess && (
              <div className="success-message">
                Thank you for your message! We'll get back to you as soon as possible.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  disabled={isSubmitting}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? "error" : ""}
                  disabled={isSubmitting}
                />
                {errors.subject && <div className="error-message">{errors.subject}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? "error" : ""}
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && <div className="error-message">{errors.message}</div>}
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        <div className="map-container">
          <h2 className="section-title">Find Us</h2>
          <div className="map">
            {/* In a real application, you would embed a Google Map or other map service here */}
            <div className="map-placeholder">
              <img src="/placeholder.svg?height=400&width=1200" alt="Map location" />
              <div className="map-pin">📍</div>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">What are your shipping options?</h3>
              <p className="faq-answer">
                We offer standard shipping (5-7 business days), express shipping (2-3 business days), and next-day delivery options. Shipping is free for orders over $50.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How can I track my order?</h3>
              <p className="faq-answer">
                Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What is your return policy?</h3>
              <p className="faq-answer">
                We offer a 30-day return policy for unworn items in original condition with tags attached. Returns are free for store credit, or a small fee for refunds.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you ship internationally?</h3>
              <p className="faq-answer">
                Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days depending on the destination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
