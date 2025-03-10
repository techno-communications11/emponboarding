import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Lottie from 'lottie-react';
import Animation from './RegisterAnimation.json';
import './Register.css'; // Create this CSS file for custom styles

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    Technoid: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match validation
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess('Registration successful! Please login.');
        setError('');
        setUserData({ email: '', Technoid: '', password: '', confirmPassword: '', role: 'Admin' });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      {success && (
        <div className="alert alert-success">
          <strong>{success}</strong>
        </div>
      )}

      <div className="register-header">
        <h1>Register User</h1>
      </div>

      <div className="register-content">
        <div className="animation-container">
          <Lottie animationData={Animation} loop autoplay />
        </div>

        <div className="register-form-container">
          <div className="register-form-card">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <h2>Create Account</h2>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Employee">Employee</option>
                  <option value="Contract">Contract</option>
                  <option value="Ntid Creation Team">Ntid Creation Team</option>
                  <option value="Ntid Setup team">Ntid Setup Team</option>
                  <option value="Training Team">Training Team</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {userData.role === 'Employee' && (
                <div className="form-group">
                  <label htmlFor="Technoid">Technoid</label>
                  <input
                    type="text"
                    id="Technoid"
                    name="Technoid"
                    value={userData.Technoid}
                    onChange={handleChange}
                    placeholder="Enter your Technoid"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button type="submit" className="register-button">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Register };