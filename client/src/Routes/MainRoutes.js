import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/homepage/home";
import Profile from "../pages/profile/profile";
import Test from "../components/profilepage/profiletabs";
import ProtectedRoute from "./AuthGuard";
import { TimeProvider } from "../context/timecontext";
import { ScheduleProvider } from "../context/schedule";
import FormContextProvider from "../context/formcontext";
import { HIProvider } from "../context/hicontext";
import { LocationProvider } from "../context/locationcontext";

const MainRoutes = () => {
  useEffect(() => {
    console.log("MainRoutes mounted");
  }, []);

  return (
    <ScheduleProvider>

    <TimeProvider>
      <LocationProvider>
      <HIProvider>
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
        </HIProvider>
        </LocationProvider>
    </TimeProvider>
    </ScheduleProvider>

  );
};

export default MainRoutes;
