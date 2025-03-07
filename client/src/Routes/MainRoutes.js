import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/homepage/home";
import Profile from "../pages/profile/profile";
import Test from "../components/profilepage/profiletabs";
import ProtectedRoute from "./AuthGuard";
import { LocationProvider } from "../context/locationcontext";
import { ScheduleProvider } from "../context/schedule";
import FormContextProvider from "../context/formcontext";

const MainRoutes = () => {
  useEffect(() => {
    console.log("MainRoutes mounted");
  }, []);

  return (

    <LocationProvider>
      <ScheduleProvider>
        <FormContextProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/test" element={<Test />} />
            </Route>

            {/* Wildcard Route */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>

        </FormContextProvider>
      </ScheduleProvider>
    </LocationProvider>
  );
};

export default MainRoutes;
