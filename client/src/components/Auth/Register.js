import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import "./Styles/Register.css";
import { useMyContext } from "../universal/MyContext";
import CustomAlert from "../universal/CustomAlert";

const Register = () => {
  const [userData, setUserData] = useState({
    email: "",
    Technoid: "",
    username: "",
    password: "",
    confirmPassword: "",
    department: "user",
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState({ email: "", username: "", department: "", Technoid: "" });
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(null);

  const { authState } = useMyContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Check permissions early
  if (!authState.role || authState.role !== "Admin") {
    return (
      <div className="container-fluid lite-container">
        <div className="alert alert-danger lite-alert" role="alert">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        setError("Failed to fetch users: " + data.message);
        setShowAlert({ message: "Failed to fetch users: " + data.message, type: "error" });
      }
    } catch (err) {
      setError("Failed to fetch users: " + err.message);
      setShowAlert({ message: "Failed to fetch users: " + err.message, type: "error" });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      setShowAlert({ message: "Passwords do not match", type: "error" });
      return;
    }
    setRegisterLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.status === 201) {
        setShowAlert({ message: "Registration successful! User added.", type: "success" });
        setUserData({
          email: "",
          username: "",
          Technoid: "",
          password: "",
          confirmPassword: "",
          department: "user",
        });
        fetchUsers();
      } else {
        setError(data.message || "Registration failed");
        setShowAlert({ message: data.message || "Registration failed", type: "error" });
      }
    } catch (err) {
      setError("Registration failed: " + err.message);
      setShowAlert({ message: "Registration failed: " + err.message, type: "error" });
    }
    setRegisterLoading(false);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingUser),
      });
      const data = await response.json();
      if (response.ok) {
        setShowAlert({ message: "User updated successfully", type: "success" });
        fetchUsers();
        setEditingUser(null);
      } else {
        setError(data.message || "Failed to update user");
        setShowAlert({ message: data.message || "Failed to update user", type: "error" });
      }
    } catch (err) {
      setError("Failed to update user: " + err.message);
      setShowAlert({ message: "Failed to update user: " + err.message, type: "error" });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    applyFilters({ ...filter, [name]: value });
  };

  const applyFilters = (currentFilter) => {
    let filtered = [...users];
    if (currentFilter.username) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(currentFilter.username.toLowerCase())
      );
    }
    if (currentFilter.department) {
      filtered = filtered.filter((user) => user.department === currentFilter.department);
    }
    if (currentFilter.Technoid) {
      filtered = filtered.filter((user) =>
        user.technoid?.toLowerCase().includes(currentFilter.Technoid.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
      </div>
    );
  }
  

  return (
    <div className="container-fluid lite-container">
     {showAlert && (
        <CustomAlert
          message={showAlert.message}
          type={showAlert.type}
          onClose={() => setShowAlert(null)}
        />
      )}
      {error && (
        <div className="alert alert-danger lite-alert" role="alert">
          {error}
        </div>
      )}

      <section className="mb-5">
        <div className="card lite-card">
          <div className="card-body">
            <h2 className="card-title lite-title">Register New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label lite-label">Email</label>
                  <input
                    type="email"
                    className="form-control lite-input"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="username" className="form-label lite-label">Username</label>
                  <input
                    type="text"
                    className="form-control lite-input"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="department" className="form-label lite-label">Department</label>
                  <select
                    className="form-select lite-input"
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Employee">Employee</option>
                    <option value="Contract">Contract</option>
                    <option value="Ntid Creation Team">Ntid Creation Team</option>
                    <option value="Ntid Setup team">Ntid Setup Team</option>
                    <option value="Training Team">Training Team</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                {userData.department === "Employee" && (
                  <div className="col-md-6">
                    <label htmlFor="Technoid" className="form-label lite-label">Technoid</label>
                    <input
                      type="text"
                      className="form-control lite-input"
                      id="Technoid"
                      name="Technoid"
                      value={userData.Technoid}
                      onChange={handleChange}
                      placeholder="Enter Technoid"
                      required
                    />
                  </div>
                )}
                <div className="col-md-6 position-relative">
                  <label htmlFor="password" className="form-label lite-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control lite-input"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="lite-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label lite-label">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control lite-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn lite-btn-primary mt-3 w-100 text-white fw-bolder">
                {registerLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <span>Register</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section>
        <div className="card lite-card">
          <div className="card-body">
            <h2 className="card-title lite-title">Manage Employees</h2>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control lite-input"
                  placeholder="Filter by Username"
                  name="username"
                  value={filter.username}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select lite-input"
                  name="department"
                  value={filter.department}
                  onChange={handleFilterChange}
                >
                  <option value="">Filter by department</option>
                  <option value="Employee">Employee</option>
                  <option value="Contract">Contract</option>
                  <option value="Ntid Creation Team">Ntid Creation Team</option>
                  <option value="Ntid Setup team">Ntid Setup Team</option>
                  <option value="Training Team">Training Team</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control lite-input"
                  placeholder="Filter by Technoid"
                  name="Technoid"
                  value={filter.Technoid}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="lite-users-list">
              {filteredUsers.map((user) => (
                <div key={user.id} className="lite-user-item mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                      <p className="mb-1"><strong>Username:</strong> {user.username}</p>
                      <p className="mb-1"><strong>Department:</strong> {user.department}</p>
                      <p className="mb-1"><strong>Technoid:</strong> {user.technoid || "N/A"}</p>
                      <p className="mb-1"><strong>Salary:</strong> {user.salary || "N/A"}</p>
                      <p className="mb-1"><strong>Position:</strong> {user.position_id || "N/A"}</p>
                    </div>
                    <button
                      className="btn lite-btn-edit"
                      onClick={() => setEditingUser(user)}
                    >
                      <FaEdit /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {editingUser && (
        <div className="lite-modal">
          <div className="lite-modal-content">
            <h3 className="lite-title">Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-3">
                <label htmlFor="editEmail" className="form-label lite-label">Email</label>
                <input
                  type="email"
                  className="form-control lite-input"
                  id="editEmail"
                  value={editingUser.email}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editSalary" className="form-label lite-label">Salary</label>
                <input
                  type="number"
                  className="form-control lite-input"
                  id="editSalary"
                  value={editingUser.salary || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, salary: e.target.value })}
                  placeholder="Enter salary"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editPosition" className="form-label lite-label">Position</label>
                <input
                  type="text"
                  className="form-control lite-input"
                  id="editPosition"
                  value={editingUser.position_id || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, position_id: e.target.value })}
                  placeholder="Enter position"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn lite-btn-success">Update</button>
                <button
                  type="button"
                  className="btn lite-btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { Register };