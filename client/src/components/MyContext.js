import React, { createContext, useContext, useState } from "react";

// Create a Context
const MyContext = createContext();

// Create a Provider Component
const MyProvider = ({ children }) => {
    const [state, setState] = useState({
        contextname: "", // initial value
    });

    // Function to update the contextname value
    const setname = (newStoreValue) => {
        setState((prevState) => ({
            ...prevState,
            contextname: newStoreValue, // update only the contextstore property
        }));
    };

    console.log(state.contextstore, "stores got using context");

    return (
        <MyContext.Provider
            value={{
                ...state,
                setname,
            }}
        >
            {children}
        </MyContext.Provider>
    );
};

// Custom hook to use the context
const useMyContext = () => {
    return useContext(MyContext);
};

export { MyProvider, useMyContext };