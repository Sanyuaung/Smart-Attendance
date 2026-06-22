import React from "react";
import defaultMoonImage from "../assets/images/realistic_full_moon_hq_1782122147855.jpg";

interface RealisticMoonProps {
  age: number; // 0 to 29.53
  size?: number;
  className?: string;
  customImageUrl?: string;
}

export default function RealisticMoon({ age, size = 200, className = "", customImageUrl }: RealisticMoonProps) {
  // Normalize age to a value between 0 and 1
  const phase = (age / 29.530588853) % 1;
  
  // The moon image I generated
  const moonImageUrl = customImageUrl || defaultMoonImage;

  // Generate the SVG single path for the shadow overlay
  const getShadowPathStr = () => {
    // We want the shadow to cover the portion of the Moon that is NOT lit.
    // A single closed path using two arc commands prevents any subpixel alignment lines or gaps in the middle of the Moon.
    if (phase <= 0.25) {
      // Waxing Crescent: Left half is dark, right half is partially dark (shrinking)
      const p = phase / 0.25;
      const rx = 50 * (1 - p);
      return `M 50,0 A 50,50 0 0,0 50,100 A ${rx},50 0 0,0 50,0 Z`;
    } else if (phase <= 0.5) {
      // Waxing Gibbous: Left half is partially dark (shrinking), right half is fully lit
      const p = (phase - 0.25) / 0.25;
      const rx = 50 * p;
      return `M 50,0 A 50,50 0 0,0 50,100 A ${rx},50 0 0,1 50,0 Z`;
    } else if (phase <= 0.75) {
      // Waning Gibbous: Left half is fully lit, right half is partially dark (growing)
      const p = (phase - 0.5) / 0.25;
      const rx = 50 * (1 - p);
      return `M 50,0 A 50,50 0 0,1 50,100 A ${rx},50 0 0,0 50,0 Z`;
    } else {
      // Waning Crescent: Right half is dark, left half is partially dark (growing)
      const p = (phase - 0.75) / 0.25;
      const rx = 50 * p;
      return `M 50,0 A 50,50 0 0,1 50,100 A ${rx},50 0 0,1 50,0 Z`;
    }
  };

  return (
    <div 
      className={`relative rounded-full bg-black overflow-hidden select-none shadow-2xl ${className}`}
      style={{ width: size, height: size }}
    >
      {/* The base moon texture (Full Moon) */}
      <img 
        src={moonImageUrl}
        alt="Moon Texture"
        className="absolute inset-0 w-full h-full object-cover z-0 scale-[1.33]"
        referrerPolicy="no-referrer"
      />

      {/* The SVG Shadow Overlay System */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        preserveAspectRatio="none"
      >
        {/* Soft edge filter to make the terminator look more realistic/atmospheric */}
        <defs>
          <filter id="moon-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        
        <g filter="url(#moon-blur)">
          <path d={getShadowPathStr()} fill="rgba(0, 0, 0, 0.85)" />
        </g>
      </svg>
      
      {/* Glow / Atmospheric effect */}
      <div className="absolute inset-0 z-20 pointer-events-none rounded-full ring-1 ring-white/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
