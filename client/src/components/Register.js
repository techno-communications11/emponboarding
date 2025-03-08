import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Lottie from "lottie-react";
import Animation from "./RegisterAnimation.json";

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    Technoid:'',
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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match validation
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
//  console.log('userData:', userData);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.status===201) {
        setSuccess('Registration successful! Please login.');
        setError('');
        setUserData({ email: '',Technoid:'', password: '', confirmPassword: '', role: 'Admin' });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };



 

  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
      {success && (
        <div className="alert alert-success alert-dismissible mt-5">
          <strong>{success}</strong>
        </div>
      )}

      <div
        className="ms-2 rounded me-2 mb-1"
        style={{
          backgroundImage: "url(/register.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "150px",
          width: "99.5%",
          opacity: "0.9",
        }}
      >
        <h4 className="text-white mb-1 fs-1 text-center animate__animated animate__fadeIn pt-5">
          Register User
        </h4>
      </div>

      <div className="container-fluid d-flex gap-5 justify-content-around align-items-center">
        <div className="row w-100 justify-content-center p-5" style={{
              background:
              "linear-gradient(135deg,rgb(229, 237, 248) 0%,rgba(213, 245, 246, 0.32) 50%,rgba(248, 223, 241, 0.83) 100%)",
          }}>
          <div className="col-lg-3 me-5 col-md-3 mb-4 d-flex justify-content-center align-items-center">
            <Lottie
              className="mb-3"
              autoplay
              loop
              animationData={Animation}
              style={{ height: "100%", width: "100%" }}
            />
          </div>

          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-lg p-2">
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <h4 className="mb-3 text-center text-dark">Create Account</h4>

                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control shadow-none border"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <select
                      className="form-select shadow-none border"
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

                  {userData.role==='Employee'&&<div className="mb-3">
                    <input
                      type="Technoid"
                      className="form-control shadow-none border"
                      id="Technoid"
                      name="Technoid"
                      value={userData.Technoid}
                      onChange={handleChange}
                      placeholder="Enter Technoid"
                      required
                    />
                  </div>}


                  <div className="mb-3">
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control shadow-none border"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary shadow-none border"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control shadow-none border"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 text-white mt-2">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Register };
