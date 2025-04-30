import { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, userId }) => {
  const [cartStatus, setCartStatus] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState(false);

  const discountedPrice = product.isSale
    ? product.price - (product.price * product.discount) / 100
    : product.price;

    const handleAddToCart = async () => {
      try {
        if (!userId) {
          alert("You need to be logged in to add items to the cart.");
          
        }
    
    
        const response = await axios.post('http://localhost:5050/cart', {
          userId,
          productId: product.id,
          quantity: 1,
        });
    
        if (response.status === 200) {
          setCartStatus(true);
          alert(response.data.message); // Show success message
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('An error occurred while adding the product to the cart.');
      }
    };
    
    
  const handleAddToWishlist = async () => {
    try {
      if (!userId) {
        alert("You need to be logged in to add items to the wishlist.");
        return;
      }

      const response = await axios.post('http://localhost:5050/wishlist', {
        userId,
        productId: product.id,
      });

      if (response.status === 200) {
        setWishlistStatus(true);
        alert(response.data.message); // Show success message
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('An error occurred while adding the product to the wishlist.');
    }
  };

  let productImage = "/placeholder.svg";
  if (product.images) {
    try {
      const imagesArray = Array.isArray(product.images)
        ? product.images
        : JSON.parse(product.images);
      productImage = imagesArray[0] || "/placeholder.svg";
    } catch (error) {
      console.error("Error parsing product images:", error);
    }
  }

  return (
    <div className={`product-card ${product.in_stock < 1 ? 'out-of-stock' : ''}`}>
    <div className="product-image-container">
      <img src={productImage} alt={product.name} className="product-image" />
  
      {product.isSale && (
        <span className="product-badge sale">{product.discount}% OFF</span>
      )}
  
      {product.isNew && (
        <span className="product-badge new">NEW</span>
      )}
  
      <div className="product-actions">
        <button
          className="action-button cart-button"
          aria-label="Add to cart"
          onClick={handleAddToCart}
          disabled={product.in_stock < 1}
          style={{ cursor: product.in_stock < 1 ? "not-allowed" : "pointer", opacity: product.in_stock < 1 ? 0.5 : 1 }}
        >
          {product.in_stock < 1 ? "🚫" : (cartStatus ? "✅" : "🛒")}
        </button>
      </div>
    </div>
  
    <div className="product-info">
      <h3 className="product-name">{product.name}</h3>
      <h3 className="product-name">Stock:           {product.in_stock < 1 ? "out of stock" : product.in_stock}
      </h3>
  
      <div className="product-category">
        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
      </div>
  
      <div className="product-price">
        {product.isSale && (
          <span className="original-price">${product.price.toFixed(2)}</span>
        )}
        <span className="current-price">${discountedPrice.toFixed(2)}</span>
      </div>
  
      <div className="product-rating">
        {"★".repeat(Math.floor(product.rating))}
        {"☆".repeat(5 - Math.floor(product.rating))}
        <span className="review-count">({product.reviews})</span>
      </div>
    </div>
  </div>
  
  );
};

export default ProductCard;
