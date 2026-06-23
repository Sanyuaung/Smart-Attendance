import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { useThemeEngine } from "../hooks/useThemeEngine";
import { useWeatherLocation } from "../hooks/useWeatherLocation";
import { Pointer, Heart, Moon, TreePine, Flame, Droplets, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Fingerprint, Sparkles, Smile, Star, Zap, Coffee, Gift, Trophy, Music, Rocket, MapPin } from "lucide-react";

import RealisticMoon from "./RealisticMoon";

export default function HeroSection() {
  const { status, checkIn, checkOut, settings, images, imageTransitionSpeed, user, records } = useStore();
  const { currentTheme, moonPhase, moonAge, activeCustomThemeId, isMoonActive } = useThemeEngine();
  const activeCustomTheme = currentTheme === "custom" 
    ? (settings.customThemes?.find(t => t.id === (activeCustomThemeId || settings.selectedCustomThemeId)) || null)
    : null;
  const { weatherStr, isDay, condition, temp, city, precip } = useWeatherLocation();
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
      const g = greetings[currentGreetingIndex % greetings.length] || "Welcome Page";
      // Try to extract emoji at the end
      const match = g.match(/^(.*?)\s*([\p{Emoji_Presentation}\p{Extended_Pictographic}]+)?$/u);
      return {
        text: match?.[1] || g,
        emoji: match?.[2] || ""
      };
    } else {
      const hour = new Date().getHours();
      if (hour < 12) return { text: "Good Morning", emoji: "🌤️" };
      if (hour < 18) return { text: "Good Afternoon", emoji: "☀️" };
      return { text: "Good Evening", emoji: "🌙" };
    }
  };

  const activeGreeting = getDynamicGreetingText();

  const spawnParticles = () => {
    let customEmojisStr = "✨";
    let moonPhaseEmojis = "";

    // Check if the current moon phase has custom particle emojis defined
    if ((isMoonActive || currentTheme === "moon") && settings.moonCustomPhases?.[moonPhase]?.particleEmojis) {
      moonPhaseEmojis = settings.moonCustomPhases[moonPhase].particleEmojis || "";
    }

    if (moonPhaseEmojis.trim().length > 0) {
      customEmojisStr = moonPhaseEmojis;
    } else if (currentTheme === "custom") {
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
// Dynamic Theme Suitable Colors for icons and styling matching currently active theme
  const getThemeColorClass = () => {
    switch (currentTheme) {
      case "valentine":
        return "text-pink-500 dark:text-pink-400";
      case "thadingyut":
        return "text-amber-500 dark:text-amber-400";
      case "thingyan":
        return "text-sky-500 dark:text-sky-450 text-sky-500 dark:text-sky-400";
      case "christmas":
        return "text-emerald-500 dark:text-emerald-400";
      case "moon":
        return "text-[#38bdf8] dark:text-indigo-400";
      case "custom": {
        if (activeCustomTheme) {
          const baseColor = activeCustomTheme.baseColor;
          if (baseColor.includes("purple") || baseColor.includes("indigo")) return "text-purple-500 dark:text-purple-400";
          if (baseColor.includes("orange") || baseColor.includes("red")) return "text-orange-500 dark:text-orange-400";
          if (baseColor.includes("yellow") || baseColor.includes("amber")) return "text-amber-550 dark:text-amber-400";
          if (baseColor.includes("emerald") || baseColor.includes("teal") || baseColor.includes("green")) return "text-emerald-500 dark:text-emerald-400";
          if (baseColor.includes("cyan") || baseColor.includes("sky") || baseColor.includes("blue")) return "text-sky-500 dark:text-sky-400";
          if (baseColor.includes("pink") || baseColor.includes("rose")) return "text-pink-500 dark:text-pink-400";
          if (baseColor.includes("lime")) return "text-lime-500 dark:text-lime-400";
        }
        return "text-violet-500 dark:text-violet-400";
      }
      default:
        return "text-[#026cdd] dark:text-blue-400";
    }
  };

  const themeIconColor = getThemeColorClass();
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

  // Check if there is any check-in record today to refine display text
  const activeDateForStatus = settings.moonCustomDateEnabled && settings.moonCustomDate
    ? (() => {
        const parts = settings.moonCustomDate.split("-");
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          return new Date(y, m, d);
        }
        return new Date();
      })()
    : new Date();

  const hasCheckedInToday = records.some(r => {
    if (r.type !== "in") return false;
    const d = new Date(r.timestamp);
    return d.getFullYear() === activeDateForStatus.getFullYear() &&
           d.getMonth() === activeDateForStatus.getMonth() &&
           d.getDate() === activeDateForStatus.getDate();
  });

  const displayStatusStr = status === "Checked In" 
    ? "CHECKED IN" 
    : (status === "Checked Out" || status === "Absent") 
      ? (hasCheckedInToday ? "CHECKED OUT" : "NOT CHECKED IN") 
      : status.toUpperCase();

  const hasCenterBackground = (settings.showBackgroundImages && images.length > 0) || currentTheme === "moon" || isMoonActive;
  const isWeatherOnInCenter = hasCenterBackground && (settings.showWeather || settings.showLocation);

  // Standard premium biometric look for simple and clear Smart Attendance
  let buttonContent = isWeatherOnInCenter ? null : (
    <div className="flex flex-col items-center justify-center">
      <Pointer 
        className={`w-16 h-16 mb-2 transition-all duration-350 ${
          isCheckedIn 
            ? "text-emerald-100 dark:text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] animate-pulse" 
            : "text-blue-100 dark:text-blue-200 drop-shadow-[0_0_20px_rgba(147,197,253,0.5)]"
        }`} 
        strokeWidth={1.5} 
      />
      <div className={`font-bold tracking-widest text-lg transition-all duration-350 ${
          isCheckedIn 
            ? "text-emerald-50 dark:text-emerald-100 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" 
            : "text-blue-50 dark:text-blue-100 drop-shadow-[0_0_20px_rgba(147,197,253,0.5)]"
      }`}>
        {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
      </div>
    </div>
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
  let rippleColor = isCheckedIn 
    ? "bg-emerald-500/15 dark:bg-emerald-500/20"
    : "bg-blue-500/15 dark:bg-blue-500/20";
  let baseColorClass = isCheckedIn
    ? "border-emerald-300 dark:border-emerald-700/80 bg-gradient-to-b from-emerald-500 to-teal-600 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
    : "border-blue-300 dark:border-blue-800/80 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] shadow-[0_0_30px_rgba(59,130,246,0.35)]";

  if (currentTheme === "valentine") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-pink-500/20";
    baseColorClass = "border-pink-300 dark:border-pink-900 bg-gradient-to-b from-pink-500 to-rose-600";
    buttonContent = isWeatherOnInCenter ? null : (
      <div className="flex flex-col items-center justify-center">
        <Heart 
          className="w-16 h-16 mb-2 text-pink-100 fill-pink-100/30 animate-pulse transition-all duration-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" 
          strokeWidth={1.5} 
        />
        <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
          {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
        </div>
      </div>
    );
  } else if (currentTheme === "moon") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-indigo-400/40";
    baseColorClass = "border-0 bg-transparent shadow-none";
    const customImage = settings.moonCustomPhases?.[moonPhase]?.image;
    buttonContent = (
      <RealisticMoon age={moonAge} size={220} className="hover:scale-105 transition-transform duration-500" customImageUrl={customImage} pulseDuration={settings.ripplePulseDuration || 6} />
    );
  } else if (currentTheme === "christmas") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-emerald-500/20";
    baseColorClass = "border-emerald-300 bg-gradient-to-b from-emerald-600 to-green-700";
    buttonContent = isWeatherOnInCenter ? null : (
      <div className="flex flex-col items-center justify-center">
        <TreePine 
          className="w-16 h-16 mb-2 text-emerald-100 fill-emerald-100/30 animate-pulse transition-all duration-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
          strokeWidth={1.5} 
        />
        <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
          {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
        </div>
      </div>
    );
  } else if (currentTheme === "thadingyut") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-amber-500/20";
    baseColorClass = "border-amber-300 bg-gradient-to-b from-amber-500 to-orange-600";
    buttonContent = isWeatherOnInCenter ? null : (
      <div className="flex flex-col items-center justify-center">
        <Flame 
          className="w-16 h-16 mb-2 text-amber-100 fill-amber-100/30 animate-pulse transition-all duration-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
          strokeWidth={1.5} 
        />
        <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
          {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
        </div>
      </div>
    );
  } else if (currentTheme === "thingyan") {
    shapeClass = "rounded-full";
    rippleShapeClass = "rounded-full";
    rippleColor = "bg-sky-500/20";
    baseColorClass = "border-sky-300 bg-gradient-to-b from-sky-500 to-blue-600";
    buttonContent = isWeatherOnInCenter ? null : (
      <div className="flex flex-col items-center justify-center">
        <Droplets 
          className="w-16 h-16 mb-2 text-sky-100 fill-sky-100/30 animate-bounce transition-all duration-300 drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]" 
          strokeWidth={1.5} 
        />
        <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
          {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
        </div>
      </div>
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
    
    const moonPhaseImage = isMoonActive ? settings.moonCustomPhases?.[moonPhase]?.image : null;
    
    if (moonPhaseImage) {
       baseColorClass = "border-0 bg-transparent shadow-none";
       buttonContent = (
         <RealisticMoon 
           age={moonAge} 
           size={220} 
           className={`hover:scale-105 transition-transform duration-500`} 
           customImageUrl={moonPhaseImage} 
           pulseDuration={settings.ripplePulseDuration || 6}
         />
       );
    } else if (isWeatherOnInCenter) {
       buttonContent = null;
    } else if (CustomIcon) {
      buttonContent = (
        <div className="flex flex-col items-center justify-center">
          <motion.div
             animate={{ scale: finalInteractive === "pulse" ? [1, 1.06, 1] : 1, y: finalInteractive === "bounce" ? [0, -8, 0] : 0 }}
             transition={{ duration: settings.ripplePulseDuration || 6, repeat: Infinity, ease: "easeInOut" }}
             className="mb-2"
          >
            <CustomIcon 
              className={`w-16 h-16 text-white fill-white/10 transition-all drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
              strokeWidth={1.5}
            />
          </motion.div>
          <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
            {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
          </div>
        </div>
      );
    } else if (finalIcon.startsWith("http://") || finalIcon.startsWith("https://") || finalIcon.startsWith("data:image/")) {
      buttonContent = (
        <div className="flex flex-col items-center justify-center">
          <motion.img 
            src={finalIcon} 
            className={`w-[140px] h-[140px] rounded-full object-cover transition-transform hover:scale-105 mb-2`}
            animate={{ scale: finalInteractive === "pulse" ? [1, 1.06, 1] : 1, y: finalInteractive === "bounce" ? [0, -6, 0] : 0 }}
            transition={{ duration: settings.ripplePulseDuration || 6, repeat: Infinity, ease: "easeInOut" }}
            alt="Custom Theme Icon" 
            referrerPolicy="no-referrer" 
          />
          <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
            {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
          </div>
        </div>
      );
    } else {
      // Direct string, custom emoji/word written by user
      const customVal = finalIcon || "✨";
      // Detect if it is primarily an emoji/very short text
      const isShort = customVal.length <= 3;
      buttonContent = (
        <div className="flex flex-col items-center justify-center">
          <span className={`select-none font-bold text-white tracking-tight leading-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.45)] transition-all duration-300 block mb-2 ${interactiveAnim} ${
            isShort ? "text-5xl" : "text-base px-2 text-center break-words max-w-[150px]"
          }`}>
            {customVal}
          </span>
          <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
            {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
          </div>
        </div>
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
  } else if (currentTheme === "moon" || isMoonActive) {
    const customDesc = settings.moonCustomPhases?.[moonPhase]?.description;
    themeDescription = customDesc || `Lunar Alignment: ${moonPhase}`;
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

  let hasZeroBorder = baseColorClass.includes("border-0");
  let buttonClasses = `w-[220px] h-[220px] ${shapeClass} ${hasZeroBorder ? '' : 'border-[8px]'} ${baseColorClass} flex flex-col items-center justify-center relative z-20 text-white shadow-xl overflow-hidden transition-all duration-500`;

  const renderWeatherIcon = (colorOverride?: string) => {
    const style = colorOverride ? { color: colorOverride } : undefined;
    const cls = colorOverride ? "" : "mr-1.5";
    if (condition.includes("Cloudy") || condition.includes("Fog")) {
      return <Cloud className={`w-4 h-4 ${cls} text-slate-400`} style={style} />;
    } else if (condition.includes("Rain")) {
      return <CloudRain className={`w-4 h-4 ${cls} text-blue-400`} style={style} />;
    } else if (condition.includes("Snow")) {
      return <CloudSnow className={`w-4 h-4 ${cls} text-blue-200`} style={style} />;
    } else if (condition.includes("Storm")) {
      return <CloudLightning className={`w-4 h-4 ${cls} text-purple-400`} style={style} />;
    }
    return isDay ? (
      <Sun className={`w-4 h-4 ${cls} text-amber-500`} style={style} />
    ) : (
      <Moon className={`w-4 h-4 ${cls} text-indigo-400`} style={style} />
    );
  };

  const renderLargeWeatherIcon = (colorOverride?: string) => {
    const style = colorOverride ? { color: colorOverride } : undefined;
    if (condition.includes("Cloudy") || condition.includes("Fog")) return <Cloud className="w-10 h-10 mb-1 drop-shadow-md text-slate-400" style={style} strokeWidth={2} />;
    if (condition.includes("Rain")) return <CloudRain className="w-10 h-10 mb-1 drop-shadow-md text-blue-400" style={style} strokeWidth={2} />;
    if (condition.includes("Snow")) return <CloudSnow className="w-10 h-10 mb-1 drop-shadow-md text-blue-200" style={style} strokeWidth={2} />;
    if (condition.includes("Storm")) return <CloudLightning className="w-10 h-10 mb-1 drop-shadow-md text-purple-400" style={style} strokeWidth={2} />;
    return isDay ? (
      <Sun className="w-10 h-10 mb-1 drop-shadow-md text-amber-500" style={style} strokeWidth={2} />
    ) : (
      <Moon className="w-10 h-10 mb-1 drop-shadow-md text-indigo-400" style={style} strokeWidth={2} />
    );
  };

  const renderCenterOverlay = () => {
    if (!hasCenterBackground) return null;
    if (!settings.showWeather && !settings.showLocation) {
      const isMoonTheme = currentTheme === "moon" || (currentTheme === "custom" && isMoonActive);
      // Only show overlay for Moon themes (since Moon doesn't have its own icon/text in buttonContent).
      // For all other themes, buttonContent already renders the theme icon + dynamic text.
      if (isMoonTheme) {
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] z-30">
            <div className="flex flex-col items-center justify-center">
              <Pointer className="w-14 h-14 text-white mb-2 drop-shadow-md" strokeWidth={1.5} />
              <div className="text-white font-bold tracking-widest text-lg drop-shadow-md">
                {isCheckedIn ? "CHECKOUT" : "CHECKIN"}
              </div>
            </div>
          </div>
        );
      }
      return null;
    }
    
    const weatherColor = settings.weatherTextColor || "#3b82f6";
    const locationColor = settings.locationTextColor || "#10b981";

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
        <div className="flex flex-col items-center justify-center space-y-1">
          {settings.showLocation && city && (
            <div 
              className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1 drop-shadow-md opacity-95"
              style={{ color: locationColor }}
            >
              {city.split(',')[0]} WEATHER
            </div>
          )}
          {settings.showWeather && (
            <>
               <div style={{ color: weatherColor }}>
                 {renderLargeWeatherIcon(weatherColor)}
               </div>
               {temp !== null && (
                 <div 
                   className="text-4xl font-extrabold tracking-tight leading-none mb-0.5 drop-shadow-lg"
                   style={{ color: weatherColor }}
                 >
                   {temp.toFixed(1)}°C
                 </div>
               )}
               <div 
                 className="text-[13px] font-semibold opacity-95 mb-1.5 drop-shadow-md"
                 style={{ color: weatherColor }}
               >
                 {condition}
               </div>
               {precip !== undefined && precip !== null && (
                 <div 
                   className="flex items-center text-[10px] font-semibold opacity-90 mt-1 drop-shadow-md bg-black/10 px-2 py-0.5 rounded-full"
                   style={{ color: weatherColor }}
                 >
                   <CloudRain className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} style={{ color: weatherColor }} />
                   {precip.toFixed(1)}mm precip.
                 </div>
               )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Greeting and Weather Display */}
      <div className="flex flex-col items-center mb-8 text-center space-y-2">
        <div className="h-10 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={activeGreeting.text + activeGreeting.emoji}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-3xl md:text-4xl font-black text-[#0c3176] dark:text-white tracking-tighter flex items-center justify-center space-x-2"
            >
              <span>{activeGreeting.text}, {user.name.split(' ')[0]}</span>
              {activeGreeting.emoji && <span className="inline-block transform origin-bottom hover:rotate-12 transition-transform">{activeGreeting.emoji}</span>}
            </motion.h2>
          </AnimatePresence>
        </div>
        
        <div className="min-h-[1.5rem] flex flex-wrap items-center justify-center gap-2 mt-3 z-20 relative">
          {(settings.showWeather || settings.showLocation) && !hasCenterBackground && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-slate-500 dark:text-slate-300 text-xs font-semibold space-x-2 bg-slate-100/60 dark:bg-slate-800/40 px-3 py-1 rounded-full border border-slate-250/50 dark:border-slate-750/30 backdrop-blur-sm shadow-sm transition-all"
            >
              {settings.showWeather && (
                <span className="flex items-center" style={{ color: settings.weatherTextColor || "#3b82f6" }}>
                  {renderWeatherIcon(settings.weatherTextColor || "#3b82f6")}
                </span>
              )}
              {settings.showWeather && settings.showLocation && (
                <span className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
              )}
              {settings.showLocation && (
                <span className="flex items-center space-x-1 font-medium" style={{ color: settings.locationTextColor || "#10b981" }}>
                  <MapPin className="w-3.5 h-3.5 animate-pulse" style={{ color: settings.locationTextColor || "#10b981" }} />
                  <span>{weatherStr}</span>
                </span>
              )}
            </motion.div>
          )}

        </div>
      </div>

      <div className="relative w-full py-4 flex flex-col items-center justify-center overflow-visible z-10">
        <div className="relative group cursor-pointer select-none">
          
          {/* Animated Ripple Ring Behind Button */}
          {settings.animationsEnabled && (
            <motion.div 
              className={`absolute inset-0 ${rippleShapeClass} pointer-events-none ${rippleColor}`}
              animate={{
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: settings.ripplePulseDuration || 6,
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
              animate={{
                scale: [1, 1.04, 1]
              }}
              transition={{
                duration: settings.ripplePulseDuration || 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: settings.buttonHoverZoom !== undefined ? settings.buttonHoverZoom : 1.08 }}
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
                
                {/* Center Weather & Location Overlay */}
                {renderCenterOverlay()}
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
                
                {/* Center Weather & Location Overlay */}
                {renderCenterOverlay()}
              </div>
            </button>
          )}
        </div>

        {/* Simple & Clean Attendance status indicators */}
        {/* Attendance status block has been removed */}

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
