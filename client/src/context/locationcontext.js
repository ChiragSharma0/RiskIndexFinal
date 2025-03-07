import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
    error: "Fetching location...",
  });

  const [date, setDate] = useState({
    date: 10,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [time, setTime] = useState({
    hrs: 12,
    min: new Date().getMinutes(),
    sec: new Date().getSeconds(),
  });
const [ ismodalopen,setmodalopen] = useState(false);
  
const[HIfinal,setHifinal] = useState(0.00);
  
  
const normalizeUTCI = (T) => {
  // Define UTCI categories based on the given table
  const categories = [
    { min: 9, max: 26, min_cat: 0.00, max_cat: 0.25 },
    { min: 26, max: 32, min_cat: 0.25, max_cat: 0.50 },
    { min: 32, max: 38, min_cat: 0.50, max_cat: 0.75 },
    { min: 38, max: 46, min_cat: 0.75, max_cat: 1.00 },
    { min: 46, max: Infinity, min_cat: 1.00, max_cat: 1.00 },
  ];

  // Find the category where T falls
  const category = categories.find(cat => T >= cat.min && T < cat.max);
  
  if (!category) return 0.00; // If T is undefined or out of range

  const { min, max, min_cat, max_cat } = category;

  // Apply the normalization formula
  const K = min_cat + (((T - min) / (max - min)) * (max_cat - min_cat));

  return K;
};

const fetchUTCI = async (latitude, longitude, utciKey) => {
  try {
    const response = await axios.post("http://localhost:5500/api/find/getutci", {
      latitude,
      longitude,
      utciKey,
    });

    if (response.data && response.data.utciValue !== undefined) {
      const T = response.data.utciValue;
      console.log("✅ Fetched UTCI:", T);

      // Normalize UTCI value
      const normalizedUTCI = normalizeUTCI(T);
      console.log("✅ Normalized UTCI:", normalizedUTCI);

      return normalizedUTCI; // ✅ Directly returning the normalized value
    } else {
      console.warn("⚠️ No UTCI data found for the given location.");
      return 0.00;
    }
  } catch (error) {
    console.error("❌ Error fetching UTCI:", error.response?.data?.error || error.message);
    return 0.00;
  }
};


const updateHIFinal = async () => {
  if(currentLocation){
  const latitude = currentLocation.latitude;
  const longitude = currentLocation.longitude;
  const utciKey = `UTCI_${date.date}_${time.hrs}`; // Change as needed

  const normalizedValue = await fetchUTCI(latitude, longitude, utciKey);
  console.log("setting hifinal",normalizedValue);
  setHifinal(normalizedValue); // ✅ Directly saving normalized UTCI
  }
};

useEffect(()=>{
 
try{
  updateHIFinal();
}catch(error){
console.log(error);
setHifinal(0.00);
}
},[date.date,currentLocation,time.hrs]);


  // Get the user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          let errorMessage = "Unable to retrieve location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "User denied location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "Unknown location error.";
          }
          setCurrentLocation({ latitude: null, longitude: null, error: errorMessage });
          console.error("❌ Location Error:", errorMessage);
        }
      );
    } else {
      setCurrentLocation({ latitude: null, longitude: null, error: "Geolocation not supported." });
      console.error("❌ Geolocation is not supported by this browser.");
    }
  }, []);


const formatTwoDigits = (num) => String(num).padStart(2, "0");

  // Auto-update time every second and ensure two-digit format
useEffect(() => {
  const interval = setInterval(() => {
    setTime((prev) => ({
      ...prev,
      min: formatTwoDigits(new Date().getMinutes()),
      sec: formatTwoDigits(new Date().getSeconds()),
    }));
  }, 1000);
  return () => clearInterval(interval);
}, []);





 

  return (
    <LocationContext.Provider
      value={{
        date,
        setDate,  // ✅ Directly passing the state updater
        time,
        setTime,  // ✅ Directly passing the state updater
        currentLocation,
        setCurrentLocation,
        ismodalopen,
        setmodalopen,
        HIfinal,
        setHifinal
      }}
    >
      {children}
    </LocationContext.Provider>
  );
  
};

export const useLocationContext = () => useContext(LocationContext);
  