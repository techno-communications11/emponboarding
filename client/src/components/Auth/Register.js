import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa';
import './Styles/Register.css';

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    Technoid: '',
    password: '',
    confirmPassword: '',
    department: 'user',
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState({ email: '', department: '', Technoid: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.status === 201) {
        setSuccess('Registration successful! Please login.');
        setError('');
        setUserData({ email: '', Technoid: '', password: '', confirmPassword: '', department: 'Admin' });
        fetchUsers();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('User updated successfully');
        setError('');
        fetchUsers();
        setEditingUser(null);
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    applyFilters({ ...filter, [name]: value });
  };

  const applyFilters = (currentFilter) => {
    let filtered = [...users];
    if (currentFilter.email) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(currentFilter.email.toLowerCase())
      );
    }
    if (currentFilter.department) {
      filtered = filtered.filter((user) => user.department === currentFilter.department);
    }
    if (currentFilter.Technoid) {
      filtered = filtered.filter((user) =>
        user.Technoid?.toLowerCase().includes(currentFilter.Technoid.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  return (
    <div className="container-fluid lite-container">
      {success && (
        <div className="alert alert-success lite-alert" department="alert">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger lite-alert" department="alert">
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
                  <label htmlFor="department" className="form-label lite-label">department</label>
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
                {userData.department === 'Employee' && (
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
                    type={showPassword ? 'text' : 'password'}
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
                    type={showPassword ? 'text' : 'password'}
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
              <button type="submit" className="btn lite-btn-primary mt-3 w-100 text-white fw-bolder">Register</button>
            </form>
          </div>
        </div>
      </section>

      <section>
        <div className="card lite-card">
          <div className="card-body">
            <h2 className="card-title lite-title">Manage Users</h2>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control lite-input"
                  placeholder="Filter by Email"
                  name="email"
                  value={filter.email}
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
                  <option value="">Filter by role</option>
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
                      <p className="mb-1"><strong>role:</strong> {user.department}</p>
                      <p className="mb-1"><strong>Technoid:</strong> {user.technoid || 'N/A'}</p>
                      <p className="mb-1"><strong>Salary:</strong> {user.salary || 'N/A'}</p>
                      <p className="mb-1"><strong>Position:</strong> {user.position_id || 'N/A'}</p>
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
                  value={editingUser.salary || ''}
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
                  value={editingUser.position_id || ''}
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