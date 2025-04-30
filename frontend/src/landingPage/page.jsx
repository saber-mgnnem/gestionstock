import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import CategoryCard from "./components/CategoryCard";
import "./home.css";

export default function Home() {
  // State variables to store fetched products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading states for products and categories
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5050/products"); // replace with your actual API URL
        const data = await response.json();
        setProducts(data);
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5050/categories"); // replace with your actual API URL
        const data = await response.json();
        setCategories(data);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4);

  // Get new arrivals (products with isNew flag)
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);

  // Get sale products (products with isSale flag)
  const saleProducts = products.filter((product) => product.isSale).slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Summer Collection 2025</h1>
            <p className="hero-subtitle">Discover the latest trends in fashion</p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                Shop Now
              </Link>
              <Link to="/categories" className="btn btn-outline">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {loadingCategories ? (
              <p>Loading categories...</p>
            ) : (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="product-grid">
            {loadingProducts ? (
              <p>Loading products...</p>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          <div className="text-center mt-4">
            <Link to="/shop" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

     

     

    

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-text">On orders over $50</p>
            </div>
            <div className="feature">
              <div className="feature-icon">↩️</div>
              <h3 className="feature-title">Easy Returns</h3>
              <p className="feature-text">30 days return policy</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-text">100% secure checkout</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-text">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
            <p className="newsletter-text">Get the latest updates on new products and upcoming sales</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" className="newsletter-input" required />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

