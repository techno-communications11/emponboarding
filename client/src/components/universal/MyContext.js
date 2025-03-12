import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export function MyProvider({ children }) {
  const [users, setUsers] = useState([]);

  const addUser = (newUsers) => {
    setUsers(newUsers); // Expects an array of users
  };

  return (
    <MyContext.Provider value={{ users, addUser }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}