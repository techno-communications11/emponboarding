import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../universal/MyContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updateAuth } = useMyContext();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loginResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Login failed");
      }

      const userResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/users/me`, {
        method: "GET",
        credentials: "include",
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error || "Failed to fetch user data");
      }

      const { role, id } = userData;
      console.log("Login successful, role:", role);

      // Update global auth state
      updateAuth(true, role, id);

      // Navigate based on role
      switch (role) {
        case "Admin":
          navigate("/admindashboard", { replace: true });
          break;
        case "Employee":
          navigate("/announcements", { replace: true });
          break;
        case "Training Team":
          navigate("/userdashboard", { replace: true });
          break;
        case "Ntid Setup team":
          navigate("/userdashboard", { replace: true });
          break;
        case "Ntid Creation Team":
          navigate("/userdashboard", { replace: true });
          break;
        case "Contract":
          navigate("/userdashboard", { replace: true });
          break;
        default:
          navigate("/userdashboard", { replace: true });
          break;
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err.message);
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
          className="col-md-6 d-flex justify-content-center align-items-center p-5"
        >
          <div
            className="card shadow-lg w-75 border-0 rounded-4"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(225, 1, 116, 0.1)",
            }}
          >
            <div className="card-body p-5">
              {error && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="alert alert-danger rounded-3"
                  style={{
                    borderColor: "#E10174",
                  }}
                >
                  {error}
                </motion.div>
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
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn text-white w-100 mt-3 rounded-pill"
                  style={{
                    backgroundColor: "#E10174",
                    borderColor: "#E10174",
                    padding: "12px",
                    boxShadow: "0 10px 20px rgba(225, 1, 116, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Login
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