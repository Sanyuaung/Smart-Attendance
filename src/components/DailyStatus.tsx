import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { useThemeEngine } from "../hooks/useThemeEngine";
import { MapPin, Clock, Calendar, Moon } from "lucide-react";
import { format } from "date-fns";

export default function DailyStatus() {
  const { records, settings } = useStore();
  const { currentTheme } = useThemeEngine();
  
  // Custom date handling that matches settings simulation
  const activeDate = settings.moonCustomDateEnabled && settings.moonCustomDate
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

  const formattedActiveDate = format(activeDate, "MM/dd/yyyy");

  // Find records matching active date
  const checkInRecord = records.find(r => {
    if (r.type !== "in") return false;
    const recordDate = new Date(r.timestamp);
    return recordDate.getFullYear() === activeDate.getFullYear() &&
           recordDate.getMonth() === activeDate.getMonth() &&
           recordDate.getDate() === activeDate.getDate();
  });

  const checkOutRecord = records.find(r => {
    if (r.type !== "out") return false;
    const recordDate = new Date(r.timestamp);
    return recordDate.getFullYear() === activeDate.getFullYear() &&
           recordDate.getMonth() === activeDate.getMonth() &&
           recordDate.getDate() === activeDate.getDate();
  });

  const [coords, setCoords] = useState<string>("Locating...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords(`(${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)})`);
        },
        () => {
          setCoords("Location unavailable");
        }
      );
    } else {
      setCoords("Geolocation not supported");
    }
  }, []);

  const checkInTimeText = checkInRecord
    ? format(new Date(checkInRecord.timestamp), "hh:mm a")
    : "--|--|--";

  const checkOutTimeText = checkOutRecord
    ? format(new Date(checkOutRecord.timestamp), "hh:mm a")
    : "--|--|--";

  const activeCustomTheme = currentTheme === "custom"
    ? (settings.customThemes?.find(t => t.id === settings.selectedCustomThemeId || t.id === settings.themeOverride) || null)
    : null;

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

  return (
    <div className="flex flex-col items-center mt-6 w-full max-w-lg z-10 px-4">
      {/* Location Line */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium mb-1 space-x-1 text-sm drop-shadow-sm">
          <MapPin className="w-4 h-4" />
          <span>Current Location</span>
        </div>
        <div className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-mono bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          {coords}
        </div>
      </div>

      {/* High Fidelity Card - Exact Match with Sample Image & Theme Adaptations */}
      <div 
        id="attendance-status-card" 
        className="w-full bg-white dark:bg-slate-800/90 backdrop-blur-sm border border-slate-100 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-md transition-all duration-300 transform hover:scale-[1.01]"
      >
        <div className="grid grid-cols-3 gap-3 text-center select-none items-stretch">
          {/* Check-In (Clock) Section */}
          <div className="flex flex-col items-center justify-between">
            <div className="p-1 mb-2 transform hover:scale-110 transition-transform duration-200">
              <Clock className={`w-8 h-8 ${themeIconColor}`} strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[12px] md:text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                {checkInRecord 
                  ? format(new Date(checkInRecord.timestamp), "MM/dd/yyyy") 
                  : formattedActiveDate}
              </span>
              <span className="text-xs md:text-[13px] text-slate-400 dark:text-slate-500 font-bold tracking-wider mt-1 font-mono">
                {checkInTimeText}
              </span>
            </div>
          </div>

          {/* Date (Calendar) Section */}
          <div className="flex flex-col items-center justify-between border-x border-slate-100 dark:border-slate-750 px-2">
            <div className="p-1 mb-2 transform hover:scale-110 transition-transform duration-200">
              <Calendar className={`w-8 h-8 ${themeIconColor}`} strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-[12px] md:text-sm font-semibold text-slate-705 text-slate-700 dark:text-slate-200 tracking-tight">
                {formattedActiveDate}
              </span>
            </div>
          </div>

          {/* Check-Out (Moon) Section */}
          <div className="flex flex-col items-center justify-between">
            <div className="p-1 mb-2 transform hover:scale-110 transition-transform duration-200">
              <Moon className={`w-8 h-8 ${themeIconColor}`} fill="currentColor" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[12px] md:text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                {checkOutRecord 
                  ? format(new Date(checkOutRecord.timestamp), "MM/dd/yyyy") 
                  : formattedActiveDate}
              </span>
              <span className="text-xs md:text-[13px] text-slate-400 dark:text-slate-500 font-bold tracking-wider mt-1 font-mono">
                {checkOutTimeText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
