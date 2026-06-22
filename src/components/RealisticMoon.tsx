import React from "react";

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
  const moonImageUrl = customImageUrl || "/src/assets/images/realistic_full_moon_hq_1782122147855.jpg";

  // Generate the SVG paths for the shadow overlay
  const getShadowPaths = () => {
    const paths = [];
    
    // We want the shadow to be semi-transparent black
    const shadowColor = "rgba(0, 0, 0, 0.85)";

    if (phase <= 0.25) {
      // Waxing Crescent
      // Dark covers all left, and shrinks on the right
      const p = phase / 0.25;
      const rx = 50 * (1 - p);
      paths.push(<path key="left" d="M 50,0 A 50,50 0 0,0 50,100 Z" fill={shadowColor} />);
      paths.push(<path key="right" d={`M 50,0 A ${rx},50 0 0,1 50,100 Z`} fill={shadowColor} />);
    } else if (phase <= 0.5) {
      // Waxing Gibbous
      // Dark is only a crescent on the left
      const p = (phase - 0.25) / 0.25;
      const rx = 50 * p;
      paths.push(<path key="crescent-left" d={`M 50,0 A 50,50 0 0,0 50,100 A ${rx},50 0 0,1 50,0 Z`} fill={shadowColor} />);
    } else if (phase <= 0.75) {
      // Waning Gibbous
      // Dark is only a crescent on the right
      const p = (phase - 0.5) / 0.25;
      const rx = 50 * (1 - p);
      paths.push(<path key="crescent-right" d={`M 50,0 A 50,50 0 0,1 50,100 A ${rx},50 0 0,0 50,0 Z`} fill={shadowColor} />);
    } else {
      // Waning Crescent
      // Dark covers all right, and grows on the left
      const p = (phase - 0.75) / 0.25;
      const rx = 50 * p;
      paths.push(<path key="right" d="M 50,0 A 50,50 0 0,1 50,100 Z" fill={shadowColor} />);
      paths.push(<path key="left" d={`M 50,0 A ${rx},50 0 0,0 50,100 Z`} fill={shadowColor} />);
    }

    return paths;
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
        className="absolute inset-0 w-full h-full object-cover z-0"
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
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        
        <g filter="url(#moon-blur)">
          {getShadowPaths()}
        </g>
      </svg>
      
      {/* Glow / Atmospheric effect */}
      <div className="absolute inset-0 z-20 pointer-events-none rounded-full ring-1 ring-white/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
