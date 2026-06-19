import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { useThemeEngine } from "../hooks/useThemeEngine";
import { useWeatherLocation } from "../hooks/useWeatherLocation";
import { Hand, Heart, Moon, TreePine, Flame, Droplets, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Fingerprint, Sparkles, Smile, Star, Zap, Coffee, Gift, Trophy, Music, Rocket } from "lucide-react";

export default function HeroSection() {
  const { status, checkIn, checkOut, settings, images, imageTransitionSpeed, user } = useStore();
  const { currentTheme, moonPhase } = useThemeEngine();
  const activeCustomTheme = currentTheme === "custom" 
    ? (settings.customThemes?.find(t => t.id === settings.selectedCustomThemeId) || null)
    : null;
  const { weatherStr, isDay, condition } = useWeatherLocation();
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, emoji: string, duration: number, targetX: number, targetY: number, rotation: number, scale: number }[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

  // Background transition (if enabled)
  useEffect(() => {
    if (images.length === 0 || !settings.showBackgroundImages) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, imageTransitionSpeed * 1000);
    return () => clearInterval(interval);
  }, [images.length, imageTransitionSpeed, settings.showBackgroundImages]);

  // Greeting cycling
  const greetings = settings.customGreetings && settings.customGreetings.length > 0 
    ? settings.customGreetings 
    : ["Good Morning", "Good Afternoon", "Good Evening"];

  useEffect(() => {
    if (!settings.customGreetingsEnabled || greetings.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, (settings.greetingTransitionSpeed || 3) * 1000);
    return () => clearInterval(interval);
  }, [greetings.length, settings.greetingTransitionSpeed, settings.customGreetingsEnabled]);

  // Greeting text calculation
  const getDynamicGreetingText = () => {
    if (settings.customGreetingsEnabled) {
      return greetings[currentGreetingIndex % greetings.length] || "Welcome Page";
    } else {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning 👋";
      if (hour < 18) return "Good Afternoon 🌤️";
      return "Good Evening 🌙";
    }
  };

  const activeGreetingText = getDynamicGreetingText();

  const spawnParticles = () => {
    let customEmojisStr = "✨";
    if (currentTheme === "custom") {
      customEmojisStr = activeCustomTheme?.emojis || settings.themeEmojis?.["custom"] || "✨ 🍭 🎉";
    } else {
      customEmojisStr = settings.themeEmojis?.[currentTheme] || "✨";
    }
    let customEmojis = customEmojisStr.split(/\s+/).filter(Boolean);
    if (customEmojis.length === 0) customEmojis = ["✨"];
    if (customEmojis.length > 5) customEmojis = customEmojis.slice(0, 5); // support more emojis if they want

    const directionSetting = settings.particleDirection || "default";
    let isFalling = false;
    let isExplode = false;

    if (directionSetting === "falling") {
      isFalling = true;
    } else if (directionSetting === "rising") {
      isFalling = false;
    } else if (directionSetting === "explode") {
      isExplode = true;
    } else {
      // Default fallback
      if (currentTheme === "thingyan" || currentTheme === "christmas") {
        isFalling = true;
      }
    }

    const count = settings.particleCount !== undefined ? settings.particleCount : 60;
    const minSpeed = settings.particleMinSpeed !== undefined ? settings.particleMinSpeed : 2;
    const maxSpeed = settings.particleMaxSpeed !== undefined ? settings.particleMaxSpeed : 5;

    const newParticles = Array.from({ length: count }).map((_, i) => {
      let startX = Math.random() * window.innerWidth;
      let startY = 0;
      let targetX = 0;
      let targetY = 0;

      if (isExplode) {
        startX = window.innerWidth / 2;
        startY = window.innerHeight / 2 + (window.scrollY || 0);
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 450;
        targetX = startX + Math.cos(angle) * distance;
        targetY = startY + Math.sin(angle) * distance;
      } else {
        startY = isFalling ? -50 : window.innerHeight + 50;
        targetY = isFalling ? window.innerHeight + 50 : -50;
        targetX = startX + (Math.random() - 0.5) * 200;
      }

      const emojiStr = customEmojis[Math.floor(Math.random() * customEmojis.length)];
      const duration = minSpeed + Math.random() * (maxSpeed - minSpeed);

      // Spin Speed tuning
      const spinSetting = settings.particleSpinSpeed || "medium";
      let baseSpin = 0;
      if (spinSetting === "slow") {
        baseSpin = (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 120);
      } else if (spinSetting === "medium") {
        baseSpin = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360);
      } else if (spinSetting === "fast") {
        baseSpin = (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 720);
      } else if (spinSetting === "random") {
        baseSpin = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 1440;
      }

      // Scale range tuning
      const scaleMin = settings.particleScaleMin !== undefined ? settings.particleScaleMin : 0.5;
      const scaleMax = settings.particleScaleMax !== undefined ? settings.particleScaleMax : 1.5;
      const scaleValue = scaleMin + Math.random() * (scaleMax - scaleMin);

      return {
        id: Date.now() + i + "_" + Math.random(),
        x: startX,
        y: startY,
        emoji: emojiStr,
        duration: duration,
        targetX: targetX,
        targetY: targetY,
        rotation: baseSpin,
        scale: scaleValue
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, maxSpeed * 1000 + 500);
  };

  const handleToggle = (e: React.MouseEvent) => {
    const now = Date.now();
    if (status === "Checked Out" || status === "Absent") {
      checkIn({ id: now.toString(), timestamp: now, type: "in" });
    } else {
      checkOut({ id: now.toString(), timestamp: now, type: "out", hoursSoFar: 8 });
    }
    
    if (settings.animationsEnabled) {
      spawnParticles();
    }
  };

  const isCheckedIn = status === "Checked In" || status === "Late";
  const actionText = isCheckedIn ? "CHECK OUT" : "CHECK IN";
  
  // Standard premium fingerprint biometric look for simple and clear Smart Attendance
  let buttonContent = (
    <Fingerprint 
      className={`w-28 h-28 transition-all duration-350 ${
        isCheckedIn 
          ? "text-emerald-100 dark:text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] animate-pulse" 
          : "text-blue-100 dark:text-blue-200 drop-shadow-[0_0_20px_rgba(147,197,253,0.5)]"
      }`} 
      strokeWidth={1.3} 
    />
  );

  const ICON_MAP: Record<string, React.ComponentType<any>> = {
    Heart,
    Moon,
    TreePine,
    Flame,
    Droplets,
    Sun,
    Fingerprint,
    Sparkles,
    Smile,
    Star,
    Zap,
    Coffee,
    Gift,
    Trophy,
    Music,
    Rocket
  };

  let shapeClass = "rounded-full";
  let rippleShapeClass = "rounded-full";
  let rippleColor = "bg-blue-500/10 dark:bg-blue-500/20";
  let baseColorClass = "border-[#dae6f2] dark:border-slate-700 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8]";

  if (currentTheme === "valentine") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-pink-500/20";
    baseColorClass = "border-pink-300 dark:border-pink-900 bg-gradient-to-b from-pink-500 to-rose-600";
    buttonContent = (
      <Heart 
        className="w-24 h-24 text-pink-100 fill-pink-100/30 animate-pulse transition-all duration-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" 
        strokeWidth={1.5} 
      />
    );
  } else if (currentTheme === "moon") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-indigo-400/40";
    baseColorClass = "border-indigo-500/30 dark:border-indigo-800 bg-gradient-to-b from-[#090d16] via-[#121132] to-[#201d4a] shadow-[0_0_30px_rgba(99,102,241,0.25)]";
    const moonEmoji = moonPhase.split(" ")[0] || "🌙";
    buttonContent = (
      <span className="text-[145px] leading-none select-none filter drop-shadow-[0_0_25px_rgba(255,255,255,0.45)] transition-transform duration-500 hover:rotate-12 animate-pulse block">
        {moonEmoji}
      </span>
    );
  } else if (currentTheme === "christmas") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-emerald-500/20";
    baseColorClass = "border-emerald-300 bg-gradient-to-b from-emerald-600 to-green-700";
    buttonContent = (
      <TreePine 
        className="w-24 h-24 text-emerald-100 fill-emerald-100/30 animate-pulse transition-all duration-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
        strokeWidth={1.5} 
      />
    );
  } else if (currentTheme === "thadingyut") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-amber-500/20";
    baseColorClass = "border-amber-300 bg-gradient-to-b from-amber-500 to-orange-600";
    buttonContent = (
      <Flame 
        className="w-24 h-24 text-amber-100 fill-amber-100/30 animate-pulse transition-all duration-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
        strokeWidth={1.5} 
      />
    );
  } else if (currentTheme === "thingyan") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-sky-500/20";
    baseColorClass = "border-sky-300 bg-gradient-to-b from-sky-500 to-blue-600";
    buttonContent = (
      <Droplets 
        className="w-24 h-24 text-sky-100 fill-sky-100/30 animate-bounce transition-all duration-300 drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]" 
        strokeWidth={1.5} 
      />
    );
  } else if (currentTheme === "custom") {
    const finalIcon = activeCustomTheme ? activeCustomTheme.icon : (settings.customThemeIcon || "Sparkles");
    const finalShape = activeCustomTheme ? activeCustomTheme.shape : (settings.customThemeShape || "rounded-full");
    const finalRipple = activeCustomTheme ? activeCustomTheme.rippleColor : (settings.customThemeRippleColor || "bg-indigo-500/20");
    const finalBaseColor = activeCustomTheme ? activeCustomTheme.baseColor : (settings.customThemeBaseColor || "border-indigo-300 bg-gradient-to-b from-indigo-500 to-purple-600");
    const finalInteractive = activeCustomTheme ? activeCustomTheme.interactiveEffect : (settings.customThemeInteractiveEffect || "pulse");

    shapeClass = finalShape;
    rippleShapeClass = finalShape;
    rippleColor = finalRipple;
    baseColorClass = finalBaseColor;
    
    const CustomIcon = ICON_MAP[finalIcon];
    let interactiveAnim = "";
    if (finalInteractive === "bounce") interactiveAnim = "animate-bounce";
    else if (finalInteractive === "pulse") interactiveAnim = "animate-pulse";
    else if (finalInteractive === "spin") interactiveAnim = "animate-spin";
    
    if (CustomIcon) {
      buttonContent = (
        <CustomIcon 
          className={`w-24 h-24 text-white fill-white/10 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ${interactiveAnim}`}
          strokeWidth={1.5}
        />
      );
    } else {
      // Direct string, custom emoji/word written by user
      const customVal = finalIcon || "✨";
      // Detect if it is primarily an emoji/very short text
      const isShort = customVal.length <= 3;
      buttonContent = (
        <span className={`select-none font-bold text-white tracking-tight leading-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.45)] transition-all duration-300 block ${interactiveAnim} ${
          isShort ? "text-7xl" : "text-xl px-2 text-center break-words max-w-[150px]"
        }`}>
          {customVal}
        </span>
      );
    }
  }

  // Explicit global color overrule for the pulsating concentric ripple halo around button
  if (settings.rippleGlowColor && settings.rippleGlowColor !== "theme") {
    if (settings.rippleGlowColor === "indigo") rippleColor = "bg-indigo-500/20";
    else if (settings.rippleGlowColor === "emerald") rippleColor = "bg-emerald-500/20";
    else if (settings.rippleGlowColor === "amber") rippleColor = "bg-amber-400/20";
    else if (settings.rippleGlowColor === "pink") rippleColor = "bg-pink-500/20";
    else if (settings.rippleGlowColor === "rose") rippleColor = "bg-rose-500/20";
    else if (settings.rippleGlowColor === "blue") rippleColor = "bg-blue-500/20";
    else if (settings.rippleGlowColor === "purple") rippleColor = "bg-purple-500/20";
    else if (settings.rippleGlowColor === "cyan") rippleColor = "bg-cyan-400/20";
    else if (settings.rippleGlowColor === "gold") rippleColor = "bg-amber-400/30 border border-amber-300/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
    else if (settings.rippleGlowColor === "rainbow") rippleColor = "bg-gradient-to-r from-red-500/20 via-green-500/25 via-blue-500/20 to-pink-500/25 animate-pulse";
  }

  // Setup theme-based descriptor underneath the circular button
  let themeDescription = "";

  if (currentTheme === "valentine") {
    themeDescription = "Valentine Theme Mode 💖";
  } else if (currentTheme === "moon") {
    themeDescription = `Lunar Alignment: ${moonPhase}`;
  } else if (currentTheme === "christmas") {
    themeDescription = "Holiday Greeting Mode 🎄";
  } else if (currentTheme === "thadingyut") {
    themeDescription = "Thadingyut Celebration Mode 🪔";
  } else if (currentTheme === "thingyan") {
    themeDescription = "Thingyan Festival Mode 💦";
  } else if (currentTheme === "custom") {
    const activeThemeName = activeCustomTheme ? activeCustomTheme.name : (settings.customThemeName || "Custom Gala");
    themeDescription = `${activeThemeName} Theme ✨`;
  } else {
    themeDescription = "Smart Attendance Tracker";
  }

  let buttonClasses = `w-[220px] h-[220px] ${shapeClass} border-[8px] ${baseColorClass} flex flex-col items-center justify-center relative z-20 text-white shadow-xl overflow-hidden transition-all duration-500`;

  const renderWeatherIcon = () => {
    if (condition.includes("Cloudy") || condition.includes("Fog")) {
      return <Cloud className="w-4 h-4 mr-1.5 text-slate-400" />;
    } else if (condition.includes("Rain")) {
      return <CloudRain className="w-4 h-4 mr-1.5 text-blue-400" />;
    } else if (condition.includes("Snow")) {
      return <CloudSnow className="w-4 h-4 mr-1.5 text-blue-200" />;
    } else if (condition.includes("Storm")) {
      return <CloudLightning className="w-4 h-4 mr-1.5 text-purple-400" />;
    }
    return isDay ? <Sun className="w-4 h-4 mr-1.5 text-amber-500" /> : <Moon className="w-4 h-4 mr-1.5 text-indigo-400" />;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Greeting and Weather Display */}
      <div className="flex flex-col items-center mb-8 text-center space-y-2">
        <div className="h-10 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={activeGreetingText}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white"
            >
              {activeGreetingText}, {user.name}
            </motion.h2>
          </AnimatePresence>
        </div>
        {settings.showWeather && (
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium">
            {renderWeatherIcon()}
            <span>{weatherStr}</span>
          </div>
        )}
      </div>

      <div className="relative w-full py-4 flex flex-col items-center justify-center overflow-visible z-10">
        <div className="relative group cursor-pointer select-none">
          
          {/* Animated Ripple Ring Behind Button */}
          {settings.animationsEnabled && (
            <motion.div 
              className={`absolute inset-0 ${rippleShapeClass} pointer-events-none ${rippleColor}`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: settings.ripplePulseDuration || 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* The Action Button */}
          {settings.animationsEnabled ? (
            <motion.button
              onClick={handleToggle}
              className={buttonClasses}
              whileHover={{ scale: settings.buttonHoverZoom !== undefined ? settings.buttonHoverZoom : 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Dynamic Image Background visible above container color but below content */}
              {settings.showBackgroundImages && images.length > 0 && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      initial={{ opacity: 0, scale: 1.15 }}
                      animate={{ opacity: 0.7, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  {/* Dark mask overlay to keep texts legible */}
                  <div className="absolute inset-0 bg-black/45 dark:bg-black/55 z-0" />
                </div>
              )}
              {/* Content overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center drop-shadow-md">
                {buttonContent}
              </div>
            </motion.button>
          ) : (
            <button onClick={handleToggle} className={buttonClasses}>
              {/* Dynamic Image Background visible above container color but below content */}
              {settings.showBackgroundImages && images.length > 0 && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={images[currentImageIndex]}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Dark mask overlay to keep texts legible */}
                  <div className="absolute inset-0 bg-black/45 dark:bg-black/55 z-0" />
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center justify-center drop-shadow-md">
                {buttonContent}
              </div>
            </button>
          )}
        </div>

        {/* Simple & Clean Attendance status indicators */}
        <div className="mt-8 flex flex-col items-center space-y-1.5 text-center select-none z-30 animate-fade-in max-w-[270px] w-full mx-auto px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Attendance Status
          </span>
          <span className={`text-3xl font-black tracking-widest uppercase transition-all duration-300 ${
            isCheckedIn 
              ? 'text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
              : 'text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]'
            }`}
          >
            {isCheckedIn ? "CHECK IN" : "CHECK OUT"}
          </span>
        </div>

        {/* Fullscreen Particles rendering */}
        {particles.map((p: any) => {
          const fadeMode = settings.particleFadeMode || "both";
          const opacities = (fadeMode === "fade" || fadeMode === "both") 
            ? [0, 1, 1, 0] 
            : [0, 1, 1, 1];
          const scales = (fadeMode === "scale" || fadeMode === "both")
            ? [0.2, p.scale, p.scale, 0]
            : [0.2, p.scale, p.scale, p.scale];

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.2, rotate: 0 }}
              animate={{ 
                opacity: opacities, 
                x: `calc(-50% + ${p.targetX - p.x}px)`, 
                y: `calc(-50% + ${p.targetY - p.y}px)`, 
                scale: scales,
                rotate: p.rotation
              }}
              transition={{ duration: p.duration, ease: "linear" }}
              className="fixed pointer-events-none z-[100] text-3xl sm:text-5xl drop-shadow-md"
              style={{ left: p.x, top: p.y }}
            >
              {p.emoji}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
