import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const url = process.env.REACT_APP_FETCH_LOCATION;
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
    min: 0o0,
    sec: 0o0,
  });

  const setFormattedTime = ({ hrs, min, sec }) => {
    setTime({
      hrs: formatTwoDigits(hrs),
      min: formatTwoDigits(min),
      sec: formatTwoDigits(sec),
    });
  };

  const [ismodalopen, setmodalopen] = useState(false);

  const [HIfinal, setHifinal] = useState(0.00);
  const [utciArray, setUtciArray] = useState([]);


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




  useEffect(() => {

    try {
      console.log("triggered ")
      updateHIFinal();
    } catch (error) {
      console.log(error);
      setHifinal(0.00);
    }
  }, [date.date, currentLocation, time.hrs]);

  const updateHIFinal = async () => {
    if (currentLocation) {
      const latitude = currentLocation.latitude;
      const longitude = currentLocation.longitude;

      // ✅ Fix the naming
      const currentDate = date.date; // or format as needed e.g. "2025-03-13"
      const currentHour = time.hrs;

      try {
        console.log("posting location")
        const response = await axios.post(`${url}`, {
          latitude,
          longitude,
          date: currentDate,
          hour: currentHour,
        });
        const { currentUTCI, utciNext24Hours } = response.data;
        const normalizedArray = utciNext24Hours.map((utci) => normalizeUTCI(utci.value));
        console.log("✅ setting hifinal:", normalizedArray[0]);
        setHifinal(normalizedArray[0]);
        setUtciArray(normalizedArray);

      } catch (error) {
        console.error("❌ Failed to fetch UTCI:", error.response?.data || error.message);
      }
    }
  };



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









  return (
    <LocationContext.Provider
      value={{
        date,
        setDate,  // ✅ Directly passing the state updater
        time,
        setTime, // ✅ replaces raw setTime
        currentLocation,
        setCurrentLocation,
        ismodalopen,
        setmodalopen,
        HIfinal,
        setHifinal,
        utciArray
      }}
    >
      {children}
    </LocationContext.Provider>
  );

};

export const useLocationContext = () => useContext(LocationContext);
