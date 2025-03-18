import React, { createContext, useContext, useState, useEffect } from "react";

const MyContext = createContext();

export function MyProvider({ children }) {
  const [users, setUsers] = useState([]); // Array of users
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    userId: null, // Optional: useful for user-specific actions
    loading: true, // Track initial auth check
  });

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setAuthState({
            isAuthenticated: true,
            role: data.role,
            userId: data.id,
            loading: false,
          });
        } else {
          setAuthState({ isAuthenticated: false, role: null, userId: null, loading: false });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState({ isAuthenticated: false, role: null, userId: null, loading: false });
      }
    };
    checkAuth();
  }, []);

  // Function to add or update users array
  const addUser = (newUsers) => {
    setUsers(newUsers); // Expects an array of users
  };

  // Function to update auth state (e.g., after login/logout)
  const updateAuth = (isAuthenticated, role, userId) => {
    setAuthState({ isAuthenticated, role, userId, loading: false });
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      updateAuth(false, null, null);
    } catch (error) {
      console.error("Logout failed:", error);
      updateAuth(false, null, null);
    }
  };

  return (
    <MyContext.Provider value={{ users, addUser, authState, updateAuth, logout }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}