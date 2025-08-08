// src/components/VantaBackground.jsx
import React, { useState, useEffect, useRef } from 'react';

// We no longer import RINGS from here.

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    // We check if the global VANTA object and the RINGS effect exist on the window
    if (window.VANTA && window.VANTA.RINGS && !vantaEffect) {
      // We call window.VANTA.RINGS directly
      setVantaEffect(window.VANTA.RINGS({
        el: vantaRef.current,
        // We need to reference THREE from the window object as well
        THREE: window.THREE, 
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0x1a202c,
      }));
    }
    // Cleanup function to destroy the effect when the component unmounts
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="relative min-h-screen w-full flex items-center justify-center">
      {children}
    </div>
  );
};

export default VantaBackground;
