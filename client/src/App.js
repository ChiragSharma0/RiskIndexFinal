import React, { memo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useAuthContext } from "./context/Authcontext";
import AuthRoutes from "./Routes/AuthRoutes";
import MainRoutes from "./Routes/MainRoutes";
import "./styles/home.css";
import { AuthProvider } from "./context/Authcontext";
import AuthPage from "./pages/auth/authpage";
import LoginForm from "./pages/auth/LoginForm";
import RegisterForm from "./pages/auth/RegisterForm";
const App = () => {
  const { isloggedin, loading } = useAuthContext();

  console.log("🔹 App component rendered. isloggedin =", isloggedin);

  useEffect(() => {
    console.log("loggin status :", isloggedin);
  }, [isloggedin])


  return (

    <div id='body'>
      {isloggedin ?
        (
          <div className="mainroutes">
             
    <MainRoutes />
            </div>

        ) : (

          <div className="authroutes">
              <AuthRoutes />
          </div>

        )}

    </div>
  );
};


export default App;
