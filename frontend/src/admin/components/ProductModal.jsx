import React, { useState, useEffect } from "react";

const ProductModal = ({ isOpen, closeModal, product, handleSave, categories = [], subcategories = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    description: "",
    images: "",
    sizes: "",
    colors: "",
    rating: "",
    reviews: "",
    in_stock: false,
    is_new: false,
    is_sale: false,
    discount: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSave = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "is-open" : ""}`}>
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>
          ✖️
        </button>
        <h2 className="modal-title">{product?.id ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={onSave}>
          {/* Product Name */}
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price ($)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="form-group">
            <label>Subcategory</label>
            <select name="subcategory" value={formData.subcategory} onChange={handleChange}>
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          {/* Images */}
          <div className="form-group">
            <label>Images (URLs comma-separated)</label>
            <textarea name="images" value={formData.images} onChange={handleChange} rows="2" placeholder="http://... , http://..." />
          </div>

          {/* Sizes */}
          <div className="form-group">
            <label>Sizes (comma-separated)</label>
            <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="S, M, L, XL" />
          </div>

          {/* Colors */}
          <div className="form-group">
            <label>Colors (comma-separated)</label>
            <input type="text" name="colors" value={formData.colors} onChange={handleChange} placeholder="Red, Blue, Green" />
          </div>

          {/* Rating */}
          <div className="form-group">
            <label>Rating</label>
            <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} />
          </div>

          {/* Reviews */}
          <div className="form-group">
            <label>Reviews</label>
            <input type="number" name="reviews" value={formData.reviews} onChange={handleChange} />
          </div>

          {/* In Stock */}
          <div className="form-group">
            <label>
              <input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} /> In Stock
            </label>
          </div>

          {/* Is New */}
          <div className="form-group">
            <label>
              <input type="checkbox" name="is_new" checked={formData.is_new} onChange={handleChange} /> New Arrival
            </label>
          </div>

          {/* Is Sale */}
          <div className="form-group">
            <label>
              <input type="checkbox" name="is_sale" checked={formData.is_sale} onChange={handleChange} /> On Sale
            </label>
          </div>

          {/* Discount */}
          <div className="form-group">
            <label>Discount (%)</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-save">
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
