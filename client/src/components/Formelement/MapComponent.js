import React, { useEffect, useState } from "react";
import L from "leaflet";
import styles from "../../styles/MapModal.module.css";
import { useLocationContext } from "../../context/locationcontext";

import "leaflet/dist/leaflet.css";

// Fix for missing default marker icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customMarker = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DELHI_BOUNDS = {
  southWest: L.latLng(28.40, 76.84),
  northEast: L.latLng(28.88, 77.30),
};

let mapInstance = null; // Store map instance globally

const LocationModal = () => {
  const { setCurrentLocation, setmodalopen } = useLocationContext();
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    locality: "Connaught Place, Delhi",
  });

  useEffect(() => {
    console.log("🔄 Mounting or re-opening modal...");

    if (mapInstance) {
      console.log("🗑️ Removing existing map...");
      mapInstance.remove();
    }

    console.log("🗺️ Creating new map...");
    mapInstance = L.map("map", {
      center: [28.6139, 77.2090], // Delhi Center
      zoom: 12,
      minZoom: 10,
      maxZoom: 17,
      maxBounds: L.latLngBounds(DELHI_BOUNDS.southWest, DELHI_BOUNDS.northEast),
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance);

    // Handle user clicks
    mapInstance.on("click", async (e) => {
      const lat = e.latlng.lat.toFixed(5);
      const lon = e.latlng.lng.toFixed(5);

      console.log(`📍 Clicked at: ${lat}, ${lon}`);

      // Ensure user selects within Delhi
      if (
        lat < DELHI_BOUNDS.southWest.lat ||
        lat > DELHI_BOUNDS.northEast.lat ||
        lon < DELHI_BOUNDS.southWest.lng ||
        lon > DELHI_BOUNDS.northEast.lng
      ) {
        console.log("❌ Out of Delhi boundaries! Selection rejected.");
        alert("Please select a location within Delhi.");
        return;
      }

      const locality = await getLocalityName(lat, lon);
      setSelectedLocation({
        latitude: parseFloat(lat).toFixed(6),
        longitude: parseFloat(lon).toFixed(6),
        locality,
      });

      console.log(`✅ Selected Location: ${locality}`);
    });

    return () => {
      console.log("🔄 Cleaning up map...");
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    };
  }, []);

  // Function to get locality name using reverse geocoding
  const getLocalityName = async (lat, lon) => {
    try {
      console.log(`🔄 Fetching locality name for ${lat}, ${lon}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name || "Unknown Location";
    } catch (error) {
      console.error("❌ Error fetching locality:", error);
      return "Unknown Location";
    }
  };

  // Save selected location and close modal

  const handleSaveLocation = () => {
    if (!selectedLocation) {
      console.error("⛔ No location selected!");
      return;
    }
  
    console.log("💾 Saving selected location:", selectedLocation);
    setCurrentLocation({
      latitude: parseFloat(selectedLocation.latitude).toFixed(6),
      longitude: parseFloat(selectedLocation.longitude).toFixed(6),
      error: null,
    });
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select Location (Delhi Only)</h2>

        {/* Map Container */}
        <div id="map" className={styles.mapContainer}></div>

        {/* Show selected location */}
        <div className={styles.selectedLocation}>
          <h4>📍 {selectedLocation.locality}</h4>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.saveButton} onClick={handleSaveLocation}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={() => setmodalopen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
