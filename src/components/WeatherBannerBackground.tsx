import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface WeatherBannerBackgroundProps {
  condition: string;
  isDay: boolean;
}

export default function WeatherBannerBackground({ condition, isDay }: WeatherBannerBackgroundProps) {
  const [lightningFlash, setLightningFlash] = useState(false);
  const [lightningBranch, setLightningBranch] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Periodic lightning flashes and custom bolt paths for Stormy weather
  useEffect(() => {
    if (condition !== "Stormy") return;

    const triggerLightning = () => {
      // Create random zigzag lightning bolt coordinates
      const startX = 30 + Math.random() * 50;
      const segments = [];
      let currentX = startX;
      let currentY = 0;
      
      for (let i = 0; i < 5; i++) {
        const nextY = (i + 1) * 20;
        const nextX = currentX + (Math.random() - 0.5) * 15;
        segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
        currentX = nextX;
        currentY = nextY;
      }
      
      setLightningBranch(segments);
      setLightningFlash(true);

      // Double flash effect
      const offTimeout = setTimeout(() => {
        setLightningFlash(false);
        
        // Second quick flash
        setTimeout(() => {
          setLightningFlash(true);
          setTimeout(() => {
            setLightningFlash(false);
          }, 100);
        }, 120);
      }, 150);

      return () => {
        clearTimeout(offTimeout);
      };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerLightning();
      }
    }, 5000);

    // Initial bolt
    triggerLightning();

    return () => {
      clearInterval(interval);
    };
  }, [condition]);

  // Generate stable lists of elements to prevent layout/hydration issues
  const stars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 7 + 11) % 100}%`,
      top: `${(i * 13 + 5) % 90}%`,
      size: 0.8 + ((i * 3) % 4) * 0.4, // sizes 0.8px to 2.0px
      duration: 1.2 + ((i * 7) % 5) * 0.5, // 1.2s to 3.2s
      delay: (i * 0.1) % 2,
    }));
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      top: `${15 + i * 35}%`,
      delay: 4 + i * 12,
      duration: 1.2 + i * 0.5,
    }));
  }, []);

  const rainDrops = useMemo(() => {
    // Generate layered rain (Foreground, Midground, Background)
    return Array.from({ length: 65 }, (_, i) => {
      const depth = i % 3; // 0 = Background (fine/slow), 1 = Mid, 2 = Foreground (thick/fast)
      return {
        id: i,
        left: `${(i * 4.7 + 2) % 100}%`,
        depth,
        size: depth === 2 ? 1.8 : depth === 1 ? 1.1 : 0.6,
        length: depth === 2 ? 22 : depth === 1 ? 14 : 8,
        duration: depth === 2 ? 0.6 : depth === 1 ? 0.9 : 1.3,
        delay: (i * 0.08) % 1.5,
        opacity: depth === 2 ? 0.45 : depth === 1 ? 0.35 : 0.2,
      };
    });
  }, []);

  const splashRipples = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i * 17 + 9) % 100}%`,
      bottom: `${(i * 3) % 6}px`,
      delay: (i * 0.25) % 2,
      scale: 0.6 + (i % 3) * 0.3,
    }));
  }, []);

  const snowFlakes = useMemo(() => {
    // Layered snow with custom drifts
    return Array.from({ length: 45 }, (_, i) => {
      const depth = i % 3; // 0 = Background, 1 = Mid, 2 = Foreground
      return {
        id: i,
        left: `${(i * 6.3 + 3) % 100}%`,
        depth,
        size: depth === 2 ? 4.5 : depth === 1 ? 3.0 : 1.5,
        duration: depth === 2 ? 3.5 : depth === 1 ? 5.0 : 7.0,
        delay: (i * 0.18) % 4,
        opacity: depth === 2 ? 0.8 : depth === 1 ? 0.6 : 0.35,
        driftX: 10 + (i % 4) * 12, // drift swing amount
      };
    });
  }, []);

  const clouds = useMemo(() => {
    // Beautiful layered volumetric clouds
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: `${10 + i * 16}%`,
      scale: 0.6 + i * 0.15,
      duration: 35 + i * 15,
      delay: -i * 8,
      opacity: 0.25 + (i % 2) * 0.15,
      direction: i % 2 === 0 ? 1 : -1, // some move left, some right
    }));
  }, []);

  // Determine beautiful premium iOS weather sky gradients
  let bgGradient = "from-[#0a1c3a] via-[#102a5c] to-[#183d7a]"; // beautiful fallback deep twilight

  if (condition === "Clear") {
    bgGradient = isDay 
      ? "from-[#2f7fe5] via-[#4695eb] to-[#7db4f5]" // radiant bright iOS sky
      : "from-[#050b18] via-[#09152b] to-[#112447]"; // clear cosmic night
  } else if (condition === "Partly Cloudy") {
    bgGradient = isDay
      ? "from-[#4c7eb6] via-[#6194cb] to-[#8ebae4]" // soft daytime clouds
      : "from-[#080f1d] via-[#121c2f] to-[#1e2e4a]"; // deep nighttime cloudy
  } else if (condition === "Foggy") {
    bgGradient = isDay
      ? "from-[#636c7e] via-[#7d879c] to-[#9cb1c5]" // atmospheric morning mist
      : "from-[#1d232e] via-[#293241] to-[#3f4a5c]"; // eerie nighttime mist
  } else if (condition === "Rainy") {
    bgGradient = isDay
      ? "from-[#223142] via-[#334659] to-[#516b80]" // moody rainy daytime
      : "from-[#0b121a] via-[#16212d] to-[#253342]"; // rainy nighttime slate
  } else if (condition === "Snowy") {
    bgGradient = isDay
      ? "from-[#2c4054] via-[#435b73] to-[#718b9e]" // wintry soft daylight
      : "from-[#0a111a] via-[#15202c] to-[#2a3a4b]"; // frosty winter night
  } else if (condition === "Stormy") {
    bgGradient = isDay
      ? "from-[#111622] via-[#1d2436] to-[#343e54]" // menacing active storm storm front
      : "from-[#05080f] via-[#0e131f] to-[#182133]"; // intense electric night storm
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} transition-colors duration-1500 ease-in-out overflow-hidden pointer-events-none`}>
      
      {/* GLOW OVERLAYS */}
      {/* 3D Depth ambient radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />

      {/* 1. SUNNY / CLEAR DAY EFFECTS */}
      {condition === "Clear" && isDay && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Main glowing sun center */}
          <motion.div 
            className="absolute -right-6 -top-6 w-36 h-36 rounded-full bg-radial-gradient from-amber-100 via-yellow-300 to-amber-500 blur-[2px] opacity-90 shadow-[0_0_80px_rgba(251,191,36,0.6)]"
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.85, 0.95, 0.85],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Subtle Warm Atmospheric Corona */}
          <motion.div 
            className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-amber-400/20 blur-[30px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Golden Rotating Beams */}
          <motion.div 
            className="absolute -right-24 -top-24 w-72 h-72 rounded-full border-[1.5px] border-dashed border-amber-300/15"
            animate={{ rotate: 360 }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div 
            className="absolute -right-32 -top-32 w-88 h-88 rounded-full border border-dashed border-white/10"
            animate={{ rotate: -360 }}
            transition={{
              duration: 90,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Delicate iOS floating lens flares */}
          {[
            { id: 1, left: "20%", top: "75%", size: 10, opacity: 0.12, color: "bg-emerald-300/30" },
            { id: 2, left: "35%", top: "55%", size: 6, opacity: 0.15, color: "bg-amber-300/40" },
            { id: 3, left: "60%", top: "30%", size: 18, opacity: 0.08, color: "bg-rose-300/25" },
            { id: 4, left: "10%", top: "90%", size: 4, opacity: 0.2, color: "bg-blue-300/50" },
          ].map((flare) => (
            <motion.div
              key={`flare-${flare.id}`}
              className={`absolute rounded-full blur-[1px] ${flare.color}`}
              style={{
                left: flare.left,
                top: flare.top,
                width: flare.size,
                height: flare.size,
              }}
              animate={{
                x: [0, 15, -15, 0],
                y: [0, -10, 10, 0],
                opacity: [flare.opacity, flare.opacity * 1.5, flare.opacity * 0.7, flare.opacity],
              }}
              transition={{
                duration: 12 + flare.id * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* 2. STARS / CLEAR NIGHT EFFECTS */}
      {condition === "Clear" && !isDay && (
        <div className="absolute inset-0">
          {/* Dreamy moon crescent with glow */}
          <div className="absolute right-8 top-3 w-10 h-10 rounded-full bg-yellow-50/15 shadow-[inset_5px_-5px_0_0_#fef08a] opacity-90 blur-[0.3px] z-10" />
          <div className="absolute right-6 top-1 w-14 h-14 rounded-full bg-yellow-300/5 blur-[8px] pointer-events-none" />

          {/* Twinkling star field */}
          {stars.map((star) => (
            <motion.div
              key={`star-${star.id}`}
              className="absolute bg-white rounded-full"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
              }}
              animate={{
                opacity: [0.1, 0.85, 0.1],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Occasional shooting stars */}
          {shootingStars.map((s) => (
            <motion.div
              key={`shooting-${s.id}`}
              className="absolute h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
              style={{
                top: s.top,
                left: "-20%",
                width: "80px",
                transform: "rotate(-25deg)",
              }}
              animate={{
                left: ["-20%", "120%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                repeatDelay: 15 + s.id * 8,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* 3. PARTLY CLOUDY LAYERED VOLUMETRIC CLOUDS */}
      {condition === "Partly Cloudy" && (
        <div className="absolute inset-0">
          {/* Ambient lighting contrast back glow */}
          <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent blur-md opacity-40" />

          {/* Realistic Volumetric cloud layers with parallax speeds */}
          {clouds.map((cloud) => (
            <motion.div
              key={`partlycloud-${cloud.id}`}
              className="absolute text-white pointer-events-none select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              style={{
                top: cloud.top,
                scale: cloud.scale,
                opacity: cloud.opacity,
              }}
              animate={{
                x: cloud.direction > 0 ? ["-20vw", "110vw"] : ["110vw", "-20vw"],
              }}
              transition={{
                duration: cloud.duration,
                delay: cloud.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Complex gradient SVG Cloud for iOS depth styling */}
              <svg width="180" height="90" viewBox="0 0 180 90">
                <defs>
                  <linearGradient id={`cloudGrad-${cloud.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
                    <stop offset="70%" stopColor="#e2e8f0" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <path 
                  d="M 35,65 
                     A 25,25 0 0,1 55,25 
                     A 35,35 0 0,1 115,15 
                     A 30,30 0 0,1 155,40 
                     A 22,22 0 0,1 150,75 
                     Z" 
                  fill={`url(#cloudGrad-${cloud.id})`}
                />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* 4. FOGGY DRIVING MIST & OVERLAYS */}
      {condition === "Foggy" && (
        <div className="absolute inset-0">
          {/* Misty depth blur */}
          <div className="absolute inset-0 backdrop-blur-[0.4px] opacity-60 z-10" />

          {/* Multiple layers of dynamic flowing fog banks */}
          {[0, 1, 2, 3].map((idx) => (
            <motion.div
              key={`fog-bank-${idx}`}
              className="absolute w-[220%] bg-gradient-to-r from-transparent via-white/12 to-transparent filter blur-md"
              style={{ 
                top: `${idx * 24}%`, 
                left: "-60%",
                height: `${20 + idx * 8}%`
              }}
              animate={{
                x: idx % 2 === 0 ? ["-10%", "10%"] : ["10%", "-10%"],
                opacity: [0.35, 0.7, 0.35],
              }}
              transition={{
                x: {
                  duration: 14 + idx * 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 7 + idx * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
            />
          ))}
        </div>
      )}

      {/* 5. DENSE RAINY LAYERED SYSTEM */}
      {condition === "Rainy" && (
        <div className="absolute inset-0">
          {/* Soft cloud cover canopy at the top */}
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/25 to-transparent z-10 pointer-events-none" />

          {/* Triple-layered rain depth elements */}
          {rainDrops.map((drop) => (
            <motion.div
              key={`rain-drop-${drop.id}`}
              className="absolute bg-sky-200 rounded-full"
              style={{
                left: drop.left,
                width: `${drop.size}px`,
                height: `${drop.length}px`,
                opacity: drop.opacity,
                transform: "rotate(14deg)", // Wind angle matching iOS feel
              }}
              animate={{
                top: ["-40px", "125%"],
              }}
              transition={{
                duration: drop.duration,
                delay: drop.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Interactive splashing effect on ground */}
          {splashRipples.map((ripple) => (
            <motion.div
              key={`splash-${ripple.id}`}
              className="absolute border border-white/25 rounded-full"
              style={{
                left: ripple.left,
                bottom: ripple.bottom,
                width: "8px",
                height: "2.5px",
                transformOrigin: "center",
              }}
              animate={{
                scale: [0.1, ripple.scale, ripple.scale * 1.5],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 0.7,
                delay: ripple.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* 6. SNOWY SWIRLING PARALLAX DRIFTS */}
      {condition === "Snowy" && (
        <div className="absolute inset-0">
          {/* Layered crystalline snowflakes */}
          {snowFlakes.map((flake) => (
            <motion.div
              key={`snow-flake-${flake.id}`}
              className="absolute bg-white rounded-full"
              style={{
                left: flake.left,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: flake.opacity,
                filter: flake.depth === 2 ? "blur(0.4px)" : "none",
              }}
              animate={{
                top: ["-20px", "120%"],
                x: [0, flake.driftX, -flake.driftX, 0],
              }}
              transition={{
                top: {
                  duration: flake.duration,
                  delay: flake.delay,
                  repeat: Infinity,
                  ease: "linear",
                },
                x: {
                  duration: flake.duration * 0.6,
                  delay: flake.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
            />
          ))}

          {/* Gentle sweeping wind mist */}
          <motion.div 
            className="absolute inset-0 bg-white/5 pointer-events-none"
            animate={{
              opacity: [0.02, 0.08, 0.02],
              x: ["-5%", "5%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* 7. DYNAMIC STORMY ENVELOPE & INTERIOR GLOWS */}
      {condition === "Stormy" && (
        <div className="absolute inset-0">
          {/* Intense ambient lightning cloud flash inside */}
          <motion.div 
            className="absolute inset-0 bg-indigo-500/15 z-30 mix-blend-color-dodge"
            animate={{
              opacity: lightningFlash ? [0, 0.85, 0, 0.5, 0] : 0,
            }}
            transition={{ duration: 0.35 }}
          />

          {/* Lightning bolt visual vector branches */}
          {lightningFlash && lightningBranch.length > 0 && (
            <svg className="absolute inset-0 w-full h-full z-40 opacity-90 filter drop-shadow-[0_0_12px_rgba(224,242,254,1)]">
              {lightningBranch.map((seg, sIdx) => (
                <line
                  key={`seg-${sIdx}`}
                  x1={`${seg.x1}%`}
                  y1={`${seg.y1}%`}
                  x2={`${seg.x2}%`}
                  y2={`${seg.y2}%`}
                  stroke="#f0f9ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          )}

          {/* Quick falling storm heavy rain lines */}
          {rainDrops.slice(0, 40).map((drop) => (
            <motion.div
              key={`storm-rain-${drop.id}`}
              className="absolute bg-indigo-200/40 rounded-full"
              style={{
                left: drop.left,
                width: "1.4px",
                height: `${drop.length * 1.3}px`,
                transform: "rotate(18deg)",
              }}
              animate={{
                top: ["-30px", "125%"],
              }}
              transition={{
                duration: drop.duration * 0.7,
                delay: drop.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Menacing heavy dark storm clouds */}
          {clouds.slice(0, 3).map((cloud) => (
            <motion.div
              key={`stormcloud-${cloud.id}`}
              className="absolute text-slate-900 pointer-events-none select-none filter brightness-[0.4]"
              style={{
                top: cloud.top,
                scale: cloud.scale * 1.1,
                opacity: 0.5 + cloud.opacity,
              }}
              animate={{
                x: cloud.direction > 0 ? ["-15vw", "110vw"] : ["110vw", "-15vw"],
              }}
              transition={{
                duration: cloud.duration * 0.8,
                delay: cloud.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <svg width="200" height="100" viewBox="0 0 180 90">
                <path d="M 35,65 A 25,25 0 0,1 55,25 A 35,35 0 0,1 115,15 A 30,30 0 0,1 155,40 A 22,22 0 0,1 150,75 Z" fill="currentColor" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* Outer cinematic shadow mask */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none z-20" />
    </div>
  );
}
