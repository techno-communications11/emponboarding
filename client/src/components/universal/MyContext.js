import React, { createContext, useContext, useState, useEffect } from "react";

const MyContext = createContext();

export function MyProvider({ children }) {
  const [users, setUsers] = useState([]); // Array of users
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    userId: null,
    loading: true,
  });

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      let retries = 3; // Number of retries
      while (retries > 0) {
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
            return; // Exit on success
          } else {
            console.error("Auth check failed:", response.statusText);
            retries--;
          }
        } catch (error) {
          console.error("Error checking auth:", error);
          retries--;
        }
      }
      // If all retries fail
      setAuthState({ isAuthenticated: false, role: null, userId: null, loading: false });
    };
    checkAuth();
  }, []);

  // Function to add or update users array
  const addUser = (newUsers) => {
    setUsers(newUsers);
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
      // Clear local state or storage
      localStorage.removeItem("userData"); // Example
      // Update auth state
      updateAuth(false, null, null);
      // setTimeout(() => {
      //   // Reload the page
      //   window.location.href = "/login"; 
      // }, 1000);
      // Redirect to login page (if using React Router)
      // Example
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