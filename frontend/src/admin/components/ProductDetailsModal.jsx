import React from "react";

const ProductDetailsModal = ({ isOpen, closeModal, product }) => {
  if (!isOpen || !product) return null;

  // Parse JSON string fields
  let images = [];
  let sizes = [];
  let colors = [];

  try {
    images = JSON.parse(product.images || "[]");
    sizes = JSON.parse(product.sizes || "[]");
    colors = JSON.parse(product.colors || "[]");
  } catch (e) {
    console.error("Error parsing JSON fields", e);
  }

  return (
    <div className="modal is-open">
      <div className="modal-content max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <button className="modal-close float-right" onClick={closeModal}>X</button>
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

        {/* Image Gallery */}
        <div className="flex gap-2 overflow-x-auto mb-4">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Product image ${idx + 1}`}
              className="w-40 h-40 object-cover rounded border"
            />
          ))}
        </div>

        {/* Product Info */}
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Subcategory:</strong> {product.subcategory}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Rating:</strong> {product.rating} ⭐</p>
        <p><strong>In Stock:</strong> {product.in_stock ? "Yes" : "No"} Quantity : {product.in_stock}</p>
        <p><strong>Is New:</strong> {product.is_new ? "Yes" : "No"}</p>
        <p><strong>Discount:</strong> {product.discount}%</p>

        {/* Sizes */}
        {sizes.length > 0 && (
          <p>
            <strong>Sizes:</strong> {sizes.join(", ")}
          </p>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <p>
            <strong>Colors:</strong>{" "}
            {colors.map((color, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  backgroundColor: color,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  marginRight: "6px",
                  border: "1px solid #ccc",
                }}
                title={color}
              />
            ))}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
