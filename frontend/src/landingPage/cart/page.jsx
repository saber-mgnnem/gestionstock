// src/pages/CartPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./cart.css";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const fetchCartData = async () => {
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const userId = parsedUser?.id;
    if (!userId) {
      console.log("No user ID found");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5050/cart/${userId}`);
      setCartData(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartData((prevData) =>
      prevData.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartData((prevData) => prevData.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartData([]);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toLowerCase() === "discount10") {
      const subtotal = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setDiscount(subtotal * 0.1);
      alert("Coupon applied successfully!");
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const subtotal = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping - discount;

  if (cartData.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Your Cart</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <div className="cart-header-product">Product</div>
              <div className="cart-header-price">Price</div>
              <div className="cart-header-quantity">Quantity</div>
              <div className="cart-header-total">Total</div>
              <div className="cart-header-action">Actions</div>
            </div>

            {cartData.map((item, index) => {
              const itemTotal = item.price * item.quantity;

              return (
                <div className="cart-item" key={`${item.id}-${index}`}>
                  <div className="cart-item-product">
                  
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      {/* Optional: If your backend sends size/color, display here */}
                      {/* <div className="cart-item-meta">
                        {item.size && <span className="cart-item-size">Size: {item.size}</span>}
                        {item.color && (
                          <span className="cart-item-color">
                            Color:
                            <span className="color-dot" style={{ backgroundColor: item.color }}></span>
                          </span>
                        )}
                      </div> */}
                    </div>
                  </div>

                  <div className="cart-item-price">${item.price.toFixed(2)}</div>

                  <div className="cart-item-quantity">
                    <div className="quantity-selector">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">${itemTotal.toFixed(2)}</div>

                  <div className="cart-item-action">
                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="cart-actions">
              <Link to="/shop" className="btn btn-outline">
                Continue Shopping
              </Link>
              <button className="btn btn-outline clear-cart-btn" onClick={handleClearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="coupon-form">
              <form onSubmit={handleApplyCoupon}>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button type="submit" className="btn btn-outline">
                  Apply
                </button>
              </form>
              <div className="coupon-hint">Try "DISCOUNT10" for 10% off</div>
            </div>

            <div className="summary-items">
              <div className="summary-item">
                <span className="summary-item-label">Subtotal</span>
                <span className="summary-item-value">${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-item">
                <span className="summary-item-label">Shipping</span>
                <span className="summary-item-value">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>

              {discount > 0 && (
                <div className="summary-item discount">
                  <span className="summary-item-label">Discount</span>
                  <span className="summary-item-value">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-item total">
                <span className="summary-item-label">Total</span>
                <span className="summary-item-value">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary checkout-btn"
              onClick={() => {
                localStorage.setItem('checkoutCart', JSON.stringify(cartData)); // save cart to localStorage
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </button>


            <div className="payment-methods">
              <div className="payment-method-title">We Accept</div>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">💵</span>
                <span className="payment-icon">🏦</span>
                <span className="payment-icon">💰</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
