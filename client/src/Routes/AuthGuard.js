import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/Authcontext";

const ProtectedRoute = () => {
  const { isloggedin, isloading } = useAuthContext();

  useEffect(() => {
    console.log("ProtectedRoute rendered");
  }, []);

  if (isloading) return null; // ✅ Wait until loading is finished

  return isloggedin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
