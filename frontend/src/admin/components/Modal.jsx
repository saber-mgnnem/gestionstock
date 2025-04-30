import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, closeModal, user, handleSave }) => {
  const [userData, setUserData] = useState(user || { first_name: "", last_name: "", email: "", password: "", company: "", role: "user" });

  useEffect(() => {
    if (user) {
      setUserData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        company: user.company,
        role: user.role,
      });
    } else {
      setUserData({ first_name: "", last_name: "", email: "", password: "", company: "", role: "user" });
    }
  }, [user]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (either add or update user)
  const handleSubmit = () => {
    handleSave(userData);  // Calls the handleSave function passed via props
    closeModal();  // Close the modal after saving
  };

  return (
    <div className={`modal ${isOpen ? "is-open" : ""}`}>
      <div className="modal-content">
        <button className="modal-close  " onClick={closeModal}>
          X
        </button>
        <h2>{user ? "Edit User" : "Add User"}</h2>
        <form>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          {!user && ( // Only show password field when adding a new user
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={userData.company}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="employ">Employ</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="button" className="btn-save" onClick={handleSubmit}>
            {user ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;

