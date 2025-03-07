import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AUthpage from "../pages/auth/authpage";

import Login from "../pages/auth/LoginForm";
import Register from "../pages/auth/RegisterForm"

const AuthRoutes = () => {
  useEffect(()=>{
    console.log("authroute accessed:");
  })

  
  return (
    
    <AUthpage>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
    </AUthpage>
  );
};

export default AuthRoutes;
