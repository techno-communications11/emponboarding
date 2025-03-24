import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../universal/MyContext";
import CustomAlert from "../universal/CustomAlert";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateAuth } = useMyContext();
  const [showAlert, setShowAlert] = useState(false);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [credentials.email, credentials.password]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        setError("Please enter a valid email address");
        setShowAlert(true);
        return;
      }

      // Validate password length
      if (credentials.password.length < 6) {
        setError("Password must be at least 6 characters");
        setShowAlert(true);
        return;
      }

      // Attempt to log in
      const loginResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        setError(errorData.message || "Invalid email or password");
        setShowAlert(true);
        if (process.env.NODE_ENV !== 'production') {
          console.log("Login attempt failed");
        }
        return;
      }

      // Fetch user data only if login is successful
      const userResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/users/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!userResponse.ok) {
        setError("Failed to fetch user data");
        setShowAlert(true);
        if (process.env.NODE_ENV !== 'production') {
          console.log("User data fetch failed");
        }
        return;
      }

      const userData = await userResponse.json();
      const { role, id } = userData;

      // Update global auth state
      updateAuth(true, role, id);

      // Navigate based on role
      const roleRoutes = {
        Admin: "/admindashboard",
        Employee: "/announcements",
        "Training Team": "/userdashboard",
        "Ntid Setup team": "/userdashboard",
        "Ntid Creation Team": "/userdashboard",
        Contract: "/userdashboard",
      };

      navigate(roleRoutes[role] || "/userdashboard", { replace: true });

    } catch (err) {
      setError("An error occurred during login");
      setShowAlert(true);
      if (process.env.NODE_ENV !== 'production') {
        console.log("Login process encountered an error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center position-relative"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f3e7e9 100%)",
        overflow: "hidden",
      }}
    >
      {/* Decorative Shapes */}
      <div
        className="position-absolute"
        style={{
          top: "-10%",
          left: "-10%",
          width: "300px",
          height: "300px",
          background: "rgba(225, 1, 116, 0.1)",
          borderRadius: "50%",
          transform: "rotate(45deg)",
        }}
      />
      <div
        className="position-absolute"
        style={{
          bottom: "-10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "rgba(225, 1, 116, 0.05)",
          borderRadius: "50%",
          transform: "rotate(-45deg)",
        }}
      />

      {/* Centered Heading */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
        style={{
          color: "#E10174",
          fontWeight: "bold",
          fontSize: "4rem",
          letterSpacing: "2px",
          textShadow: "2px 2px 4px rgba(225, 1, 116, 0.1)",
        }}
      >
        Welcome Back!
      </motion.h1>

      <div className="row w-100 m-0">
        {/* Left side with logo */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-md-6 d-flex justify-content-center align-items-center"
        >
          <motion.img
            transition={{ type: "spring", stiffness: 300 }}
            src="logoT.webp"
            alt="Logo"
            className="img-fluid w-75"
          />
        </motion.div>

        {/* Right side with login form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-md-6 d-flex justify-content-center align-items-center p-2 p-lg-5"
        >
          <div
            className="card shadow-lg col-12 col-md-8 col-lg-10 border-0 rounded-4"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(225, 1, 116, 0.1)",
            }}
          >
            <div className="card-body p-5">
              {showAlert && (
                <CustomAlert
                  message={error}
                  type="error"
                  onClose={() => setShowAlert(false)}
                />
              )}

              <form onSubmit={handleSubmit}>
                <h4
                  className="mb-4 text-center fw-bold"
                  style={{
                    color: "#E10174",
                  }}
                >
                  Login to Your Account
                </h4>
                
                {/* Email Input */}
                <div className="mb-3 position-relative">
                  <input
                    type="email"
                    className="form-control shadow-none rounded-pill text-center"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    autoComplete="username"
                    style={{
                      borderColor: "#E10174",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                  <FaEnvelope
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                </div>
                
                {/* Password Input */}
                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control shadow-none rounded-pill text-center"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    minLength="6"
                    autoComplete="current-password"
                    style={{
                      borderColor: "#E10174",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                  <FaLock
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    className="position-absolute end-0 me-3 top-50 translate-middle-y"
                    style={{
                      cursor: "pointer",
                      color: "#E10174",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.span>
                </div>
                
                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn text-white w-100 mt-3 rounded-pill"
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#E10174",
                    borderColor: "#E10174",
                    padding: "12px",
                    boxShadow: "0 10px 20px rgba(225, 1, 116, 0.3)",
                    transition: "all 0.3s ease",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { Login };