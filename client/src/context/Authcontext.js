import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { LanguageContext } from "./TranslatorContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isloggedin, setlogin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const TODAY = new Date();
        console.log("AuthContext mounted at", TODAY);
    
        const userid = localStorage.getItem("userid");
        if (!userid) {
            setlogin(false);
            return;
        }
    
        verifyUser();
    
        return () => {
            console.log("AuthContext unmounted");  // ✅ Correct cleanup function
        };
    }, []);
    








    const verifyUser = async () => {
        console.log("🔹 Starting user verification...");
        const userid = localStorage.getItem("userid");
    
        if (!userid) {
            console.warn("⚠️ No user ID found. Redirecting to /auth...");
            setlogin(false);
            setLoading(false);
            return;
        }
    
        try {
            console.log("api initiated")
            const response = await axios.post("http://localhost:5500/api/auth/verify", { userid });
    
            console.log("🔹 API response received:", response);
    
            // ✅ Fix: Check `response.data.exists` instead of `response.data.user`
            if (response.status === 200 && response.data.exists) {
                setlogin(true);
            } else {
                setlogin(false);
            }
        } catch (error) {
            console.error("❌ User verification failed:", error);
            setlogin(false);
        } finally {
            setLoading(false);
        }
    };
    











    const logout = async () => {
        const userid = localStorage.getItem("userid");
        if (!userid) {
            console.warn("⚠️ No user ID found. Cannot log out.");
            return;
        }

        localStorage.removeItem("userid");
        setlogin(false);
    };

    return (

        <AuthContext.Provider value={{ isloggedin, loading, setlogin, logout }}>

            {children}

        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);