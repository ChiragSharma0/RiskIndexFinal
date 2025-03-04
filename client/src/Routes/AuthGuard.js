import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../components/context/Authcontext";

const AuthGuard = ({ children, isPublic = false }) => {
  const { isloggedin, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>; // Prevent flickering

  // If it's a public route (Auth pages) and the user is logged in, redirect to home
  if (isPublic && isloggedin) {
    return <Navigate to="/home" replace />;
  }

  // If it's a protected route (Main pages) and the user is NOT logged in, redirect to auth
  if (!isPublic && !isloggedin) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AuthGuard;
