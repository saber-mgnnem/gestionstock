import { useState, useEffect } from "react";
import axios from "axios";
import ProductModal from "./ProductModal"; // Correct import
import ProductDetailsModal from "./ProductDetailsModal"

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For editing

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  // Fetch Products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5050/products");
      setProducts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
  const handleViewProduct = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:5050/products/${productId}`);
      setProductDetails(response.data);
      setIsProductModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details", error);
    }
  };
  // Fetch Categories (optional, if you want dropdowns dynamic)
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5050/categories"); // adapt if needed
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("http://localhost:5050/subcategories"); // adapt if needed
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Filter Products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add new product
  const handleAddProduct = async (productData) => {
    try {
      await axios.post("http://localhost:5050/products", productData);
      fetchProducts(); // Refresh after add
      closeModal();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  // Update product
  const handleUpdateProduct = async (productData) => {
    try {
      await axios.put(`http://localhost:5050/products/${currentProduct.id}`, productData);
      fetchProducts(); // Refresh after update
      closeModal();
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/products/${id}`);
      fetchProducts(); // Refresh after delete
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleOpenAddModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto py-10 px-10">
      <div className="card">
        <div className="card-header">
          <div className="header-content">
            <h2 className="card-title">Products</h2>
            <button className="add-button" onClick={handleOpenAddModal}>
              <span className="icon">+</span> Add Product
            </button>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="card-content">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price ($)</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td>{product.id}</td>
                    <td className="font-medium">{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category || '-'}</td>
                    <td>{product.subcategory || '-'}</td>
                    <td>{product.in_stock ? 'In Stock' : 'Out of Stock'}</td>
                    <td>
                      <div className="action-buttons">
                      <button
                        className="action-button view-button"
                        onClick={() => handleViewProduct(product.id)} // Replace with actual field
                        title="View Product"
                      >
                        👁️
                      </button>
                        <button
                          className="action-button edit-button"
                          onClick={() => handleOpenEditModal(product)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        product={currentProduct}
        handleSave={currentProduct ? handleUpdateProduct : handleAddProduct}
        categories={categories}
        subcategories={subcategories}
      />
      <ProductDetailsModal
  isOpen={isProductModalOpen}
  closeModal={() => setIsProductModalOpen(false)}
  product={productDetails}
/>

            <style>{`
        .container {
          width: 100%;
          margin: 0 auto;
        }
        .card{
                  margin-right: 30px;

        }
        
        
        
        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        
        .add-button {
          display: flex;
          align-items: center;
          background-color: #0284c7;
          color: white;
          border: none;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-button:hover {
          background-color: #1d4ed8;
        }
        
        .add-button .icon {
          margin-right: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
        }
        
        .search-container {
          max-width: 300px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        
        .search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .card-content {
          padding: 1rem;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .table th,
        .table td {
          text-align: center;
          vertical-align: middle;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .table th {
          font-weight: 500;
          color: #4b5563;
          background-color: #f9fafb;
        }
        
        .table-row:hover {
          background-color: #f9fafb;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .role-admin {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .role-editor {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .role-user {
          background-color: #f3f4f6;
          color: #4b5563;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .view-button {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .view-button:hover {
          background-color: #bfdbfe;
        }
        
        .edit-button {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .edit-button:hover {
          background-color: #fde68a;
        }
        
        .delete-button {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        
        .delete-button:hover {
          background-color: #fecaca;
        }
        
        .action-icon {
          font-size: 1rem;
        }
        
        .empty-message {
          text-align: center;
          padding: 1.5rem;
          color: #6b7280;
        }
        
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.02);
        }
      .modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Dim background */
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal.is-open {
  display: flex;
}

.modal-content {
  background: #ffffff;
  width: 90%;
  max-width: 600px; /* Maximum width */
  max-height: 90vh; /* Maximum height */
  overflow-y: auto; /* Enable vertical scroll */
  padding: 2rem;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #333;
}

.modal-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

input, textarea, select {
  width: 100%;
  padding: 10px 12px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  transition: 0.2s;
}

input:focus, textarea:focus, select:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.btn-save {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-save:hover {
  background-color: #45a049;
}


      `}</style>
    </div>
  );
};

export default Products;

