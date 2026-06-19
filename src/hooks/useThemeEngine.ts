import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

export type EventTheme = "valentine" | "thadingyut" | "thingyan" | "christmas" | "moon" | "custom" | "none";

function getMoonAge(date: Date): number {
  // Reference New Moon: 1970-01-07 20:35 UTC (standard epoch for lunar phases)
  const reference = new Date(Date.UTC(1970, 0, 7, 20, 35, 0));
  const diffMs = date.getTime() - reference.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const phase = diffDays / 29.530588853;
  return (phase - Math.floor(phase)) * 29.530588853;
}

function getMoonPhase(date: Date): string {
  const age = getMoonAge(date);
  
  if (age < 1.845) return "🌑 New Moon";
  if (age < 5.537) return "🌒 Waxing Crescent";
  if (age < 9.228) return "🌓 First Quarter";
  if (age < 12.920) return "🌔 Waxing Gibbous";
  if (age < 16.611) return "🌕 Full Moon";
  if (age < 20.302) return "🌖 Waning Gibbous";
  if (age < 23.994) return "🌗 Last Quarter";
  if (age < 27.685) return "🌘 Waning Crescent";
  return "🌑 New Moon";
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
  const [moonPhase, setMoonPhase] = useState<string>("🌑 New Moon");

  useEffect(() => {
    const checkTheme = () => {
      let targetDate = new Date();
      if (settings.moonCustomDateEnabled && settings.moonCustomDate) {
        const [y, m, d] = settings.moonCustomDate.split("-").map(Number);
        if (y && m && d) {
          targetDate = new Date(y, m - 1, d, targetDate.getHours(), targetDate.getMinutes(), targetDate.getSeconds());
        }
      }

      setMoonPhase(getMoonPhase(targetDate));

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
        setCurrentTheme("moon");
        return;
      }

      // Then fall back to Manual Theme Override (if set to something other than 'auto' or 'none')
      if (settings.themeOverride && settings.themeOverride !== "auto" && settings.themeOverride !== "none") {
        setCurrentTheme(settings.themeOverride as EventTheme);
        return;
      }

      // If set to Auto Seasonal (Date-based), automatically check the calendar date
      if (settings.themeOverride === "auto") {
        const seasonal = getSeasonalTheme(targetDate);
        setCurrentTheme(seasonal);
        return;
      }

      setCurrentTheme("none");
    };

    checkTheme();
    const interval = setInterval(checkTheme, 15000); // Check every 15 seconds for simulation responsiveness
    return () => clearInterval(interval);
  }, [
    settings.moonThemeEnabled,
    settings.themeOverride,
    settings.moonThemeStartTime,
    settings.moonCustomDateEnabled,
    settings.moonCustomDate
  ]);

  return { currentTheme, moonPhase };
}
