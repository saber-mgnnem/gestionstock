import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./StatusModal"; // Import the Modal component
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOrder, setNewOrder] = useState({ customer_name: "", product: "", quantity: 0, status: "Pending" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [sortField, setSortField] = useState("date"); // <-- add this
  const [sortDirection, setSortDirection] = useState("asc"); // <-- and this

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5050/orders");
      const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  
  useEffect(() => {
    fetchOrders();
  }, []);


  const filteredOrders = [...orders].sort((a, b) => {
    const aField = a[sortField] ?? "";
    const bField = b[sortField] ?? "";
  
    if (sortField === "total" || sortField === "items") {
      return sortDirection === "asc" ? aField - bField : bField - aField;
    } else {
      return sortDirection === "asc"
        ? String(aField).localeCompare(String(bField))
        : String(bField).localeCompare(String(aField));
    }
  });
  

  // Update order
  const handleUpdateOrder = async (orderData) => {
    try {
      await axios.put(`http://localhost:5050/orders/${orderData.id}`, orderData);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order", error);
    }
  };

  // Delete order
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order", error);
    }
  };

 
  const handleOpenEditModal = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const totalPrice = filteredOrders.reduce((sum, order) => {
    return sum + (parseFloat(order.total_amount) || 0);
  }, 0);
  
  return (
    <div className="container mx-auto py-10 px-10">
        <div className="card">
        <div className="card-header">
          <div className="header-content">
            <h2 className="card-title">Orders</h2>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search orders..."
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
                <th>Order ID</th>
                <th>Customer Phone</th>
                <th>Order Number</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td>{order.id}</td>
                    <td className="font-medium">{order.phone}</td>
                    <td>{order.order_number}</td>
                    <td>{order.total_amount}</td>
                    <td>
                      <span className="role-badge">{order.status}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                      

                        <button
                          className="action-button edit-button"
                          onClick={() => handleOpenEditModal(order)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDeleteOrder(order.id)}
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
                  <td colSpan="6" className="empty-message">No orders found matching your search.</td>
                </tr>
              )}
            </tbody>
             {/* ✅ Move this outside the <table> */}
  <div className="mt-4 flex justify-end font-semibold text-lg">
    Total Price of Orders: {totalPrice.toFixed(2)} DA
  </div>
          </table>
        </div>
      </div>
       {/* Modal for Add/Edit User */}
       <Modal
  isOpen={isModalOpen}
  closeModal={closeModal}
  order={currentOrder} // ✅ was "user" before
  handleSave={handleUpdateOrder}
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
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal.is-open {
  display: flex;
}

.modal-content {
  background-color: white;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  background: none; /* Removes any background */
  border: none; /* Removes the border */
  outline: none; /* Removes any outline */
  color: inherit; 
  padding: 0; /* Removes any padding */
}


.form-group {
  margin-bottom: 15px;
}

input, select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.btn-save {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

      `}</style>

  
    </div>
  );
};
    
export default Orders;
