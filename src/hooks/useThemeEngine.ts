import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

export type EventTheme = "valentine" | "thadingyut" | "thingyan" | "christmas" | "moon" | "custom" | "none";

/**
 * Developer Math & Algorithm Guide: Moon Cycle Tracking
 * ====================================================
 * This function calculates the approximate "Lunar Age" (how many days into the 29.53-day cycle the moon is).
 * It uses Julian Dates (JD) to make calculations robust across timezones, leap years, and centuries.
 * 
 * Main Algorithm Steps:
 * 1. Find the milliseconds since Jan 1, 1970 UTC (`date.getTime()`).
 * 2. Convert to total days since Epoch (`msPerDay` = 86,400,000 ms).
 * 3. Offset to Julian Date scale by adding `2440587.5` (which represents the Julian Date of Jan 1, 1970).
 * 4. Choose a verified New Moon landmark reference epoch: Jan 6, 2000 at 18:14 UTC -> Julian Date `2451550.1`.
 * 5. Compute the elapsed days since that Landmark New Moon (`jd - newMoonJD`).
 * 6. Find the current position within the active lunar cycle by performing a remainder modulo on the astronomical synodic month cycle:
 *    `elapsedDays % 29.53058867 days`
 * 7. Correct negative remainders (if analyzing dates historically prior to Jan 6, 2000) by wrapping them around.
 * 
 * Example Calculation: 
 *   Input: June 23, 2026
 *   Julian Date computed: 2,461,214.58
 *   Landmark New Moon JD: 2,451,550.10
 *   Days Elapsed: 2,461,214.58 - 2,451,550.10 = 9664.48 days
 *   Remainder calculation: 9664.48 modulo 29.53058867 = 7.15 days (This is the Lunar Age, exactly in First Quarter phase!)
 */
function getMoonAge(date: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const jd = (date.getTime() / msPerDay) + 2440587.5;
  const synodicMonth = 29.53058867;
  const newMoonJD = 2451550.1;
  let age = (jd - newMoonJD) % synodicMonth;
  if (age < 0) {
    age += synodicMonth;
  }
  return age;
}

/**
 * Developer Math & Mapping Guide: Phase Splitting
 * ================================================
 * This function handles astronomical mapping from days (0 to 29.53) into exactly 8 distinct UI visual state indices (0 to 7).
 * 
 * Math mapping formulation:
 * 1. Normalization: `normalizedProgress = (age / 29.53058867)` is a scale strictly between 0.0 and 1.0. 
 * 2. Scaling: Multiplying by 8 maps this to `[0, 8)`.
 * 3. Centering Offset Correction: Because pure flooring or rounding around indices would make the "New Moon" 
 *    exist on both extremes, `Math.round(phase) % 8` perfectly aligns and centers each of the 8 stages symmetrically:
 *    - Case 0: Perfectly centered around 0 days (New Moon)
 *    - Case 2: Perfectly centered around 7.38 days (First Quarter Moon, ~25% of the total 29.53 cycle)
 *    - Case 4: Perfectly centered around 14.77 days (Full Moon, ~50% of the total 29.53 cycle)
 *    - Case 6: Perfectly centered around 22.15 days (Third Quarter Moon, ~75% of the total 29.53 cycle)
 */
function getMoonPhase(date: Date): string {
  const age = getMoonAge(date);
  
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
