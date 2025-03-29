// File: ../Formelement/MapComponent.js
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

let mapInstance = null;
let marker = null;

export default function LocationModal({ initial = {}, onSave, onClose }) {
  const [selected, setSelected] = useState({
    lat: initial?.lat || 28.6139,
    lng: initial?.lng || 77.2090,
  });

  useEffect(() => {
    if (mapInstance) {
      mapInstance.remove();
    }

    mapInstance = L.map("map", {
      center: [selected.lat, selected.lng],
      zoom: 12,
      minZoom: 10,
      maxZoom: 17,
      maxBounds: L.latLngBounds(DELHI_BOUNDS.southWest, DELHI_BOUNDS.northEast),
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance);

    // Add marker initially
    marker = L.marker([selected.lat, selected.lng], { icon: customMarker }).addTo(mapInstance);

    mapInstance.on("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (
        lat < DELHI_BOUNDS.southWest.lat ||
        lat > DELHI_BOUNDS.northEast.lat ||
        lng < DELHI_BOUNDS.southWest.lng ||
        lng > DELHI_BOUNDS.northEast.lng
      ) {
        return;
      }

      setSelected({ lat, lng });

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng], { icon: customMarker }).addTo(mapInstance);
      }
    });
  }, []);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div id="map" style={{ height: "300px", borderRadius: "8px" }}></div>

        <p style={{ marginTop: "10px" }}>
          Selected Location: Lat {selected.lat.toFixed(5)}, Lng {selected.lng.toFixed(5)}
        </p>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            onClick={() => onSave(selected)}
            style={saveBtnStyle}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple inline styles
const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "1rem",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "600px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
};

const cancelBtnStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#888",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
};

const saveBtnStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#1976d2",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
};
