import React, { useState } from 'react';
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import axios from 'axios';
import './Styles/resetpassword.css';

const UpdatePassword = () => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Send a POST request to the backend API
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/reset-password`,
        {
          email: userData.email,
          newPassword: userData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies if needed
        }
      );

      // Handle success response
      if (response.status === 200) {
        setSuccess('Password reset successfully!');
        setUserData({ email: '', password: '' });
      } else {
        throw new Error(response.data.message || 'Password reset failed.');
      }
    } catch (err) {
      // Handle errors
      setError(
        err.response?.data?.message ||
          err.message ||
          'Password reset failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="container-fluid my-auto">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                {/* Header Section */}
                <div className="text-center mb-5">
                  <div className="avatar avatar-lg bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
                    <FaLock size={28} />
                  </div>
                  <h3 className="fw-bold mb-2">Reset Your Password</h3>
                  <p className="text-muted mb-0">
                    Enter your email and new password below
                  </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handlePasswordReset}>
                  {/* Email Input */}
                  <div className="input-group mb-4">
                    <span className="input-group-text border-end-0 bg-transparent">
                      <FaEnvelope className="text-muted" size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0 shadow-none border"
                      placeholder="Email address"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="input-group mb-4 position-relative">
                    <span className="input-group-text border-end-0 bg-transparent">
                      <FaLock className="text-muted" size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control border-start-0 ps-0 shadow-none border"
                      placeholder="New password"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-0 bg-transparent position-absolute end-0 top-50 translate-middle-y me-3"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-muted" size={18} />
                      ) : (
                        <FaEye className="text-muted" size={18} />
                      )}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 mb-4 rounded-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>

                {/* Alerts */}
                <div className="position-relative">
                  {success && (
                    <div
                      className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-0"
                      role="alert"
                    >
                      <FaCheckCircle className="me-2" size={18} />
                      <div>{success}</div>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess('')}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}
                  {error && (
                    <div
                      className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-0"
                      role="alert"
                    >
                      <FaExclamationTriangle className="me-2" size={18} />
                      <div>{error}</div>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError('')}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;