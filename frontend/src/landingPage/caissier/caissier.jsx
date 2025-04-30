"use client"

import { useState, useEffect } from "react"
import "./caissier.css"
import { useNavigate } from 'react-router-dom';
import html2pdf from "html2pdf.js";
import { useRef } from "react";
export default function Caissier() {
  const receiptRef = useRef();

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountPaid, setAmountPaid] = useState("")
  const [receiptVisible, setReceiptVisible] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setUserName(parsedUser.name);
    }
  }, []);
  const handleLogout = () => {
    logout()
  }

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
  };

  // Fetch categories and products
  useEffect(() => {
    
 
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch categories
        const categoriesResponse = await fetch("http://localhost:5050/categories")
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // Fetch products
        const productsResponse = await fetch("http://localhost:5050/products")
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products")
        }
        const productsData = await productsResponse.json()
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
        
        // Set sample data for demonstration
        const sampleCategories = [
          { id: 1, name: "Clothing" },
          { id: 2, name: "Accessories" },
          { id: 3, name: "Shoes" },
          { id: 4, name: "Beauty" }
        ]
        
        const sampleProducts = [
          { id: 1, name: "T-Shirt", price: 19.99, categoryId: 1, image: "/placeholder.svg", stock: 25 },
          { id: 2, name: "Jeans", price: 49.99, categoryId: 1, image: "/placeholder.svg", stock: 15 },
          { id: 3, name: "Handbag", price: 39.99, categoryId: 2, image: "/placeholder.svg", stock: 10 },
          { id: 4, name: "Necklace", price: 29.99, categoryId: 2, image: "/placeholder.svg", stock: 20 },
          { id: 5, name: "Sneakers", price: 59.99, categoryId: 3, image: "/placeholder.svg", stock: 12 },
          { id: 6, name: "Boots", price: 89.99, categoryId: 3, image: "/placeholder.svg", stock: 8 },
          { id: 7, name: "Lipstick", price: 14.99, categoryId: 4, image: "/placeholder.svg", stock: 30 },
          { id: 8, name: "Face Cream", price: 24.99, categoryId: 4, image: "/placeholder.svg", stock: 18 }
        ]
        
        setCategories(sampleCategories)
        setProducts(sampleProducts)
        setFilteredProducts(sampleProducts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products by category and search term
  useEffect(() => {
    let filtered = [...products]
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.categoryId === parseInt(selectedCategory)
      )
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredProducts(filtered)
  }, [selectedCategory, products, searchTerm])

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      // Update quantity if product already in cart
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ))
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove product if quantity is less than 1
      setCart(cart.filter(item => item.id !== productId))
    } else {
      // Update quantity
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ))
    }
  }

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Calculate tax (assuming 10%)
  const calculateTax = () => {
    return calculateSubtotal() * 0.1
  }

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Handle payment process
  const processPayment = async () => {
    const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}`
    setOrderId(newOrderId)
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const userid = parsedUser.id;
    const orderPayload = {
      orderId: newOrderId,
      employeeName: userid, // Replace with real session user if available
      customerInfo,
      paymentMethod,
      amountPaid: parseFloat(amountPaid) || 0,
      total: calculateTotal(),
      change: calculateChange(),
      cart
    }
  
    try {
      const response = await fetch("http://localhost:5050/ordersboutique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      })
  
      if (!response.ok) throw new Error("Failed to submit order")
  
      setOrderComplete(true)
      setShowPaymentModal(false)
      setReceiptVisible(true)
    } catch (err) {
      alert("Error processing order: " + err.message)
    }
  }
  

  // Calculate change
  const calculateChange = () => {
    const paid = parseFloat(amountPaid) || 0
    const total = calculateTotal()
    return paid > total ? paid - total : 0
  }

  // Start new order
  const startNewOrder = () => {
    setCart([])
    setCustomerInfo({ name: "", phone: "" })
    setSearchTerm("")
    setSelectedCategory("all")
    setReceiptVisible(false)
    setOrderComplete(false)
    setAmountPaid("")
    setPaymentMethod("cash")
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : "Unknown"
  }

  if (isLoading) {
    return <div className="caissier-loading">Loading...</div>
  }

  if (error && !products.length) {
    return <div className="caissier-error">Error: {error}</div>
  }
  
  return (
    <div className="caissier-container">
      {/* Header */}
      <header className="caissier-header">
        <h2>Boutique POS System</h2>
        <div className="hb">
        <div className="caissier-user-info">
          <span>Cashier: Employee Name</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
        <button onClick={handleLogout}               className="logout" 
        >
                    Logout
                  </button>
        </div>
        
      </header>

      <div className="caissier-main">
        {/* Products Section */}
        <div className="caissier-products-section">
          <div className="caissier-controls">
            <div className="caissier-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="caissier-categories">
              <button
                className={selectedCategory === "all" ? "active" : ""}
                onClick={() => setSelectedCategory("all")}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={selectedCategory === category.id.toString() ? "active" : ""}
                  onClick={() => setSelectedCategory(category.id.toString())}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="caissier-products-grid">
          {filteredProducts.length > 0 ? (
  filteredProducts.map(product => {
    const isOutOfStock = product.in_stock < 1;

    return (
      <div
        key={product.id}
        className={`caissier-product-card ${isOutOfStock ? 'disabled' : ''}`}
        onClick={() => {
          if (!isOutOfStock) {
            addToCart(product);
          }
        }}
        style={{ cursor: isOutOfStock ? 'not-allowed' : 'pointer', opacity: isOutOfStock ? 0.5 : 1 }}
      >
        <div className="caissier-product-image">
          <img src={JSON.parse(product.images)[0] || "/placeholder.svg"} alt={product.name} />
        </div>
        <div className="caissier-product-info">
          <h3>{product.name}</h3>
          <p className="caissier-product-category">{getCategoryName(product.categoryId)}</p>
          <p className="caissier-product-price">{formatCurrency(product.price)}</p>
          <p className="caissier-product-stock">
            {isOutOfStock ? 'Out of stock' : `In stock: ${product.in_stock}`}
          </p>
        </div>
      </div>
    );
  })
) : (
  <div className="caissier-no-products">No products found</div>
)}

          </div>
        </div>

        {/* Cart Section */}
        <div className="caissier-cart-section">
          <h2>Current Order</h2>
          
          {/* Customer Info */}
          <div className="caissier-customer-info">
            <div className="caissier-input-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div className="caissier-input-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          {/* Cart Items */}
          <div className="caissier-cart-items">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.id} className="caissier-cart-item">
                  <div className="caissier-cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="caissier-cart-item-actions">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button className="caissier-remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                  </div>
                  <div className="caissier-cart-item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))
            ) : (
              <div className="caissier-empty-cart">Cart is empty</div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="caissier-order-summary">
            <div className="caissier-summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="caissier-summary-row">
              <span>Tax (10%)</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>
            <div className="caissier-summary-row caissier-total">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="caissier-actions">
            <button 
              className="caissier-cancel-btn" 
              onClick={() => setCart([])}
              disabled={cart.length === 0}
            >
              Cancel Order
            </button>
            <button 
              className="caissier-checkout-btn" 
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="caissier-modal-overlay">
          <div className="caissier-payment-modal">
            <h2>Payment</h2>
            <div className="caissier-payment-details">
              <div className="caissier-payment-total">
                <span>Total Amount:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              
              <div className="caissier-payment-method">
                <label>Payment Method</label>
                <div className="caissier-payment-options">
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                    />
                    Cash
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    Card
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile"
                      checked={paymentMethod === "mobile"}
                      onChange={() => setPaymentMethod("mobile")}
                    />
                    Mobile Payment
                  </label>
                </div>
              </div>
              
              {paymentMethod === "cash" && (
                <div className="caissier-cash-payment">
                  <div className="caissier-input-group">
                    <label>Amount Received</label>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="caissier-change">
                    <span>Change:</span>
                    <span>{formatCurrency(calculateChange())}</span>
                  </div>
                </div>
              )}
              
              {paymentMethod === "card" && (
                <div className="caissier-card-payment">
                  <p>Please swipe the card or insert chip</p>
                  <div className="caissier-card-animation"></div>
                </div>
              )}
              
              {paymentMethod === "mobile" && (
                <div className="caissier-mobile-payment">
                  <p>Scan the QR code to pay</p>
                  <div className="caissier-qr-placeholder"></div>
                </div>
              )}
            </div>
            
            <div className="caissier-modal-actions">
              <button className="caissier-cancel-btn" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button 
                className="caissier-confirm-btn" 
                onClick={processPayment}
                disabled={paymentMethod === "cash" && (!amountPaid || parseFloat(amountPaid) < calculateTotal())}
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptVisible && (
        <div className="caissier-modal-overlay" >
          <div className="caissier-receipt-modal">
            <div className="caissier-receipt" ref={receiptRef}>
              <div className="caissier-receipt-header">
                <h2>Boutique Receipt</h2>
                <p>Order ID: {orderId}</p>
                <p>Date: {new Date().toLocaleString()}</p>
                {customerInfo.name && <p>Customer: {customerInfo.name}</p>}
                {customerInfo.phone && <p>Phone: {customerInfo.phone}</p>}
              </div>
              
              <div className="caissier-receipt-items">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="caissier-receipt-summary">
                <div className="caissier-receipt-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="caissier-receipt-row">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>
                <div className="caissier-receipt-row caissier-receipt-total">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
                <div className="caissier-receipt-row">
                  <span>Payment Method</span>
                  <span>{paymentMethod === "cash" ? "Cash" : paymentMethod === "card" ? "Card" : "Mobile"}</span>
                </div>
                {paymentMethod === "cash" && (
                  <>
                    <div className="caissier-receipt-row">
                      <span>Amount Paid</span>
                      <span>{formatCurrency(parseFloat(amountPaid) || 0)}</span>
                    </div>
                    <div className="caissier-receipt-row">
                      <span>Change</span>
                      <span>{formatCurrency(calculateChange())}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="caissier-receipt-footer">
                <p>Thank you for shopping with us!</p>
                <p>Please come again</p>
              </div>
            </div>
            
            <div className="caissier-receipt-actions">
            <button
              className="caissier-print-btn"
              onClick={() => {
                const element = receiptRef.current;
                const options = {
                  margin: 0.5,
                  filename: `receipt_${orderId}.pdf`,
                  image: { type: "jpeg", quality: 0.98 },
                  html2canvas: { scale: 2 },
                  jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
                };
                html2pdf().set(options).from(element).save();
              }}
            >
              Print Receipt
            </button>

              <button className="caissier-new-order-btn" onClick={startNewOrder}>
                New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
