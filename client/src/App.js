import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainRoutes from "./Routes/MainRoutes";
import AuthRoutes from "./Routes/AuthRoutes";
import { useAuthContext } from "./context/Authcontext";
import Loader from "./components/common/loader";

const App = () => {
  const { isloggedin, isloading } = useAuthContext();

  useEffect(()=>{
    console.log("app comp");
  })
  return (
    <div>
      {isloading ? (
        <Loader />
      ) : (
        <Routes>
          {isloggedin ? (
            <Route path="*" element={<MainRoutes />} />
          ) : (
            <Route path="*" element={<AuthRoutes />} />
          )}
        </Routes>
      )}
    </div>

  );
};

export default App;
