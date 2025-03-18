


import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../universal/MyContext";

const PrivateRoute = ({ element }) => {
  const { authState } = useMyContext();

  if (authState.loading) return null; // Avoid flicker
  return authState.isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;