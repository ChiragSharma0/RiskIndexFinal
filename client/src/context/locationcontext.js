import React, { createContext, useState, useEffect, useContext } from "react";
import { useSchedule } from "./schedule";
import { useTimeContext } from "./timecontext";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { schedule } = useSchedule();
  const { time } = useTimeContext();

  const home = schedule?.home;
  const work = schedule?.work;

  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
    error: "Fetching location...",
  });

  const [useLocation, setUseLocation] = useState({
    latitude: null,
    longitude: null,
    error: "Fetching location...",
  });

  const [hasPermission, setHasPermission] = useState(null);
  const [locationSource, setLocationSource] = useState("Transit");

  // ✅ Fetch user's current location & check permission
  useEffect(() => {
    console.log("🔄 [useEffect] Fetching user's current location...");

    if ("geolocation" in navigator) {
      navigator.permissions
        ?.query({ name: "geolocation" })
        .then((permissionStatus) => {
          console.log("📜 Geolocation permission status:", permissionStatus.state);
          if (permissionStatus.state === "granted") {
            setHasPermission(true);
          } else if (permissionStatus.state === "denied") {
            setHasPermission(false);
          }
        })
        .catch((error) => {
          console.error("⚠️ Error checking geolocation permission:", error);
          setHasPermission(false);
        });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("✅ Location retrieved:", position.coords);
          setHasPermission(true);
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: null,
          });
          console.log("📍 Updated currentLocation state:", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = "Unable to retrieve location.";
          setHasPermission(false);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "❌ User denied location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "❌ Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "❌ Location request timed out.";
              break;
            default:
              errorMessage = "❌ Unknown location error.";
          }
          console.error(errorMessage);
          setCurrentLocation({ lat: null, lng: null, error: errorMessage });
          console.log("📍 Updated currentLocation state:", { lat: null, lng: null, error: errorMessage });
        }
      );
    } else {
      console.error("❌ Geolocation not supported by the browser.");
      setHasPermission(false);
      setCurrentLocation({ lat: null, lng: null, error: "Geolocation not supported." });
    }
  }, []);

  // ✅ Set `useLocation` & `locationSource` based on time and schedule
  useEffect(() => {
    console.log("⏳ [useEffect] Checking location update...");

    if (time?.hrs !== undefined && Array.isArray(home?.hrs) && Array.isArray(work?.hrs)) {
      console.log(`⏰ Current time: ${time.hrs}`);
      const currentHour = Number(time?.hrs);
console.log("🛠 Converted time.hrs to Number:", currentHour);

      console.log("🏠 Home schedule:", home);
      console.log("🏢 Work schedule:", work);
      console.log("🔍 Checking home hours match:", home.hrs.includes(currentHour));
      console.log("🔍 Checking work hours match:", work.hrs.includes(currentHour));

      if (home.hrs.includes(currentHour)) {
        console.log("✅ Setting location to HOME:", home.location);
        setUseLocation(home.location || currentLocation);
        setLocationSource("Residence");
      } else if (work.hrs.includes(currentHour)) {
        console.log("✅ Setting location to WORK:", work.location);
        setUseLocation(work.location || currentLocation);
        setLocationSource("Workplace");
      } else {
        console.log("✅ Setting location to CURRENT LOCATION:", currentLocation);
        setUseLocation(currentLocation);
        setLocationSource("Transit");
      }

      console.log("📍 Updated useLocation state:", useLocation);
      console.log("🔄 Updated locationSource state:", locationSource);
    } else {
      console.warn("⚠️ `home.hrs` or `work.hrs` is undefined or not an array!");
    }
  }, [time?.hrs, schedule, currentLocation]);

  return (
    <LocationContext.Provider value={{ currentLocation, useLocation, hasPermission, locationSource }}>
      {children}
    </LocationContext.Provider>
  );
};

// 📌 Hook for consuming the LocationContext
export const useLocationContext = () => useContext(LocationContext);
