import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const url = process.env.REACT_APP_FETCH_USER_DATA;
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userdata, setUserdata] = useState({
  });

  useEffect(() => {
    fetchdata();
  }, []);


  const fetchdata = async ()=>{
    const userid = localStorage.getItem("userid"); // Retrieve userid from localStorage
    
    try {
      const response = await axios.post(`${url}`, { userid });
  
      console.log("🔹 API response received user:", response.data.user);
  
      // ✅ Fix: Check `response.data.exists` instead of `response.data.user`
      if (response.status === 200 && response.data.user) {
          setUserdata(response.data.user);
      } 
  } catch (error) {
      console.error("❌ data fetch failed");
      
  } 
  };

useEffect(()=>{
  if(!userdata.UserName) return;
  console.log(userdata);
},[userdata])

  return (
    <UserContext.Provider value={{ userdata, setUserdata }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
