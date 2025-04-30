import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component

const Clients = () => {
  // State for storing users
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", password: "", company: "", role: "user" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // For editing a user

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5050/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new user
  const handleAddClient = async (userData) => {
    try {
      await axios.post("http://localhost:5050/users", userData);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  // Update user
  const handleUpdateClient = async (userData) => {
    try {
      await axios.put(`http://localhost:5050/users/${currentUser.id}`, userData);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user", error);
    }
  };
  // Delete user
  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/users/${id}`);
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Error deleting user", error);
    }}
  // Open modal for adding a new user
  const handleOpenAddModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing user
  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto py-10 px-10">
      <div className="card">
        <div className="card-header">
          <div className="header-content">
            <h2 className="card-title">Clients</h2>
            <button className="add-button" onClick={handleOpenAddModal}>
              <span className="icon">+</span> Add Client
            </button>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search clients..."
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
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td>{user.id}</td>
                    <td className="font-medium">{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`role-badge ${user.role === "Admin" ? "role-admin" : user.role === "Editor" ? "role-editor" : "role-user"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                      
                        <button
                          className="action-button edit-button"
                          onClick={() => handleOpenEditModal(user)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDeleteClient(user.id)}
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
                  <td colSpan="5" className="empty-message">No clients found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
       {/* Modal for Add/Edit User */}
       <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        user={currentUser}
        handleSave={currentUser ? handleUpdateClient : handleAddClient}
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

export default Clients;
