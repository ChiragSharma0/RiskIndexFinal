import React, { useEffect, useState } from "react";
import { useTimeContext } from "../../context/timecontext"; // Import Time Context

// Dynamically import all images from the public/images folder
const importAllImages = (r) => {
  let images = {};
  r.keys().forEach((key) => {
    const fileName = key.replace("./", ""); // Remove "./" from filename
    images[fileName] = r(key); // Store image with filename as key
  });
  return images;
};

const images = importAllImages(require.context("/public/IMAGES/IMAGES", false, /\.(png|jpe?g|gif)$/));

const ImageSlider = () => {
  const { date, utctime } = useTimeContext(); // Get date & time from TimeContext
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const updateImage = () => {
      if (!date || !utctime) return; // Ensure date & time are available

      const day = date.date; // Extract day from "DD/MM/YYYY"
      const hour = utctime.hrs; // Extract hour from "HH:MM:SS"

      let imageName = `UTCI_${day}_${hour}.png`; // Expected filename format
      if (!images[imageName]) {
        imageName = "UTCI_10_12.png"; // Fallback image
      }

      setCurrentImage(images[imageName]);
    };

    updateImage(); // Set image immediately on mount

  }, [date, utctime]); // Depend on date & time from context

  return (
    <img id="URCIIMG" src={currentImage} alt="Weather-image" />
  );
};

export default ImageSlider;
