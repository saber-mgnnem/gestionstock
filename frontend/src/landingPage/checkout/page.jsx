"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkout.css";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("checkoutCart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "credit-card",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "United States",
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.phone &&
      !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }

      if (!formData.cardName) {
        newErrors.cardName = "Name on card is required";
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please use MM/YY format";
      }

      if (!formData.cvv) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const orderNum = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  
      const orderData = {
        userId: user.id,
        orderNumber: orderNum,
        totalAmount: total.toFixed(2),
        shippingAddress: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        status: "Pending",
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      };
  
      const response = await axios.post("http://localhost:5050/orders", orderData);
  
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to place order");
      }
  
      localStorage.removeItem("checkoutCart");
      setCartItems([]);
      setOrderNumber(orderNum);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order. Please try again.");
    }
  };
  

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-number">
              Order Number: <span>{orderNumber}</span>
            </p>
            <p className="success-message">
              Thank you for your purchase! We've sent a confirmation email with
              your order details.
            </p>
            <div className="success-actions">
              <Link to="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
              <Link to="/ordres" className="btn btn-primary">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* You can keep your full form JSX here unchanged from before */}
            {/* ... */}
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                </div>
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
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Shipping Address</h2>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "error" : ""}
                />
                {errors.address && <div className="error-message">{errors.address}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && <div className="error-message">{errors.city}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State/Province *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? "error" : ""}
                  />
                  {errors.state && <div className="error-message">{errors.state}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP/Postal Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={errors.zipCode ? "error" : ""}
                  />
                  {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={errors.country ? "error" : ""}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                  </select>
                  {errors.country && <div className="error-message">{errors.country}</div>}
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>
              <button
  type="submit"
  className="btn btn-primary"
  disabled={!user || cartItems.length === 0}
>
  Place Order
</button>

            </div>
          </form>

          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div
                  className="summary-item"
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                >
                  <div className="item-image">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                    />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
