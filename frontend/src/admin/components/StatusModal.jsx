// StatusModal.js
import React, { useState, useEffect } from "react";

const StatusModal = ({ isOpen, closeModal, order, handleSave }) => {
  const [status, setStatus] = useState(order?.status || "Pending");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!order) return;
    handleSave({ ...order, status }); // Call passed-in update function
    closeModal(); // Close modal
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "is-open" : ""}`}>
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>
          X
        </button>
        <h2>Update Order Status</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusModal;
