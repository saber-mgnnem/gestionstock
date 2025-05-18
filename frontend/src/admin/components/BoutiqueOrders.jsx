import { useState, useEffect } from "react";
import axios from "axios";

const BoutiqueOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeIdFilter, setEmployeIdFilter] = useState("");
  const [employees, setEmployees] = useState([]);

  // Fetch employees with role "employ"
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5050/users");
      const onlyEmployees = response.data.filter(user => user.role === "employ");
      setEmployees(onlyEmployees);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5050/ordersboutique");
      const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchOrders();
  }, []);

  // Filter orders by search term and employe_id
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm) ||
      order.order_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEmploye =
      !employeIdFilter || order.employe_id?.toString() === employeIdFilter;

    return matchesSearch && matchesEmploye;
  });

 

  const getEmployeeNameById = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee ? employee.company : "Unknown";
  };

  const totalPrice = filteredOrders.reduce((sum, order) => {
    return sum + (parseFloat(order.total_amount) || 0);
  }, 0);
  

  return (
    <div className="container mx-auto py-10 px-10">
      <div className="card">
        <div className="card-header">
          <div className="header-content">
            <h2 className="card-title">Boutique Orders</h2>
          </div>
          <div className="search-container flex gap-2">
            <input
              type="text"
              placeholder="Search by name, phone, order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={employeIdFilter}
              onChange={(e) => setEmployeIdFilter(e.target.value)}
              className="search-input"
            >
              <option value="">Filter by Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.company}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-content">
  <table className="table">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Employee</th>
        <th>Customer Name</th>
        <th>Phone</th>
        <th>Payment Method</th>
        <th>Paid</th>
        <th>Total</th>
        <th>Change</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <tr key={order.id} className="table-row">
            <td>{order.order_id}</td>
            <td>{getEmployeeNameById(order.employe_id)}</td>
            <td>{order.customer_name}</td>
            <td>{order.customer_phone}</td>
            <td>{order.payment_method}</td>
            <td>{order.amount_paid}</td>
            <td>{order.total_amount}</td>
            <td>{order.change_given}</td>
            <td>{new Date(order.date).toLocaleString()}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="10" className="empty-message">
            No orders found.
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {/* ✅ Move this outside the <table> */}
  <div className="mt-4 flex justify-end font-semibold text-lg">
    Total Price of Orders: {totalPrice.toFixed(2)} DA
  </div>
</div>

      </div>
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

export default BoutiqueOrders;

    

  

     
