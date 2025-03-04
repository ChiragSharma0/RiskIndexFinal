import React, { useState } from 'react';
import './card.css';

const Card = ({ children,onNextClick }) => {
  const [isExiting, setIsExiting] = useState(false);

  function startExitAnimation() {
    setIsExiting(true);
  };

  const handleAnimationEnd = () => {
    if (isExiting && onNextClick) {
      onNextClick(); // Calls the onNextClick callback after the animation ends
      setIsExiting(false); // Resets the state
    }
  };

  return (
    <div
      className={`card ${isExiting ? 'animate-shrink-up' : 'animate-slide-in'}`}
      onAnimationEnd={handleAnimationEnd}

    >
      {children}
      
    </div>
  );
};

export default Card;
