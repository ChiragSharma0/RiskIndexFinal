import React, { createContext, useContext, useState } from "react";

// Create Context
const PageContext = createContext();

// Custom Hook
export const usePageContext = () => useContext(PageContext);

// Provider Component
export const PageProvider = ({ children }) => {
  const [showPage, setShowPage] = useState("home"); // ✅ State to manage current page

  return (
    <PageContext.Provider value={{ showPage, setShowPage }}>
      {children}
    </PageContext.Provider>
  );
};
