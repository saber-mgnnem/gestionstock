import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios'; // Import axios for API calls
import ProductCard from "../components/ProductCard";
import "./shop.css";

export default function Page() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const initialCategory = searchParams.get("category") || "all";
  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "default";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userId, setUserId] = useState('');
 useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setUserId(parsedUser.id);
    }
  }, []);
  // Fetch categories and products from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories from the API
        console.log("Fetching categories...");
        const categoriesResponse = await axios.get("http://localhost:5050/categories");
        console.log("Categories fetched:", categoriesResponse.data);
        setCategories(categoriesResponse.data);

        // Fetch products from the API
        console.log("Fetching products...");
        const productsResponse = await axios.get("http://localhost:5050/products");
        console.log("Products fetched:", productsResponse.data);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [activeCategory, activeFilter, activeSort, priceRange, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    // Filter by "new" or "sale"
    if (activeFilter === "new") {
      filtered = filtered.filter(product => product.isNew);
    } else if (activeFilter === "sale") {
      filtered = filtered.filter(product => product.isSale);
    }

    // Filter by price
    filtered = filtered.filter(product => {
      const price = product.isSale
        ? product.price - (product.price * product.discount) / 100
        : product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    if (activeSort === "price-low") {
      filtered.sort((a, b) => {
        const priceA = a.isSale ? a.price - (a.price * a.discount) / 100 : a.price;
        const priceB = b.isSale ? b.price - (b.price * b.discount) / 100 : b.price;
        return priceA - priceB;
      });
    } else if (activeSort === "price-high") {
      filtered.sort((a, b) => {
        const priceA = a.isSale ? a.price - (a.price * a.discount) / 100 : a.price;
        const priceB = b.isSale ? b.price - (b.price * b.discount) / 100 : b.price;
        return priceB - priceA;
      });
    } else if (activeSort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSortChange = (e) => {
    setActiveSort(e.target.value);
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = isNaN(value) ? 0 : value;
    setPriceRange(newRange);
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setActiveFilter("all");
    setActiveSort("default");
    setPriceRange([0, 200]);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-header">
          <h1 className="shop-title">Shop</h1>
          <button className="filter-toggle" onClick={toggleFilters}>
            {showFilters ? "Hide Filters" : "Show Filters"} 🔍
          </button>
        </div>

        <div className="shop-content">
          <aside className={`shop-sidebar ${showFilters ? "show" : ""}`}>
            <div className="filter-section">
              <h3 className="filter-title">Categories</h3>
              <ul className="category-list">
                <li
                  className={activeCategory === "all" ? "active" : ""}
                  onClick={() => handleCategoryChange("all")}
                >
                  All Categories
                </li>
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className={activeCategory === category.id ? "active" : ""}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add your filters here */}    <div className="filter-section">
              <h3 className="filter-title">Filter By</h3>
              <ul className="filter-list">
                <li
                  className={activeFilter === "all" ? "active" : ""}
                  onClick={() => handleFilterChange("all")}
                >
                  All Products
                </li>
                <li
                  className={activeFilter === "new" ? "active" : ""}
                  onClick={() => handleFilterChange("new")}
                >
                  New Arrivals
                </li>
                <li
                  className={activeFilter === "sale" ? "active" : ""}
                  onClick={() => handleFilterChange("sale")}
                >
                  On Sale
                </li>
              </ul>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">Price Range</h3>
              <div className="price-inputs">
                <div className="price-input">
                  <label>Min:</label>
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                  />
                </div>
                <div className="price-input">
                  <label>Max:</label>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                  />
                </div>
              </div>
              <div className="price-range">
                <span>${priceRange[0]}</span> - <span>${priceRange[1]}</span>
              </div>
            </div>
          </aside>

          <div className="shop-main">
            <div className="shop-toolbar">
              <div className="product-count">{filteredProducts.length} Products</div>
              <div className="sort-options">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={activeSort} onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} userId={userId} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
