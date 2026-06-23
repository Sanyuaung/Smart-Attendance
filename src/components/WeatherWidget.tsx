import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { Cloud, Droplets, Sun, Wind } from "lucide-react";

export default function WeatherWidget() {
  const { settings, lastRefresh } = useStore();
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!settings.showWeather) return;
    
    // Mock coordinates for Yangon roughly if none provided
    const fetchWeather = async () => {
      setWeather(null);
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=16.8409&longitude=96.1735&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto");
        const data = await res.json();
        setWeather(data.current);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
  }, [settings.showWeather, lastRefresh]);

  if (!settings.showWeather) return null;

  // very basic weather code map
  const isSunny = weather ? weather.weather_code <= 3 : false;
  
  return (
    <div className="relative overflow-hidden mb-8 transition-opacity duration-300 min-h-[80px]">
      {!weather ? (
        <div className="flex items-center justify-center space-x-2 text-slate-400">
          <Cloud className="animate-pulse w-5 h-5"/>
          <span className="text-sm font-medium">Fetching weather...</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Weather</p>
              <h2 className="text-3xl font-bold italic">
                {weather?.temperature_2m !== undefined ? Math.round(weather.temperature_2m) : "--"}°C
              </h2>
              <p className="text-sm text-indigo-300">{isSunny ? "Sunny" : "Cloudy"}</p>
            </div>
            <div className="text-4xl text-indigo-400">
              {isSunny ? <Sun className="w-8 h-8 text-amber-400" /> : <Cloud className="w-8 h-8 text-indigo-400" />}
            </div>
          </div>
          <div className="mt-4 flex space-x-4 text-[10px] text-slate-400 uppercase font-bold">
            <div className="flex items-center space-x-1">
              <Droplets className="w-3 h-3" />
              <span>Humidity: {weather?.relative_humidity_2m ?? "--"}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wind className="w-3 h-3" />
              <span>Wind: {weather?.wind_speed_10m ?? "--"}km/h</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
