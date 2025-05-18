"use client";
import BarChart from "./BarChart";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./StatusModal"; // Import the Modal component
const API_URL = "http://localhost:5050"; // Define your API base URL

// Dashboard component
const Dashboard = () => {
  const [period, setPeriod] = useState("monthly");
  const [metrics, setMetrics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [salesSeries, setSalesSeries] = useState([]);
  const [ordersSeries, setOrdersSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metrics with selected period
        const metricsResponse = await axios.get(
          `${API_URL}/metrics?period=${period}`
        );
        setMetrics(metricsResponse.data.metrics || []);

        const salesResponse = await axios.get(
          `${API_URL}/sales?period=${period}`
        );
        setSalesSeries(salesResponse.data);
        console.log(salesSeries)
        const ordersCountResponse = await axios.get(
          `${API_URL}/orders/count?period=${period}`
        );
        setOrdersSeries(ordersCountResponse.data);
        console.log(ordersSeries)
        // Fetch recent orders
        const ordersResponse = await axios.get(`${API_URL}/orders`);
        const sortedOrders = ordersResponse.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRecentOrders(sortedOrders.slice(0, 10));

        // Fetch top products
        const productsResponse = await axios.get(`${API_URL}/products`);
        const filteredProducts = productsResponse.data.filter(
          (product) => product.reviews > 50
        );
        setTopProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };
  const handleOpenEditModal = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Update order
  const handleUpdateOrder = async (orderData) => {
    try {
      await axios.put(`http://localhost:5050/orders/${orderData.id}`, orderData);
      const ordersResponse = await axios.get(`${API_URL}/orders`);
      const allOrders = ordersResponse.data;

      // Assuming each order has a timestamp or ID to sort by
      const sortedOrders = [...allOrders].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const latestTenOrders = sortedOrders.slice(0, 10);

      setRecentOrders(latestTenOrders);
    } catch (error) {
      console.error("Error updating order", error);
    }
  };
  // Helper function to get badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success";
      case "processing":
        return "bg-primary";
      case "shipped":
        return "bg-warning";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid bg-light py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Sales Dashboard</h2>
        <div className="d-flex gap-2">
          <select className="form-select" value={period} onChange={handlePeriodChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="row g-3 mb-4">
        {metrics.map((metric) => (
          <div className="col-12 col-md-6 col-lg-3" key={metric.id}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">{metric.title}</h6>
                <h3 className="card-title mb-2">{metric.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Top Products */}
      <div className="row mb-4">
        <div >
            <BarChart  salesData={salesSeries}  ordersData={ordersSeries}/>

        <div className="">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Top Selling Products</h5>
              <div className="d-flex flex-column gap-3">
                {topProducts.map((product) => (
                  <div
                    className="d-flex justify-content-between pb-3 border-bottom"
                    key={product.id}
                  >
                    <div>
                      <div className="fw-bold">{product.name}</div>
                      <div className="small text-muted">{product.category}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{product.sold} sold</div>
                      <div className="small text-muted">{product.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title m-0">Recent Orders</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Orders Number</th>
                  <th>Date</th>
                  <th>City</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.order_number}</td>
                    <td>{order.created_at}</td>
                    <td>{order.city}</td>
                    <td>{order.total_amount}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => handleOpenEditModal(order)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        order={currentOrder} // ✅ was "user" before
        handleSave={handleUpdateOrder}
      />

      <style>{`
        .modal {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
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
          background: none;
          border: none;
          outline: none;
          color: inherit;
          padding: 0;
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
    </div>
  );
};

export default Dashboard;
