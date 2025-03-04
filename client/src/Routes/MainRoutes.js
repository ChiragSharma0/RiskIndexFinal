import React ,{memo} from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import AppContextProvider from "../context/Contextprovider";
import { LocationProvider } from "../context/locationcontext";

// Pages
import Home from "../pages/homepage/home";
import Profile from "../pages/profile/profile";
import Test from "../components/profilepage/profiletabs";
import { PageProvider } from "../context/pagecontext";

const MainRoutes = () => {
  const location = useLocation(); // ✅ Get the current location

  console.log("📍 Current Path:", location.pathname); // Debugging route changes

  return (
    <LocationProvider>
      <AppContextProvider>
        <PageProvider>
        <Routes >
         {/*  <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/test" element={<Test />} /> */}
          <Route path="/home" element={<Home />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        </PageProvider>
      </AppContextProvider>
    </LocationProvider>
  );
};

// ✅ Wrap MainRoutes inside BrowserRouter in App.js


export default memo(MainRoutes);
