import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

export type EventTheme = "valentine" | "thadingyut" | "thingyan" | "christmas" | "moon" | "custom" | "none";

function getMoonAge(date: Date): number {
  // More accurate Julian Date-based calculation
  const msPerDay = 1000 * 60 * 60 * 24;
  const jd = (date.getTime() / msPerDay) + 2440587.5;
  const synodicMonth = 29.53058867;
  // A known new moon was on Julian Date 2451550.1 (Jan 6, 2000 18:14 UTC)
  const newMoonJD = 2451550.1;
  let age = (jd - newMoonJD) % synodicMonth;
  if (age < 0) {
    age += synodicMonth;
  }
  return age;
}

function getMoonPhase(date: Date): string {
  const age = getMoonAge(date);
  
  // Normalize into 8 phases (each is ~3.69 days)
  // Shift by half a phase so that 0 is perfectly centered on New Moon
  const phase = (age / 29.53058867) * 8;
  const roundedPhase = Math.round(phase) % 8;

  switch (roundedPhase) {
    case 0: return "🌑 New Moon";
    case 1: return "🌒 Waxing Crescent";
    case 2: return "🌓 First Quarter";
    case 3: return "🌔 Waxing Gibbous";
    case 4: return "🌕 Full Moon";
    case 5: return "🌖 Waning Gibbous";
    case 6: return "🌗 Third Quarter";
    case 7: return "🌘 Waning Crescent";
    default: return "🌑 New Moon";
  }
}

function getSeasonalTheme(date: Date): EventTheme {
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 1 = Feb, etc.
  const day = date.getDate();

  // Valentine's: Feb 1 to Feb 18
  if (month === 1 && day >= 1 && day <= 18) {
    return "valentine";
  }
  // Thingyan Water Festival: Apr 5 to Apr 20
  if (month === 3 && day >= 5 && day <= 20) {
    return "thingyan";
  }
  // Thadingyut Light Festival: Oct 1 to Oct 31
  if (month === 9 && day >= 1 && day <= 31) {
    return "thadingyut";
  }
  // Christmas: Dec 10 to Dec 31, or Jan 1 to Jan 5
  if ((month === 11 && day >= 10) || (month === 0 && day <= 5)) {
    return "christmas";
  }

  return "none";
}

export function useThemeEngine() {
  const { settings } = useStore();
  const [currentTheme, setCurrentTheme] = useState<EventTheme>("none");
  const [activeCustomThemeId, setActiveCustomThemeId] = useState<string | null>(null);
  const [moonPhase, setMoonPhase] = useState<string>("🌑 New Moon");
  const [moonAge, setMoonAge] = useState<number>(0);
  const [isMoonActive, setIsMoonActive] = useState<boolean>(false);

  useEffect(() => {
    const checkTheme = () => {
      let targetDate = new Date();
      if (settings.moonCustomDateEnabled && settings.moonCustomDate) {
        const [y, m, d] = settings.moonCustomDate.split("-").map(Number);
        if (y && m && d) {
          targetDate = new Date(y, m - 1, d, targetDate.getHours(), targetDate.getMinutes(), targetDate.getSeconds());
        }
      }

      const calculatedMoonPhase = getMoonPhase(targetDate);
      setMoonPhase(calculatedMoonPhase);
      setMoonAge(getMoonAge(targetDate));

      const hour = targetDate.getHours();

      // Check moon theme first
      let isMoonTime = false;
      const startTimeStr = String(settings.moonThemeStartTime || "19:00");
      const [startHour, startMin] = startTimeStr.split(":").map(Number);
      const currentMins = hour * 60 + targetDate.getMinutes();
      const startMins = startHour * 60 + (startMin || 0);
      const endMins = 6 * 60; // Night goes until 6:00 AM morning

      if (startMins <= endMins) {
        // Night window is within the same calendar day
        if (currentMins >= startMins && currentMins < endMins) {
          isMoonTime = true;
        }
      } else {
        // Night window crosses midnight (e.g., 19:00 to 06:00)
        if (currentMins >= startMins || currentMins < endMins) {
          isMoonTime = true;
        }
      }

      // If Night/Moon theme is enabled and it is night, apply Moon theme (this takes priority)
      if (settings.moonThemeEnabled && isMoonTime) {
        setIsMoonActive(true);
        // 1. Check if there is a specific custom theme for the CURRENT moon phase
        const phaseSpecificOverride = settings.moonCustomPhases?.[calculatedMoonPhase]?.customThemeId;
        if (phaseSpecificOverride && phaseSpecificOverride !== "default" && phaseSpecificOverride !== "moon") {
          setCurrentTheme("custom");
          setActiveCustomThemeId(phaseSpecificOverride);
          return;
        }
        
        // 2. Otherwise fall back to the global Night/Moon override or default
        if (settings.moonThemeOverrideId && settings.moonThemeOverrideId !== "default") {
          setCurrentTheme("custom");
          setActiveCustomThemeId(settings.moonThemeOverrideId);
        } else {
          setCurrentTheme("moon");
          setActiveCustomThemeId(null);
        }
        return;
      }

      // Then fall back to Manual Theme Override (if set to something other than 'auto' or 'none')
      if (settings.themeOverride && settings.themeOverride !== "auto" && settings.themeOverride !== "none") {
        setIsMoonActive(false);
        setCurrentTheme(settings.themeOverride as EventTheme);
        if (settings.themeOverride === "custom") {
          setActiveCustomThemeId(settings.selectedCustomThemeId || null);
        } else {
          setActiveCustomThemeId(null);
        }
        return;
      }

      // If set to Auto Seasonal (Date-based), automatically check the calendar date
      if (settings.themeOverride === "auto") {
        setIsMoonActive(false);
        const seasonal = getSeasonalTheme(targetDate);
        setCurrentTheme(seasonal);
        setActiveCustomThemeId(null);
        return;
      }

      setCurrentTheme("none");
      setIsMoonActive(false);
      setActiveCustomThemeId(null);
    };

    checkTheme();
    const interval = setInterval(checkTheme, 15000); // Check every 15 seconds for simulation responsiveness
    return () => clearInterval(interval);
  }, [
    settings.moonThemeEnabled,
    settings.themeOverride,
    settings.moonThemeStartTime,
    settings.moonCustomDateEnabled,
    settings.moonCustomDate,
    settings.selectedCustomThemeId,
    settings.moonThemeOverrideId,
    settings.moonCustomPhases
  ]);

  return { currentTheme, moonPhase, moonAge, activeCustomThemeId, isMoonActive };
}
