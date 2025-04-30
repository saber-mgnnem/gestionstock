import React, { useState, useEffect } from "react";

const CategoryModal = ({ isOpen, closeModal, user, handleSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    subcategories: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        <h2 className="modal-title">{user?.id ? "Edit Category" : "Add Category"}</h2>

        <form onSubmit={onSave}>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter category name"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label>Subcategories (comma separated)</label>
            <input
              type="text"
              name="subcategories"
              value={formData.subcategories}
              onChange={handleChange}
              placeholder="Example: Phones, Laptops, Accessories"
            />
          </div>

          <button type="submit" className="btn-save">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
