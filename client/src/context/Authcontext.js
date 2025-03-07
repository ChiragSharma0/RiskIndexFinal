import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
const verifyurl = process.env.REACT_APP_VERIFY_USER;
const getuser = process.env.REACT_APP_FETCH_USER_DATA;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isloggedin, setlogin] = useState(false);
    const [User, setUser] = useState({});
    const [isloading, setloading] = useState(true);

    useEffect(() => {
        console.log("AuthContext mounted at", new Date());
    
        const userid = localStorage.getItem("userid");
        if (!userid) {
            if (isloggedin) setlogin(false); // ✅ Avoid unnecessary state updates
            setloading(false);
            return;
        }
    
        if (!isloggedin) {
            setloading(true);
            verifyUser();
        }
    
        return () => console.log("AuthContext unmounted");
    }, []); // ✅ Adding dependencies safely
    







 
    const verifyUser = async () => {
        console.log("🔹 Verifying user...");
        const userid = localStorage.getItem("userid");
    
        if (!userid) {
            console.warn("⚠️ No user ID found. Redirecting to /login...");
            setlogin(false);
            return;
        }
    
        try {
            console.log(verifyurl);
            const response = await axios.post(`${verifyurl}`, { userid });
    
            if (response.status === 200 && response.data.exists) {
                console.log("✅ User verified, fetching user details...");
                const userResponse = await axios.post(`${getuser}`, { userid });
    
                if (userResponse.status === 200) {
                    setUser(userResponse.data);
                    console.log(userResponse.data);
                    setlogin(true);
                    
                } else {
                    setlogin(false);
                }
            } else {
                console.warn("⚠️ Invalid user ID. Logging out...");
                setlogin(false);
                localStorage.removeItem("userid");
            }
        } catch (error) {
            console.error("❌ Verification failed:", error);
            setlogin(false);
        } finally {
            setloading(false);
        }
    };
    











    const logout = async () => {
        const userid = localStorage.getItem("userid");
        if (!userid) {
            console.warn("⚠️ No user ID found. Cannot log out.");
            setlogin(false);
            return;
        }

        localStorage.removeItem("userid");
        setlogin(false);
    };

    return (

        <AuthContext.Provider value={{ isloggedin, isloading, setlogin, logout, User }}>

            {children}

        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);