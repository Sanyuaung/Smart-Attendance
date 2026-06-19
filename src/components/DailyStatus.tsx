import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { MapPin, Clock, Calendar, Moon } from "lucide-react";
import { format } from "date-fns";

export default function DailyStatus() {
  const { records } = useStore();
  
  const today = new Date();
  const checkInRecord = records.find(r => r.type === "in");
  const checkOutRecord = records.find(r => r.type === "out");

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

      {/* Simple, sleek indicator of today's check-in/out times */}
      <div className="flex justify-center items-center space-x-6 text-[13px] md:text-sm text-slate-600 dark:text-slate-400 font-medium bg-white/40 dark:bg-slate-800/30 px-6 py-2.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm md:w-auto w-full max-w-[340px]">
        <div className="flex items-center space-x-1.5 justify-center flex-1 md:flex-initial">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="opacity-75">Check In:</span>
          <span className="font-bold text-slate-800 dark:text-white">
            {checkInRecord ? format(new Date(checkInRecord.timestamp), "h:mm a") : "--:-- AM"}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center space-x-1.5 justify-center flex-1 md:flex-initial">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-505 bg-rose-500" />
          <span className="opacity-75">Check Out:</span>
          <span className="font-bold text-slate-800 dark:text-white">
            {checkOutRecord ? format(new Date(checkOutRecord.timestamp), "h:mm a") : "--:-- PM"}
          </span>
        </div>
      </div>
    </div>
  );
}
